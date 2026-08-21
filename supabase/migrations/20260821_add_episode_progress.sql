-- Выполните этот файл целиком в Supabase SQL Editor.
-- Прогресс хранится по отдельным сериям: это позволяет корректно считать
-- просмотренное и не терять данные, если у сериала появятся новые сезоны.

create table if not exists public.user_episode_progress (
  user_id uuid not null references auth.users(id) on delete cascade,
  media_id bigint not null references public.media(id) on delete cascade,
  season_number integer not null check (season_number >= 0),
  episode_number integer not null check (episode_number > 0),
  watched_at timestamptz not null default now(),
  created_at timestamptz not null default now(),

  constraint user_episode_progress_pkey
    primary key (user_id, media_id, season_number, episode_number)
);

create index if not exists user_episode_progress_media_idx
  on public.user_episode_progress (media_id, user_id);

alter table public.user_episode_progress enable row level security;

drop policy if exists "Users can read own episode progress"
  on public.user_episode_progress;
create policy "Users can read own episode progress"
  on public.user_episode_progress
  for select
  to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "Users can add own episode progress"
  on public.user_episode_progress;
create policy "Users can add own episode progress"
  on public.user_episode_progress
  for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

drop policy if exists "Users can update own episode progress"
  on public.user_episode_progress;
create policy "Users can update own episode progress"
  on public.user_episode_progress
  for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

drop policy if exists "Users can delete own episode progress"
  on public.user_episode_progress;
create policy "Users can delete own episode progress"
  on public.user_episode_progress
  for delete
  to authenticated
  using ((select auth.uid()) = user_id);

create or replace function public.set_episodes_watched(
  p_external_id bigint,
  p_season_number integer,
  p_episode_numbers integer[],
  p_watched boolean default true
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_media_id bigint;
begin
  if v_user_id is null then
    raise exception 'Требуется авторизация';
  end if;

  if p_season_number < 0 then
    raise exception 'Некорректный номер сезона';
  end if;

  if p_episode_numbers is null
    or cardinality(p_episode_numbers) = 0
    or exists (select 1 from unnest(p_episode_numbers) as episode_number where episode_number <= 0)
  then
    raise exception 'Некорректные номера серий';
  end if;

  select um.media_id
    into v_media_id
  from public.user_media as um
  join public.media as m on m.id = um.media_id
  where um.user_id = v_user_id
    and m.external_id = p_external_id
    and m.type = 'tv'
  limit 1;

  if v_media_id is null then
    raise exception 'Сначала добавьте сериал в свою коллекцию';
  end if;

  if p_watched then
    insert into public.user_episode_progress (
      user_id,
      media_id,
      season_number,
      episode_number,
      watched_at
    )
    select
      v_user_id,
      v_media_id,
      p_season_number,
      episode_number,
      now()
    from (
      select distinct unnest(p_episode_numbers) as episode_number
    ) as episodes
    on conflict (user_id, media_id, season_number, episode_number)
    do update set watched_at = excluded.watched_at;
  else
    delete from public.user_episode_progress
    where user_id = v_user_id
      and media_id = v_media_id
      and season_number = p_season_number
      and episode_number = any(p_episode_numbers);
  end if;
end;
$$;

revoke all on function public.set_episodes_watched(bigint, integer, integer[], boolean)
  from public, anon;
grant execute on function public.set_episodes_watched(bigint, integer, integer[], boolean)
  to authenticated;

grant select on public.user_episode_progress to authenticated;
