'use client'

import type { FC } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import styles from './MoviePromo.module.scss'
import { Button } from '@/shared/ui'
import { Calendar, Check, Clock2, LibraryBig, MoveLeft, Plus, Star } from 'lucide-react'
import { Movie } from '@/modules/movies/api/movies/types'
import { StarsModal } from '../../movies/StarsModal/StarsModal'
import { CommentModal } from '../../movies/CommentModal/CommentModal'
import { useMovieStatus } from '@/modules/movies/hooks/useMovieStatus'
import { useAddMovie } from '@/modules/movies/hooks/useAddMovie'
import { FullMovieDetail, Genre } from '@/modules/movies/api/moviePage/types'
import { formatRuntime } from '@/shared/helpers/formatters'

interface UserMovieItem {
  status: 'watched' | 'planned' | string
  comment: string | null
  rating: number | null
  watched_at: string | null
  movies: {
    id: number
    external_id: number
    title: string
    overview: string
  }
}

interface MoviePromoProps {
  movie: FullMovieDetail
  favMovies: UserMovieItem[]
  watchedMovies: UserMovieItem[]
}

const getImageUrl = (path: string | null | undefined, size: string = 'original'): string => {
  if (!path) return ''
  return `https://image.tmdb.org/t/p/${size}${path}`
}

const MoviePromo: FC<MoviePromoProps> = ({ movie, favMovies, watchedMovies }) => {
  const { removeMovie, isPending: pendingMovieIds } = useMovieStatus(movie)

  const mappedMovie: Movie = {
    id: movie.id,
    title: movie.title,
    overview: movie.overview,
    poster_path: movie.poster_path,
    backdrop_path: movie.backdrop_path,
    release_date: movie.release_date,
    vote_average: movie.vote_average,
    adult: false,
    genre_ids: movie.genres?.map((g) => g.id) || [],
    original_language: 'en',
    original_title: movie.title,
    popularity: 0,
    video: false,
    vote_count: 0,
  }

  const {
    addToFavorite,
    addToWatched,
    isCommentModalOpen,
    isStarsModalOpen,
    setIsStarsModalOpen,
    setIsCommentModalOpen,
    setComment,
    setStars,
    stars,
    comment,
  } = useAddMovie(mappedMovie)

  const backdropUrl = getImageUrl(movie.backdrop_path, 'original')
  const collection = movie.belongs_to_collection
  const collectionImageUrl = getImageUrl(
    collection?.poster_path ?? collection?.backdrop_path,
    'w185',
  )
  const collectionSearchUrl = collection
    ? `/movies?${new URLSearchParams({
        collection: String(collection.id),
        search: collection.name,
      })}`
    : ''

  const isWatched = watchedMovies.some(
    (movieEl: UserMovieItem) => movieEl.movies?.external_id === movie.id,
  )
  const isFavorite = favMovies.some(
    (movieEl: UserMovieItem) => movieEl.movies?.external_id === movie.id,
  )

  const handleFavoriteClick = () => {
    if (isFavorite) {
      void removeMovie(movie.id)
    } else {
      setIsCommentModalOpen(true)
    }
  }

  const handleWatchedClick = () => {
    if (isWatched) {
      void removeMovie(movie.id)
    } else {
      setIsStarsModalOpen(true)
    }
  }

  return (
    <section
      className={styles.promo}
      style={{
        backgroundImage: backdropUrl ? `url(${backdropUrl})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className={styles.promo__content}>
        <button className={styles.backlink} onClick={() => window.history.back()}>
          <MoveLeft size={20} />
          Назад
        </button>

        <div className={styles.badge__row}>
          <span className={styles.badge}>
            <Star aria-hidden="true" />
            <span>{movie.vote_average.toFixed(1)}</span>
          </span>
          <span className={styles.badge}>
            <Calendar aria-hidden="true" />
            {movie.release_date ? new Date(movie.release_date).getFullYear() : '----'}
          </span>
          <span className={styles.badge}>
            <Clock2 aria-hidden="true" /> {formatRuntime(movie.runtime)}
          </span>
        </div>

        <h3 className={styles.title}>{movie.title}</h3>
        <p className={styles.genres}>
          {movie.genres &&
            movie.genres.length > 0 &&
            movie.genres.map((g: Genre, index: number) => (
              <span key={g.id || index} className={styles.genreItem}>
                {g.name}
                {index < movie.genres.length - 1 && <span className={styles.separator}>·</span>}
              </span>
            ))}
        </p>

        {collection && (
          <div className={styles.collection}>
            <Link
              href={collectionSearchUrl}
              className={styles.collectionLink}
              aria-label={`Открыть фильмы коллекции «${collection.name}»`}
            >
              <span className={styles.collectionPoster}>
                {collectionImageUrl ? (
                  <Image
                    src={collectionImageUrl}
                    alt={`Постер коллекции «${collection.name}»`}
                    fill
                    sizes="56px"
                  />
                ) : (
                  <LibraryBig aria-hidden="true" />
                )}
              </span>
              <span className={styles.collectionContent}>
                <span className={styles.collectionLabel}>Коллекция</span>
                <span className={styles.collectionName}>{collection.name}</span>
                <span className={styles.collectionHint}>Показать все фильмы</span>
              </span>
            </Link>
          </div>
        )}

        <p className={styles.overview}>{movie.overview}</p>

        <div className={styles.actionButtons}>
          <Button
            size="sm"
            variant={isFavorite ? 'primary' : 'secondary'}
            className={`${styles.watchedButton}`}
            leftIcon={isFavorite ? <Check aria-hidden="true" /> : <Plus />}
            aria-label={isFavorite ? 'Убрать из избранного' : 'Добавить в избранное'}
            disabled={pendingMovieIds}
            onClick={handleFavoriteClick}
          >
            <span className={styles.watchedButtonLabel}>
              {isFavorite ? 'Убрать из избранного' : 'Добавить в избранное'}
            </span>
          </Button>

          <Button
            size="sm"
            variant={isWatched ? 'primary' : 'secondary'}
            className={`${styles.watchedButton}`}
            leftIcon={isWatched ? <Check aria-hidden="true" /> : <Plus />}
            aria-label={isWatched ? 'Удалить из просмотренного' : 'Добавить в просмотренное'}
            disabled={pendingMovieIds}
            onClick={handleWatchedClick}
          >
            <span className={styles.watchedButtonLabel}>
              {isWatched ? 'Просмотрено' : 'Добавить в просмотренное'}
            </span>
          </Button>
        </div>
      </div>

      <StarsModal
        isOpen={isStarsModalOpen}
        onClose={() => {
          setIsStarsModalOpen(false)
          setStars(null)
        }}
        setStars={setStars}
        stars={stars}
        onSubmit={addToWatched}
      />

      <CommentModal
        isOpen={isCommentModalOpen}
        onClose={() => {
          setIsCommentModalOpen(false)
          setComment(null)
        }}
        comment={comment ?? ''}
        onCommentChange={setComment}
        onSubmit={addToFavorite}
      />
    </section>
  )
}

export default MoviePromo
