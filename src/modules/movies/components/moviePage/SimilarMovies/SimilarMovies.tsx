'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, Film, SearchX, Star } from 'lucide-react'
import type { Movie } from '@/modules/movies/api/movies/types'
import { useHorizontalSlider } from '@/modules/movies/hooks/useHorizontalSlider'
import styles from './SimilarMovies.module.scss'

interface SimilarMoviesProps {
  movies: Movie[]
}

const SimilarMovies = ({ movies }: SimilarMoviesProps) => {
  const visibleMovies = movies.slice(0, 12)
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
            const posterUrl = movie.poster_path
              ? `https://image.tmdb.org/t/p/w342${movie.poster_path}`
              : null
            const year = movie.release_date ? new Date(movie.release_date).getFullYear() : null

            return (
              <li className={styles.movie} key={movie.id}>
                <Link href={`/movies/${movie.id}`} className={styles.link}>
                  <span className={styles.posterWrapper}>
                    {posterUrl ? (
                      <Image
                        src={posterUrl}
                        alt={`Постер фильма «${movie.title}»`}
                        fill
                        sizes="(max-width: 600px) 42vw, (max-width: 1000px) 25vw, 16vw"
                        className={styles.poster}
                      />
                    ) : (
                      <span className={styles.posterFallback}>
                        <Film aria-hidden="true" />
                        Постер отсутствует
                      </span>
                    )}
                    <span
                      className={styles.rating}
                      aria-label={`Рейтинг ${movie.vote_average.toFixed(1)}`}
                    >
                      <Star aria-hidden="true" />
                      {movie.vote_average.toFixed(1)}
                    </span>
                  </span>
                  <span className={styles.movieTitle}>{movie.title}</span>
                  <span className={styles.movieMeta}>
                    {year ? `${year} · ` : ''}похожий фильм
                  </span>
                </Link>
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
