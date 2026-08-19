'use client'

import { ChevronLeft, ChevronRight, SearchX } from 'lucide-react'
import type { Movie } from '@/modules/movies/api/movies/types'
import { useHorizontalSlider } from '@/modules/movies/hooks/useHorizontalSlider'
import { useMovieStatus } from '@/modules/movies/hooks/useMovieStatus'
import { useCurrentUser } from '@/modules/auth'
import styles from './SimilarMovies.module.scss'
import { MovieCard } from '../../movies/MovieCard/MovieCard'

interface SimilarMoviesProps {
  movies: Movie[]
}

const SimilarMovies = ({ movies }: SimilarMoviesProps) => {
  const visibleMovies = movies.slice(0, 30)
  const { data: user } = useCurrentUser()
  const { addMovie, isUpdating, removeMovie, statuses } = useMovieStatus(visibleMovies)
  const { listRef, canScrollBack, canScrollForward, scroll } = useHorizontalSlider(
    visibleMovies.length,
  )

  return (
    <section className={styles.section} aria-labelledby="similar-movies-title">
      <div className={styles.header}>
        <div>
          <h3 id="similar-movies-title" className={styles.title}>
            Похожие фильмы
          </h3>
          <p className={styles.subtitle}>Картины с похожими жанрами, темами и настроением</p>
        </div>
        {visibleMovies.length > 0 && (
          <div className={styles.controls} aria-label="Навигация по похожим фильмам">
            <button
              type="button"
              className={styles.control}
              aria-label="Предыдущие похожие фильмы"
              disabled={!canScrollBack}
              onClick={() => scroll(-1)}
            >
              <ChevronLeft aria-hidden="true" />
            </button>
            <button
              type="button"
              className={styles.control}
              aria-label="Следующие похожие фильмы"
              disabled={!canScrollForward}
              onClick={() => scroll(1)}
            >
              <ChevronRight aria-hidden="true" />
            </button>
          </div>
        )}
      </div>

      {visibleMovies.length ? (
        <ul ref={listRef} className={styles.list}>
          {visibleMovies.map((movie) => {
            return (
              <li className={styles.movie} key={movie.id}>
                <MovieCard
                  movie={movie}
                  status={statuses.get(movie.id)}
                  isUpdating={isUpdating}
                  showActions={Boolean(user)}
                  addMovie={addMovie}
                  removeMovie={removeMovie}
                />
              </li>
            )
          })}
        </ul>
      ) : (
        <div className={styles.empty}>
          <SearchX aria-hidden="true" />
          <div>
            <h4>Похожие фильмы не найдены</h4>
            <p>TMDB пока не подготовил рекомендации для этой картины.</p>
          </div>
        </div>
      )}
    </section>
  )
}

export default SimilarMovies
