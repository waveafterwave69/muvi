'use client'

import styles from './MovieList.module.scss'
import InfiniteScroll from 'react-infinite-scroll-component'
import { useCurrentUser } from '@/modules/auth'
import { Movie } from '@/modules/movies/api/movies/types'
import { useMovieStatus } from '@/modules/movies/hooks/useMovieStatus'
import { MovieCardSkeleton } from '../MovieCardSkeleton/MovieCardSkeleton'
import { MovieCard } from '../MovieCard/MovieCard'

interface MovieListProps {
  movies: Movie[]
  isPending: boolean
  fetchNextPage: () => void
  hasNextPage: boolean
  isFetchingNextPage: boolean
}

export const MovieList = ({
  movies,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
  isPending,
}: MovieListProps) => {
  const { addMovie, isUpdating, removeMovie, statuses } = useMovieStatus(movies)
  const { data } = useCurrentUser()

  if (isPending) {
    return (
      <div className={styles.grid}>
        <MovieCardSkeleton />
      </div>
    )
  }

  if (!movies.length) {
    return <p className={styles.empty}>Фильмы не найдены</p>
  }

  return (
    <InfiniteScroll
      dataLength={movies.length}
      hasMore={hasNextPage}
      next={() => {
        if (hasNextPage && !isFetchingNextPage) {
          void fetchNextPage()
        }
      }}
      loader={isFetchingNextPage ? <MovieCardSkeleton count={4} /> : null}
      className={styles.grid}
    >
      {movies.map((movie) => {
        return (
          <MovieCard
            movie={movie}
            key={movie.id}
            addMovie={addMovie}
            removeMovie={removeMovie}
            isUpdating={isUpdating}
            status={statuses.get(movie.id)}
            showActions={!!data}
          />
        )
      })}
    </InfiniteScroll>
  )
}
