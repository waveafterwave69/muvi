import Image from 'next/image'
import { Check, Film, Heart, Star } from 'lucide-react'
import { Button, Card, Link } from '@/shared/ui'
import type { Movie, MovieWatchStatus } from '../../api/types'
import styles from './MovieCard.module.scss'

interface MovieCardProps {
  movie: Movie
  add: (movie: Movie, status: MovieWatchStatus) => Promise<void>
  remove: (movieId: number) => Promise<void>
  status: MovieWatchStatus | undefined
  isUpdating: boolean
}

export function MovieCard({ movie, add, remove, status, isUpdating }: MovieCardProps) {
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
              sizes="(max-width: 560px) 100vw, (max-width: 900px) 50vw, 25vw"
              className={styles.poster}
            />
          ) : (
            <div className={styles.posterFallback}>
              <Film aria-hidden="true" />
              <span>Постер недоступен</span>
            </div>
          )}

          <div className={styles.posterOverlay} />
        </Link>

        <div className={styles.rating} aria-label={`Рейтинг ${movie.vote_average.toFixed(1)}`}>
          <Star aria-hidden="true" />
          <span>{movie.vote_average.toFixed(1)}</span>
        </div>

        <Button
          variant="secondary"
          size="sm"
          className={`${styles.favoriteButton} ${isFavorite ? styles.favoriteButtonActive : ''}`}
          aria-label={isFavorite ? 'Удалить из избранного' : 'Добавить в избранное'}
          aria-pressed={isFavorite}
          aria-busy={isUpdating}
          disabled={isUpdating}
          onClick={() => {
            if (isFavorite) {
              void remove(movie.id)
            } else {
              void add(movie, 'planned')
            }
          }}
        >
          <Heart aria-hidden="true" fill={isFavorite ? 'currentColor' : 'none'} />
        </Button>
      </div>

      <div className={styles.content}>
        <Link href={`/movies/${movie.id}`} variant="secondary" className={styles.titleLink}>
          <h3 className={styles.title}>{movie.title}</h3>
        </Link>

        <Button
          variant="secondary"
          size="sm"
          className={`${styles.watchedButton} ${isWatched ? styles.watchedButtonActive : ''}`}
          leftIcon={<Check aria-hidden="true" />}
          aria-pressed={isWatched}
          aria-busy={isUpdating}
          disabled={isUpdating}
          onClick={() => {
            if (isWatched) {
              void remove(movie.id)
            } else {
              void add(movie, 'watched')
            }
          }}
        >
          {isWatched ? 'Просмотрено' : 'Добавить в просмотренное'}
        </Button>
      </div>
    </Card>
  )
}
