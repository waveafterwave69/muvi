-- Запрещает менять прогресс сериалов в статусах planned и dropped.
-- Уже сохранённые отметки не удаляются и остаются доступными для чтения.

create or replace function public.enforce_editable_episode_progress_status()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_media_id bigint;
  v_status text;
begin
  if v_user_id is null then
    raise exception 'Требуется авторизация';
  end if;

  if tg_op = 'DELETE' then
    v_media_id := old.media_id;
  else
    v_media_id := new.media_id;
  end if;

  select um.status::text
    into v_status
  from public.user_media as um
  where um.user_id = v_user_id
    and um.media_id = v_media_id
  limit 1;

  if v_status = 'planned' then
    raise exception 'Нельзя отмечать серии, пока сериал находится в избранном';
  end if;

  if v_status = 'dropped' then
    raise exception 'Нельзя менять прогресс заброшенного сериала';
  end if;

  if v_status is null or v_status not in ('watching', 'watched') then
    raise exception 'Текущий статус сериала не позволяет менять прогресс';
  end if;

  if tg_op = 'DELETE' then
    return old;
  end if;

  return new;
end;
$$;

drop trigger if exists enforce_editable_episode_progress_status
  on public.user_episode_progress;

create trigger enforce_editable_episode_progress_status
before insert or update or delete
on public.user_episode_progress
for each row
execute function public.enforce_editable_episode_progress_status();

revoke all on function public.enforce_editable_episode_progress_status()
  from public, anon, authenticated;

-- Атомарно отмечает все переданные серии после установки статуса watched.
create or replace function public.set_all_tv_episodes_watched(
  p_external_id bigint,
  p_episodes jsonb
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

  if p_episodes is null or jsonb_typeof(p_episodes) <> 'array' then
    raise exception 'Некорректный список серий';
  end if;

  select um.media_id
    into v_media_id
  from public.user_media as um
  join public.media as m on m.id = um.media_id
  where um.user_id = v_user_id
    and m.external_id = p_external_id
    and m.type = 'tv'
    and um.status::text = 'watched'
  limit 1;

  if v_media_id is null then
    raise exception 'Сериал должен иметь статус «Просмотрено»';
  end if;

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
    season.season_number,
    episode_number,
    now()
  from jsonb_to_recordset(p_episodes) as season(
    season_number integer,
    episode_numbers integer[]
  )
  cross join lateral unnest(season.episode_numbers) as episode_number
  where season.season_number > 0
    and episode_number > 0
  on conflict (user_id, media_id, season_number, episode_number)
  do update set watched_at = excluded.watched_at;
end;
$$;

revoke all on function public.set_all_tv_episodes_watched(bigint, jsonb)
  from public, anon;
grant execute on function public.set_all_tv_episodes_watched(bigint, jsonb)
  to authenticated;

-- Убирает сериал из user_media, не удаляя сохранённый прогресс по сериям.
create or replace function public.clear_tv_status(p_external_id bigint)
returns bigint
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

  delete from public.user_media as um
  using public.media as m
  where um.user_id = v_user_id
    and um.media_id = m.id
    and m.external_id = p_external_id
    and m.type = 'tv'
  returning um.media_id into v_media_id;

  return v_media_id;
end;
$$;

revoke all on function public.clear_tv_status(bigint)
  from public, anon;
grant execute on function public.clear_tv_status(bigint)
  to authenticated;
