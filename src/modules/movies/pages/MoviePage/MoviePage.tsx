import type { FC } from 'react'
import styles from './MoviePage.module.scss'
import { Card } from '@/shared/ui'
import MoviePromo from '../../components/moviePage/MoviePromo/MoviePromo'
import MovieActors from '../../components/moviePage/MovieActors/MovieActors'
import MovieTrailer from '../../components/moviePage/MovieTrailer/MovieTrailer'
import { useMoviePage } from '../../hooks/useMoviePage'
import SkeletonMoviePage from './SkeletonMoviePage/SkeletonMoviePage'
import type { MovieVideo } from '../../api/moviePage/types'

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
    isActorsLoading,
    movieError,
    isStatusesLoading,
    actors,
  } = useMoviePage(movieId, currentUserId)

  if (!isValidId) return <div>Некорректный ID фильма</div>

  if (isMovieLoading || isActorsLoading || isStatusesLoading || isUserLoading || isMoviesLoading) {
    return <SkeletonMoviePage />
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

      {movie.videos?.results.some((video: MovieVideo) => video.site === 'YouTube') && (
        <Card>
          <MovieTrailer movie={movie} />
        </Card>
      )}
    </div>
  )
}

export default MoviePage
