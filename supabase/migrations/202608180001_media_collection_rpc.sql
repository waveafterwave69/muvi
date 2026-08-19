begin;

update public.media
set type = 'movie'
where type is null;

alter table public.media
  alter column type set not null;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conrelid = 'public.media'::regclass
      and conname = 'media_type_check'
  ) then
    alter table public.media
      add constraint media_type_check
      check (type in ('movie', 'tv'));
  end if;
end;
$$;

do $$
declare
  constraint_name text;
  index_name text;
begin
  for constraint_name in
    select constraint_row.conname
    from pg_constraint as constraint_row
    where constraint_row.conrelid = 'public.media'::regclass
      and constraint_row.contype = 'u'
      and (
        select array_agg(attribute.attname order by columns.ordinality)
        from unnest(constraint_row.conkey) with ordinality as columns(attnum, ordinality)
        join pg_attribute as attribute
          on attribute.attrelid = constraint_row.conrelid
         and attribute.attnum = columns.attnum
      ) = array['source', 'external_id']::name[]
  loop
    execute format('alter table public.media drop constraint %I', constraint_name);
  end loop;

  for index_name in
    select index_class.relname
    from pg_index as index_row
    join pg_class as table_class on table_class.oid = index_row.indrelid
    join pg_namespace as table_namespace on table_namespace.oid = table_class.relnamespace
    join pg_class as index_class on index_class.oid = index_row.indexrelid
    where table_namespace.nspname = 'public'
      and table_class.relname = 'media'
      and index_row.indisunique
      and not index_row.indisprimary
      and not exists (
        select 1
        from pg_constraint as constraint_row
        where constraint_row.conindid = index_row.indexrelid
      )
      and (
        select array_agg(attribute.attname order by columns.ordinality)
        from unnest(index_row.indkey::smallint[]) with ordinality as columns(attnum, ordinality)
        join pg_attribute as attribute
          on attribute.attrelid = index_row.indrelid
         and attribute.attnum = columns.attnum
        where columns.attnum > 0
      ) = array['source', 'external_id']::name[]
  loop
    execute format('drop index public.%I', index_name);
  end loop;
end;
$$;

create unique index if not exists media_source_type_external_id_key
  on public.media (source, type, external_id);

create or replace function public.add_media_to_collection(
  p_external_id bigint,
  p_type text,
  p_adult boolean,
  p_backdrop_path text,
  p_genre_ids integer[],
  p_original_language text,
  p_original_title text,
  p_overview text,
  p_popularity double precision,
  p_poster_path text,
  p_release_date date,
  p_title text,
  p_video boolean,
  p_vote_average double precision,
  p_vote_count integer,
  p_status public.movie_watch_status,
  p_comment text,
  p_rating smallint
)
returns bigint
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_user_id uuid := auth.uid();
  target_media_id bigint;
begin
  if current_user_id is null then
    raise exception 'Authentication required' using errcode = '42501';
  end if;

  if p_type not in ('movie', 'tv') then
    raise exception 'Unsupported media type: %', p_type using errcode = '22023';
  end if;

  insert into public.media (
    source,
    external_id,
    type,
    adult,
    backdrop_path,
    genre_ids,
    original_language,
    original_title,
    overview,
    popularity,
    poster_path,
    release_date,
    title,
    video,
    vote_average,
    vote_count
  )
  values (
    'tmdb',
    p_external_id,
    p_type,
    p_adult,
    p_backdrop_path,
    p_genre_ids,
    p_original_language,
    p_original_title,
    p_overview,
    p_popularity,
    p_poster_path,
    p_release_date,
    p_title,
    p_video,
    p_vote_average,
    p_vote_count
  )
  on conflict (source, type, external_id)
  do update set
    adult = excluded.adult,
    backdrop_path = excluded.backdrop_path,
    genre_ids = excluded.genre_ids,
    original_language = excluded.original_language,
    original_title = excluded.original_title,
    overview = excluded.overview,
    popularity = excluded.popularity,
    poster_path = excluded.poster_path,
    release_date = excluded.release_date,
    title = excluded.title,
    video = excluded.video,
    vote_average = excluded.vote_average,
    vote_count = excluded.vote_count,
    updated_at = now()
  returning id into target_media_id;

  insert into public.user_media (
    user_id,
    media_id,
    status,
    comment,
    rating,
    watched_at
  )
  values (
    current_user_id,
    target_media_id,
    p_status,
    p_comment,
    p_rating,
    case when p_status = 'watched' then now() else null end
  )
  on conflict (user_id, media_id)
  do update set
    status = excluded.status,
    comment = excluded.comment,
    rating = excluded.rating,
    watched_at = case
      when excluded.status = 'watched'
        then coalesce(user_media.watched_at, excluded.watched_at)
      else null
    end,
    updated_at = now();

  return target_media_id;
end;
$$;

create or replace function public.remove_media_from_collection(
  p_external_id bigint,
  p_type text
)
returns bigint
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_user_id uuid := auth.uid();
  deleted_media_id bigint;
begin
  if current_user_id is null then
    raise exception 'Authentication required' using errcode = '42501';
  end if;

  delete from public.user_media as user_item
  using public.media as media_item
  where user_item.user_id = current_user_id
    and user_item.media_id = media_item.id
    and media_item.source = 'tmdb'
    and media_item.type = p_type
    and media_item.external_id = p_external_id
  returning user_item.media_id into deleted_media_id;

  return deleted_media_id;
end;
$$;

revoke all on function public.add_media_to_collection(
  bigint, text, boolean, text, integer[], text, text, text, double precision,
  text, date, text, boolean, double precision, integer, public.movie_watch_status, text, smallint
) from public;

revoke all on function public.remove_media_from_collection(bigint, text) from public;

grant execute on function public.add_media_to_collection(
  bigint, text, boolean, text, integer[], text, text, text, double precision,
  text, date, text, boolean, double precision, integer, public.movie_watch_status, text, smallint
) to authenticated;

grant execute on function public.remove_media_from_collection(bigint, text) to authenticated;

notify pgrst, 'reload schema';

commit;
