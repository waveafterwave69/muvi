'use client'

import styles from './MediaDetailsPage.module.scss'
import { Card } from '@/shared/ui'
import MediaPromo from '../../components/mediaDetails/MediaPromo/MediaPromo'
import MediaActors from '../../components/mediaDetails/MediaActors/MediaActors'
import MediaTrailer from '../../components/mediaDetails/MediaTrailer/MediaTrailer'
import SimilarMedia from '../../components/mediaDetails/SimilarMedia/SimilarMedia'
import MovieSaga from '../../components/mediaDetails/MovieSaga/MovieSaga'
import { useMediaDetailsPage } from '../../hooks/useMediaDetailsPage'
import SkeletonMediaPage from './SkeletonMediaPage/SkeletonMediaPage'
import type { MediaVideo } from '../../api/mediaDetails/types'
import { useParams } from 'next/navigation'
import type { MediaDetails } from '../../api/mediaDetails/types'
import EpisodeTracker from '../../components/tv/EpisodeTracker/EpisodeTracker'
import { MediaType } from '@/shared/domain/media'

interface MediaDetailsPageProps {
  mediaType?: MediaType
}

interface EpisodeTrackerCardProps {
  media: MediaDetails
  userId: string
}

const EpisodeTrackerCard = ({ media, userId }: EpisodeTrackerCardProps) => {
  return (
    <Card>
      <EpisodeTracker media={media} userId={userId} />
    </Card>
  )
}

const MediaDetailsPage = ({ mediaType = 'movie' }: MediaDetailsPageProps) => {
  const { id: mediaId } = useParams<{ id: string }>()

  const {
    isUserLoading,
    media,
    isValidId,
    isMediaLoading,
    mediaError,
    actors,
    similarMedia,
    collectionMedia,
    isCollectionLoading,
    currentUser,
  } = useMediaDetailsPage(Number(mediaId), mediaType)

  if (!isValidId) return <div>Некорректный ID</div>

  if (isMediaLoading || isUserLoading) {
    return <SkeletonMediaPage mediaType={mediaType} />
  }

  if (mediaError || !media)
    return <div className={styles.error}>Ошибка: {mediaError?.message || 'Медиа не найдено'}</div>

  return (
    <div className={styles.media}>
      <Card className={styles.media__promo}>
        <MediaPromo type={mediaType} media={media} isAuthenticated={Boolean(currentUser)} />
      </Card>
      {mediaType === 'tv' && currentUser && (
        <EpisodeTrackerCard media={media} userId={currentUser.id} />
      )}
      <Card>
        <MediaActors actors={actors} />
      </Card>
      {media.videos?.results.some((video: MediaVideo) => video.site === 'YouTube') && (
        <Card>
          <MediaTrailer media={media} />
        </Card>
      )}
      <Card>
        <SimilarMedia media={similarMedia} mediaType={mediaType} />
      </Card>
      {mediaType === 'movie' && (
        <Card className={styles.saga}>
          <MovieSaga movie={media} movies={collectionMedia} isLoading={isCollectionLoading} />
        </Card>
      )}
    </div>
  )
}

export default MediaDetailsPage
