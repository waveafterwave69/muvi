import { supabase } from '@/shared/api/supabase'
import type { EpisodeProgress, SetEpisodesWatchedParams, TVEpisodeCount } from './types'

interface EpisodeProgressRow extends EpisodeProgress {
  media: {
    external_id: number
    type: 'tv'
  }
}

export const getEpisodeProgress = async (
  userId: string,
  externalMediaId: number,
): Promise<EpisodeProgress[]> => {
  const { data, error } = await supabase
    .from('user_episode_progress')
    .select(
      `
        season_number,
        episode_number,
        watched_at,
        media:media!inner(external_id, type)
      `,
    )
    .eq('user_id', userId)
    .eq('media.external_id', externalMediaId)
    .eq('media.type', 'tv')
    .overrideTypes<EpisodeProgressRow[], { merge: false }>()

  if (error) {
    throw new Error(`Не удалось загрузить прогресс: ${error.message}`, { cause: error })
  }

  return data.map(({ season_number, episode_number, watched_at }) => ({
    season_number,
    episode_number,
    watched_at,
  }))
}

export const setEpisodesWatched = async ({
  mediaId,
  seasonNumber,
  episodeNumbers,
  watched,
}: SetEpisodesWatchedParams): Promise<void> => {
  const { error } = await supabase.rpc('set_episodes_watched', {
    p_external_id: mediaId,
    p_season_number: seasonNumber,
    p_episode_numbers: episodeNumbers,
    p_watched: watched,
  })

  if (error) {
    throw new Error(`Не удалось обновить прогресс: ${error.message}`, { cause: error })
  }
}

export const getTVEpisodeCount = async (
  mediaId: number,
  signal?: AbortSignal,
): Promise<TVEpisodeCount> => {
  const response = await fetch(`/api/media/tv/${mediaId}/episode-count`, { signal })

  if (!response.ok) {
    throw new Error('Не удалось загрузить количество серий')
  }

  return response.json()
}

export const markAllTVEpisodesWatched = async (mediaId: number): Promise<void> => {
  const { seasons } = await getTVEpisodeCount(mediaId)

  const { error } = await supabase.rpc('set_all_tv_episodes_watched', {
    p_external_id: mediaId,
    p_episodes: seasons,
  })

  if (error) {
    throw new Error(`Не удалось отметить все серии: ${error.message}`, { cause: error })
  }
}
