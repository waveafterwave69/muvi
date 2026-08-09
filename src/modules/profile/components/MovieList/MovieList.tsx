import type { FC } from 'react'
import styles from './MovieList.module.scss'
import { ProfileMovie } from '../../types/profileTypes'
import { Card } from '@/shared/ui'
import Image from 'next/image'
import Link from 'next/link'

interface MovieListProps {
  movies: ProfileMovie[]
}

const MovieList: FC<MovieListProps> = ({ movies }) => {
  if (!movies.length) {
    return <Card className={styles.empty}>Список фильмов пуст :(</Card>
  }

  return (
    <Card className={styles.wrapper_card}>
      <div className={styles.movies__grid}>
        {movies.map((item) => {
          const movie = item.movies
          if (!movie) return null

          const posterUrl = movie.poster_path
            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
            : null

          return (
            <div key={movie.id} className={styles.movie__card}>
              <Link href={`/movie/${movie.id}`}>
                <div className={styles.poster__wrapper}>
                  {posterUrl ? (
                    <Image
                      src={posterUrl}
                      alt={movie.title}
                      className={styles.poster}
                      fill
                      sizes="(max-width: 768px) 50vw, 25vw"
                      priority={false}
                    />
                  ) : (
                    <div className={styles.poster__placeholder}>
                      <span>🎬</span>
                    </div>
                  )}

                  {item.rating && (
                    <div className={styles.user__rating}>
                      ★ <span>{item.rating}</span>
                    </div>
                  )}
                </div>

                <div className={styles.info}>
                  <div className={styles.title_row}>
                    <h4 className={styles.title} title={movie.title}>
                      {movie.title}
                    </h4>
                  </div>

                  {item.comment && (
                    <p className={styles.comment} title={item.comment}>
                      {item.comment}
                    </p>
                  )}
                </div>

                <div className={styles.meta}>
                  <span className={`${styles.status} ${styles[`status__${item.status}`]}`}>
                    {item.status === 'watched' ? 'Просмотрено' : 'В планах'}
                  </span>
                </div>
              </Link>
            </div>
          )
        })}
      </div>
    </Card>
  )
}

export default MovieList
