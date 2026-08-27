import { supabase } from '@/shared/api/supabase'
import { MediaActionTarget } from '@/shared/domain/media'
import {
  EpisodeProgress,
  MarkAllTVEpisodesWatchedParams,
  SetEpisodesWatchedParams,
  TVEpisodeCount,
} from './types'

interface EpisodeProgressRow extends EpisodeProgress {
  media: {
    external_id: number
    type: 'tv'
  }
}

export const getEpisodeProgress = async (
  userId: string,
  externalMediaId: number,
  variant: MediaActionTarget,
  coupleId?: string,
): Promise<EpisodeProgress[]> => {
  if (variant === 'couple') {
    let query = supabase
      .from('couple_episode_progress')
      .select(
        `
          season_number,
          episode_number,
          watched_at,
          media:media!inner(external_id, type)
        `,
      )
      .eq('media.external_id', externalMediaId)
      .eq('media.type', 'tv')

    if (coupleId) {
      query = query.eq('couple_id', coupleId)
    }

    const { data, error } = await query.overrideTypes<EpisodeProgressRow[], { merge: false }>()

    if (error) {
      throw new Error(`Не удалось загрузить прогресс пары: ${error.message}`, { cause: error })
    }

    return data.map(({ season_number, episode_number, watched_at }) => ({
      season_number,
      episode_number,
      watched_at,
    }))
  }

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
  variant,
  seasonNumber,
  episodeNumbers,
  watched,
}: SetEpisodesWatchedParams): Promise<void> => {
  const functionName = variant === 'couple' ? 'set_couple_episodes_watched' : 'set_episodes_watched'
  const { error } = await supabase.rpc(functionName, {
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

export const markAllTVEpisodesWatched = async ({
  mediaId,
  variant,
}: MarkAllTVEpisodesWatchedParams): Promise<void> => {
  const { seasons } = await getTVEpisodeCount(mediaId)

  const functionName =
    variant === 'couple' ? 'set_all_couple_tv_episodes_watched' : 'set_all_tv_episodes_watched'
  const { error } = await supabase.rpc(functionName, {
    p_external_id: mediaId,
    p_episodes: seasons,
  })

  if (error) {
    throw new Error(`Не удалось отметить все серии: ${error.message}`, { cause: error })
  }
}
