import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  getEpisodeProgress,
  getTVEpisodeCount,
  markAllTVEpisodesWatched,
  setEpisodesWatched,
} from '.'
import type { EpisodeProgress, SetEpisodesWatchedParams } from './types'
import type { Variant } from '../couple/types'
import type { MarkAllTVEpisodesWatchedParams } from './types'

export const episodeProgressKeys = {
  detail: (userId: string, mediaId: number, variant: Variant) =>
    ['episode-progress', variant, userId, mediaId] as const,
  episodeCount: (mediaId: number) => ['media', 'tv', mediaId, 'episode-count'] as const,
}

export const useTVEpisodeCount = (mediaId: number, enabled: boolean) =>
  useQuery({
    queryKey: episodeProgressKeys.episodeCount(mediaId),
    queryFn: ({ signal }) => getTVEpisodeCount(mediaId, signal),
    enabled: enabled && mediaId > 0,
    staleTime: 30 * 60 * 1000,
  })

export const useEpisodeProgress = (
  userId: string,
  mediaId: number,
  variant: Variant,
  enabled: boolean,
) => {
  const queryClient = useQueryClient()
  const queryKey = episodeProgressKeys.detail(userId, mediaId, variant)

  const query = useQuery({
    queryKey,
    queryFn: () => getEpisodeProgress(userId, mediaId, variant),
    enabled: enabled && Boolean(userId) && mediaId > 0,
  })

  const mutation = useMutation<void, Error, SetEpisodesWatchedParams, { previous?: EpisodeProgress[] }>({
    mutationFn: setEpisodesWatched,
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey })
      const previous = queryClient.getQueryData<EpisodeProgress[]>(queryKey)

      queryClient.setQueryData<EpisodeProgress[]>(queryKey, (current = []) => {
        const selected = new Set(variables.episodeNumbers)
        const withoutChanged = current.filter(
          (item) =>
            item.season_number !== variables.seasonNumber || !selected.has(item.episode_number),
        )

        if (!variables.watched) return withoutChanged

        const watchedAt = new Date().toISOString()
        return [
          ...withoutChanged,
          ...variables.episodeNumbers.map((episodeNumber) => ({
            season_number: variables.seasonNumber,
            episode_number: episodeNumber,
            watched_at: watchedAt,
          })),
        ]
      })

      return { previous }
    },
    onError: (error, _variables, context) => {
      queryClient.setQueryData(queryKey, context?.previous)
      toast.error(error.message)
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey }),
  })

  return { ...query, setWatched: mutation.mutate, isSaving: mutation.isPending }
}

export const useMarkAllTVEpisodesWatched = (userId: string) => {
  const queryClient = useQueryClient()

  return useMutation<void, Error, MarkAllTVEpisodesWatchedParams>({
    mutationFn: markAllTVEpisodesWatched,
    onSuccess: async (_data, { mediaId, variant }) => {
      await queryClient.invalidateQueries({
        queryKey: episodeProgressKeys.detail(userId, mediaId, variant),
      })
    },
    onError: (error) => toast.error(error.message),
  })
}
