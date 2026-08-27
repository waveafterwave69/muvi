import { supabase } from '@/shared/api/supabase'

const INACTIVITY_PERIOD_MS = 30 * 24 * 60 * 60 * 1000
const SWEEP_CACHE_MS = 60_000

interface StatusActivityRow {
  media_id: number
  created_at: string
  updated_at?: string
}

interface EpisodeActivityRow {
  media_id: number
  watched_at: string
}

interface CachedSweep {
  startedAt: number
  promise: Promise<void>
}

const sweepCache = new Map<string, CachedSweep>()

const runCachedSweep = (key: string, sweep: () => Promise<void>): Promise<void> => {
  const now = Date.now()
  const cached = sweepCache.get(key)

  if (cached && now - cached.startedAt < SWEEP_CACHE_MS) {
    return cached.promise
  }

  const promise = sweep().catch((error) => {
    sweepCache.delete(key)
    throw error
  })

  sweepCache.set(key, { startedAt: now, promise })
  return promise
}

const findInactiveMediaIds = async (
  rows: StatusActivityRow[],
  variant: 'solo' | 'couple',
  userId?: string,
): Promise<number[]> => {
  if (rows.length === 0) return []

  const mediaIds = rows.map((row) => row.media_id)
  let query = supabase
    .from(variant === 'solo' ? 'user_episode_progress' : 'couple_episode_progress')
    .select('media_id, watched_at')
    .in('media_id', mediaIds)

  if (variant === 'solo' && userId) {
    query = query.eq('user_id', userId)
  }

  const { data, error } = await query.overrideTypes<EpisodeActivityRow[], { merge: false }>()

  if (error) {
    throw new Error(`Не удалось проверить активность просмотра: ${error.message}`, {
      cause: error,
    })
  }

  const latestActivity = new Map<number, number>()

  data.forEach(({ media_id, watched_at }) => {
    const watchedAt = Date.parse(watched_at)
    const current = latestActivity.get(media_id) ?? 0

    if (watchedAt > current) {
      latestActivity.set(media_id, watchedAt)
    }
  })

  const cutoff = Date.now() - INACTIVITY_PERIOD_MS

  return rows
    .filter((row) => {
      const fallbackActivity = Date.parse(row.updated_at ?? row.created_at)
      const lastEpisodeActivity = latestActivity.get(row.media_id) ?? 0
      const lastActivity = Math.max(lastEpisodeActivity, fallbackActivity)

      return Number.isFinite(lastActivity) && lastActivity <= cutoff
    })
    .map((row) => row.media_id)
}

const dropInactiveUserTVMedia = async (userId: string): Promise<void> => {
  const { data, error } = await supabase
    .from('user_media')
    .select('media_id, created_at, updated_at, media:media!inner(type)')
    .eq('user_id', userId)
    .eq('status', 'watching')
    .eq('media.type', 'tv')
    .overrideTypes<StatusActivityRow[], { merge: false }>()

  if (error) {
    throw new Error(`Не удалось проверить неактивные сериалы: ${error.message}`, { cause: error })
  }

  const inactiveMediaIds = await findInactiveMediaIds(data, 'solo', userId)

  if (inactiveMediaIds.length === 0) return

  const { error: updateError } = await supabase
    .from('user_media')
    .update({ status: 'dropped' })
    .eq('user_id', userId)
    .eq('status', 'watching')
    .in('media_id', inactiveMediaIds)

  if (updateError) {
    throw new Error(`Не удалось перенести сериалы в заброшенные: ${updateError.message}`, {
      cause: updateError,
    })
  }
}

const dropInactiveCoupleTVMedia = async (coupleId?: string): Promise<void> => {
  let query = supabase
    .from('couple_media')
    .select('media_id, created_at, media:media!inner(type)')
    .eq('status', 'watching')
    .eq('media.type', 'tv')

  if (coupleId) {
    query = query.eq('couple_id', coupleId)
  }

  const { data, error } = await query.overrideTypes<StatusActivityRow[], { merge: false }>()

  if (error) {
    throw new Error(`Не удалось проверить неактивные сериалы пары: ${error.message}`, {
      cause: error,
    })
  }

  const inactiveMediaIds = await findInactiveMediaIds(data, 'couple')

  if (inactiveMediaIds.length === 0) return

  let updateQuery = supabase
    .from('couple_media')
    .update({ status: 'dropped' })
    .eq('status', 'watching')
    .in('media_id', inactiveMediaIds)

  if (coupleId) {
    updateQuery = updateQuery.eq('couple_id', coupleId)
  }

  const { error: updateError } = await updateQuery

  if (updateError) {
    throw new Error(`Не удалось перенести сериалы пары в заброшенные: ${updateError.message}`, {
      cause: updateError,
    })
  }
}

export const ensureInactiveUserTVMediaDropped = (userId: string): Promise<void> => {
  if (!userId) return Promise.resolve()
  return runCachedSweep(`solo:${userId}`, () => dropInactiveUserTVMedia(userId))
}

export const ensureInactiveCoupleTVMediaDropped = (coupleId?: string): Promise<void> =>
  runCachedSweep(`couple:${coupleId ?? 'current'}`, () => dropInactiveCoupleTVMedia(coupleId))
