import Image from 'next/image'
import { Check, Film, Heart, Plus, Star } from 'lucide-react'
import { Button, Card, Link } from '@/shared/ui'
import styles from './MovieCard.module.scss'
import { Movie, MovieWatchStatus } from '@/modules/movies/api/movies/types'

interface MovieCardProps {
  movie: Movie
  remove: (movieId: number) => Promise<void>
  status: MovieWatchStatus | undefined
  onMarkAsWatched: (movie: Movie) => void
  onMarkAsFavorite: (movie: Movie) => void
  isUpdating: boolean
  showActions: boolean
}

export function MovieCard({
  movie,
  remove,
  status,
  onMarkAsWatched,
  onMarkAsFavorite,
  isUpdating,
  showActions,
}: MovieCardProps) {
  const isFavorite = status === 'planned'
  const isWatched = status === 'watched'

  const posterUrl = movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : null

  return (
    <Card className={styles.card}>
      <div className={styles.posterContainer}>
        <Link href={`/movies/${movie.id}`} variant="secondary" className={styles.posterLink}>
          {posterUrl ? (
            <Image
              src={posterUrl}
              alt={`Постер фильма «${movie.title}»`}
              fill
              sizes="(max-width: 768px) 50vw, (max-width: 900px) 50vw, 25vw"
              className={styles.poster}
            />
          ) : (
            <div className={styles.posterFallback}>
              <Film aria-hidden="true" />
              <span>Постер недоступен</span>
            </div>
          )}
        </Link>

        <div className={styles.rating} aria-label={`Рейтинг ${movie.vote_average.toFixed(1)}`}>
          <Star aria-hidden="true" />
          <span>{movie.vote_average.toFixed(1)}</span>
        </div>

        {showActions && (
          <Button
            variant="secondary"
            size="sm"
            className={`${styles.favoriteButton} ${isFavorite ? styles.favoriteButtonActive : ''}`}
            aria-label={isFavorite ? 'Удалить из избранного' : 'Добавить в избранное'}
            aria-pressed={isFavorite}
            aria-disabled={isUpdating}
            disabled={isUpdating}
            onClick={() => {
              if (isFavorite) {
                void remove(movie.id)
              } else {
                onMarkAsFavorite(movie)
              }
            }}
          >
            <Heart aria-hidden="true" fill={isFavorite ? 'currentColor' : 'none'} />
          </Button>
        )}
      </div>

      <div className={styles.content}>
        <Link href={`/movies/${movie.id}`} variant="secondary" className={styles.titleLink}>
          <h3 className={styles.title}>{movie.title}</h3>
        </Link>

        {showActions && (
          <Button
            variant={isWatched ? 'primary' : 'secondary'}
            size="sm"
            className={`${styles.watchedButton}`}
            leftIcon={isWatched ? <Check aria-hidden="true" /> : <Plus />}
            aria-pressed={isWatched}
            aria-disabled={isUpdating}
            disabled={isUpdating}
            aria-label={isWatched ? 'Удалить из просмотренного' : 'Добавить в просмотренное'}
            onClick={() => {
              if (isWatched) {
                void remove(movie.id)
              } else {
                onMarkAsWatched(movie)
              }
            }}
          >
            <span className={styles.watchedButtonLabel}>
              {isWatched ? 'Просмотрено' : 'Добавить в просмотренное'}
            </span>
            <span className={styles.watchedButtonLabelMobile} aria-hidden="true">
              {isWatched ? 'Просмотрено' : 'Добавить'}
            </span>
          </Button>
        )}
      </div>
    </Card>
  )
}
