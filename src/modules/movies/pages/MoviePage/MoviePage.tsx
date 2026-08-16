import type { FC } from 'react'
import styles from './MoviePage.module.scss'
import { Card } from '@/shared/ui'
import MoviePromo from '../../components/moviePage/MoviePromo/MoviePromo'
import MovieActors from '../../components/moviePage/MovieActors/MovieActors'
import { useMoviePage } from '../../hooks/useMoviePage'

interface MoviePageProps {
  movieId: number
  currentUserId: string
}

const MoviePage: FC<MoviePageProps> = ({ movieId, currentUserId }) => {
  const {
    favMovies,
    isMoviesLoading,
    isUserLoading,
    movie,
    watchedMovies,
    isValidId,
    isMovieLoading,
    movieError,
    isStatusesLoading,
    actors,
  } = useMoviePage(movieId, currentUserId)

  if (!isValidId) return <div>Некорректный ID фильма</div>

  if (isMovieLoading || isStatusesLoading || isUserLoading || isMoviesLoading) {
    return <div>СКЕЛЕТОН</div>
  }

  if (movieError || !movie) return <div>Ошибка: {movieError?.message || 'Фильм не найден'}</div>

  return (
    <div className={styles.movie}>
      <Card className={styles.movie__promo}>
        <MoviePromo movie={movie} favMovies={favMovies} watchedMovies={watchedMovies} />
      </Card>

      <Card>
        <MovieActors actors={actors} />
      </Card>
    </div>
  )
}

export default MoviePage
