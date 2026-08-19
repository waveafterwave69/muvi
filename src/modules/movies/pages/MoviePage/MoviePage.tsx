'use client'

import styles from './MoviePage.module.scss'
import { Card } from '@/shared/ui'
import MoviePromo from '../../components/moviePage/MoviePromo/MoviePromo'
import MovieActors from '../../components/moviePage/MovieActors/MovieActors'
import MovieTrailer from '../../components/moviePage/MovieTrailer/MovieTrailer'
import SimilarMovies from '../../components/moviePage/SimilarMovies/SimilarMovies'
import MovieSaga from '../../components/moviePage/MovieSaga/MovieSaga'
import { useMoviePage } from '../../hooks/useMoviePage'
import SkeletonMoviePage from './SkeletonMoviePage/SkeletonMoviePage'
import type { MovieVideo } from '../../api/moviePage/types'
import { useParams } from 'next/navigation'

const MoviePage = () => {
  const { id: movieId } = useParams<{ id: string }>()

  const {
    isUserLoading,
    movie,
    isValidId,
    isMovieLoading,
    movieError,
    actors,
    similarMovies,
    collectionMovies,
    isCollectionLoading,
    currentUser,
  } = useMoviePage(Number(movieId))

  if (!isValidId) return <div>Некорректный ID фильма</div>

  if (isMovieLoading || isUserLoading) {
    return <SkeletonMoviePage />
  }

  if (movieError || !movie)
    return <div className={styles.error}>Ошибка: {movieError?.message || 'Фильм не найден'}</div>

  return (
    <div className={styles.movie}>
      <Card className={styles.movie__promo}>
        <MoviePromo movie={movie} isAuthenticated={Boolean(currentUser)} />
      </Card>
      <Card>
        <MovieActors actors={actors} />
      </Card>
      {movie.videos?.results.some((video: MovieVideo) => video.site === 'YouTube') && (
        <Card>
          <MovieTrailer movie={movie} />
        </Card>
      )}
      <Card>
        <SimilarMovies movies={similarMovies} />
      </Card>
      <Card className={styles.saga}>
        <MovieSaga movie={movie} movies={collectionMovies} isLoading={isCollectionLoading} />
      </Card>
    </div>
  )
}

export default MoviePage
