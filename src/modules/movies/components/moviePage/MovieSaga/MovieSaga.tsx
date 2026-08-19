'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, ChevronLeft, ChevronRight, Film, GitBranch, Star } from 'lucide-react'
import type { FullMovieDetail } from '@/modules/movies/api/moviePage/types'
import type { Movie } from '@/modules/movies/api/movies/types'
import { useHorizontalSlider } from '@/modules/movies/hooks/useHorizontalSlider'
import styles from './MovieSaga.module.scss'

interface MovieSagaProps {
  movie: FullMovieDetail
  movies: Movie[]
  isLoading: boolean
}

const getRelation = (releaseDate: string, currentReleaseDate: string) => {
  if (!releaseDate || !currentReleaseDate) return 'Часть коллекции'
  if (releaseDate < currentReleaseDate) return 'Приквел'
  if (releaseDate > currentReleaseDate) return 'Сиквел'

  return 'Часть коллекции'
}

const MovieSaga = ({ movie, movies, isLoading }: MovieSagaProps) => {
  const sagaMovies = [...movies]
    .filter((sagaMovie) => sagaMovie.id !== movie.id)
    .sort((first, second) => first.release_date.localeCompare(second.release_date))
  const { listRef, canScrollBack, canScrollForward, scroll } = useHorizontalSlider(
    isLoading ? 0 : sagaMovies.length,
  )

  return (
    <section className={styles.section} aria-labelledby="movie-saga-title">
      <div className={styles.header}>
        <div>
          <h3 id="movie-saga-title" className={styles.title}>
            Сиквелы и приквелы
          </h3>
          <p className={styles.subtitle}>
            {movie.belongs_to_collection
              ? `Другие фильмы коллекции «${movie.belongs_to_collection.name}»`
              : 'История фильма в рамках одной киновселенной'}
          </p>
        </div>
        {movie.belongs_to_collection && (
          <div className={styles.headerActions}>
            <div className={styles.collectionBadge}>
              <GitBranch aria-hidden="true" />
              {sagaMovies.length + 1} частей
            </div>
            {sagaMovies.length > 0 && !isLoading && (
              <div className={styles.controls} aria-label="Навигация по фильмам коллекции">
                <button
                  type="button"
                  className={styles.control}
                  aria-label="Предыдущие фильмы коллекции"
                  disabled={!canScrollBack}
                  onClick={() => scroll(-1)}
                >
                  <ChevronLeft aria-hidden="true" />
                </button>
                <button
                  type="button"
                  className={styles.control}
                  aria-label="Следующие фильмы коллекции"
                  disabled={!canScrollForward}
                  onClick={() => scroll(1)}
                >
                  <ChevronRight aria-hidden="true" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {isLoading ? (
        <div className={styles.grid} aria-label="Загрузка фильмов коллекции">
          {Array.from({ length: 3 }, (_, index) => (
            <div className={`${styles.sagaCard} ${styles.skeleton}`} key={index} />
          ))}
        </div>
      ) : sagaMovies.length ? (
        <ul ref={listRef} className={styles.grid}>
          {sagaMovies.map((sagaMovie) => {
            const posterUrl = sagaMovie.poster_path
              ? `https://image.tmdb.org/t/p/w342${sagaMovie.poster_path}`
              : null
            const relation = getRelation(sagaMovie.release_date, movie.release_date)
            const year = sagaMovie.release_date
              ? new Date(sagaMovie.release_date).getFullYear()
              : null

            return (
              <li className={styles.sagaCard} key={sagaMovie.id}>
                <Link href={`/movies/${sagaMovie.id}`} className={styles.link}>
                  <span className={styles.posterWrapper}>
                    {posterUrl ? (
                      <Image
                        src={posterUrl}
                        alt={`Постер фильма «${sagaMovie.title}»`}
                        fill
                        sizes="(max-width: 600px) 35vw, 130px"
                        className={styles.poster}
                      />
                    ) : (
                      <span className={styles.posterFallback}>
                        <Film aria-hidden="true" />
                      </span>
                    )}
                  </span>

                  <span className={styles.content}>
                    <span className={styles.relation}>{relation}</span>
                    <span className={styles.movieTitle}>{sagaMovie.title}</span>
                    <span className={styles.movieMeta}>
                      {year ?? 'Дата неизвестна'}
                      <span aria-hidden="true"> · </span>
                      <Star aria-hidden="true" />
                      {sagaMovie.vote_average.toFixed(1)}
                    </span>
                    <span className={styles.overview}>
                      {sagaMovie.overview || 'Описание фильма пока не добавлено.'}
                    </span>
                    <span className={styles.details}>
                      Подробнее <ArrowRight aria-hidden="true" />
                    </span>
                  </span>
                </Link>
              </li>
            )
          })}
        </ul>
      ) : (
        <div className={styles.empty}>
          <GitBranch aria-hidden="true" />
          <div>
            <h4>
              {movie.belongs_to_collection
                ? 'Других частей пока нет'
                : 'Фильм не входит в коллекцию'}
            </h4>
            <p>
              {movie.belongs_to_collection
                ? 'Продолжения или предыстории для этой картины пока не найдены.'
                : 'У этой истории нет связанных приквелов или сиквелов.'}
            </p>
          </div>
        </div>
      )}
    </section>
  )
}

export default MovieSaga
