import type { FC } from 'react'
import { useMovieStatuses } from '../../api/movies/queries'
import styles from './MoviePage.module.scss'
import { Card } from '@/shared/ui'
import { useCurrentUser } from '@/modules/auth/hooks/useCurrentUser'
import { useGetUserMovies } from '@/modules/profile/api/profile/queries'
import { useMovieDetailQuery } from '../../api/moviePage/queries'
import MoviePromo from '../../components/moviePage/MoviePromo/MoviePromo'

interface MoviePageUserMovie {
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

interface MoviePageProps {
  movieId: string | string[] | undefined
  currentUserId: string
}

const MoviePage: FC<MoviePageProps> = ({ movieId, currentUserId }) => {
  const { data: currentUser, isLoading: isUserLoading } = useCurrentUser()
  const { data: userMoviesData = [], isLoading: isMoviesLoading } = useGetUserMovies(
    currentUser?.id ?? '',
    !!currentUser?.id,
  )

  const userMovies = userMoviesData as unknown as MoviePageUserMovie[]

  const favMovies = userMovies.filter((movie) => {
    return movie.status === 'planned'
  })
  const watchedMovies = userMovies.filter((movie) => {
    return movie.status === 'watched'
  })

  const parsedMovieId = Array.isArray(movieId) ? Number(movieId[0]) : Number(movieId)

  const isValidId = !isNaN(parsedMovieId) && parsedMovieId > 0

  const {
    data: movie,
    isLoading: isMovieLoading,
    error: movieError,
  } = useMovieDetailQuery(parsedMovieId)

  const { isPending: isStatusesLoading } = useMovieStatuses({
    userId: currentUserId,
    externalIds: isValidId ? [parsedMovieId] : [],
  })

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
        <p>content</p>
      </Card>
    </div>
  )
}

export default MoviePage
