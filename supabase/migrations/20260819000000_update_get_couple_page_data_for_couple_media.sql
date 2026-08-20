begin;

create or replace function public.get_couple_page_data()
returns jsonb
language plpgsql
stable
security definer
set search_path to ''
as $function$
declare
  v_user_id uuid := auth.uid();

  v_couple_id uuid;
  v_together_since timestamptz;

  v_outgoing_invite jsonb := null;
  v_incoming_invites jsonb := '[]'::jsonb;
  v_members jsonb := '[]'::jsonb;

  v_total_count integer := 0;
  v_planned_count integer := 0;
  v_watched_count integer := 0;

  v_common_ratings_count integer := 0;
  v_taste_match integer := null;
begin
  if v_user_id is null then
    raise exception 'authentication_required';
  end if;

  select
    member.couple_id,
    couple.created_at
  into
    v_couple_id,
    v_together_since
  from public.couple_members as member
  join public.couples as couple
    on couple.id = member.couple_id
  where member.user_id = v_user_id
    and member.left_at is null
    and couple.status = 'active'
  limit 1;

  if v_couple_id is null then
    select
      jsonb_build_object(
        'id', invite.id,
        'type', invite.invite_type,
        'expires_at', invite.expires_at
      )
      ||
      case
        when invite.invitee_id is not null then
          jsonb_build_object(
            'invitee',
            jsonb_build_object(
              'id', invitee.id,
              'username', invitee.username,
              'avatar_url', invitee.avatar_url,
              'created_at', invitee.created_at
            )
          )
        else
          '{}'::jsonb
      end
    into v_outgoing_invite
    from public.couple_invites as invite
    left join public.profiles as invitee
      on invitee.id = invite.invitee_id
    where invite.inviter_id = v_user_id
      and invite.status = 'pending'
      and invite.expires_at > now()
    order by invite.created_at desc
    limit 1;

    select coalesce(
      jsonb_agg(
        jsonb_build_object(
          'id', invite.id,
          'inviter',
          jsonb_build_object(
            'id', inviter.id,
            'username', inviter.username,
            'avatar_url', inviter.avatar_url,
            'created_at', inviter.created_at
          ),
          'expires_at', invite.expires_at
        )
        order by invite.created_at desc
      ),
      '[]'::jsonb
    )
    into v_incoming_invites
    from public.couple_invites as invite
    join public.profiles as inviter
      on inviter.id = invite.inviter_id
    where invite.invitee_id = v_user_id
      and invite.invite_type = 'direct'
      and invite.status = 'pending'
      and invite.expires_at > now();

    return jsonb_build_object(
      'state', 'unpaired',
      'outgoing_invite', v_outgoing_invite,
      'incoming_invites', v_incoming_invites,
      'couple', null
    );
  end if;

  select coalesce(
    jsonb_agg(
      jsonb_build_object(
        'id', profile.id,
        'username', profile.username,
        'avatar_url', profile.avatar_url,
        'created_at', profile.created_at,
        'joined_at', member.joined_at,
        'is_me', profile.id = v_user_id
      )
      order by member.slot
    ),
    '[]'::jsonb
  )
  into v_members
  from public.couple_members as member
  join public.profiles as profile
    on profile.id = member.user_id
  where member.couple_id = v_couple_id
    and member.left_at is null;

  select
    count(*)::integer,
    count(*) filter (
      where media.status = 'planned'
    )::integer,
    count(*) filter (
      where media.status = 'watched'
    )::integer
  into
    v_total_count,
    v_planned_count,
    v_watched_count
  from public.couple_media as media
  where media.couple_id = v_couple_id;

  select
    count(*)::integer,
    round(
      avg(
        100
        - abs(
          first_feedback.rating
          - second_feedback.rating
        ) * (100.0 / 9)
      )
    )::integer
  into
    v_common_ratings_count,
    v_taste_match
  from public.couple_media as media
  join public.couple_media_feedback as first_feedback
    on first_feedback.couple_media_id = media.id
  join public.couple_media_feedback as second_feedback
    on second_feedback.couple_media_id = media.id
    and first_feedback.user_id < second_feedback.user_id
  where media.couple_id = v_couple_id
    and first_feedback.rating is not null
    and second_feedback.rating is not null;

  if v_common_ratings_count < 3 then
    v_taste_match := null;
  end if;

  return jsonb_build_object(
    'state', 'active',
    'outgoing_invite', null,
    'incoming_invites', '[]'::jsonb,
    'couple',
    jsonb_build_object(
      'id', v_couple_id,
      'together_since', v_together_since,
      'members', v_members,
      'stats',
      jsonb_build_object(
        'total_count', v_total_count,
        'planned_count', v_planned_count,
        'watched_count', v_watched_count,
        'taste_match_percent', v_taste_match,
        'common_ratings_count', v_common_ratings_count,
        'ratings_needed', greatest(0, 3 - v_common_ratings_count)
      )
    )
  );
end;
$function$;

revoke all on function public.get_couple_page_data() from public;
grant execute on function public.get_couple_page_data() to authenticated;

notify pgrst, 'reload schema';

commit;
