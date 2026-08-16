'use client'

import styles from './MovieList.module.scss'
import InfiniteScroll from 'react-infinite-scroll-component'
import { Movie } from '@/modules/movies/api/movies/types'
import { MovieCardSkeleton } from '../MovieCardSkeleton/MovieCardSkeleton'
import { MovieCard } from '../MovieCard/MovieCard'
import { useMovieStatus } from '@/modules/movies/hooks/useMovieStatus'

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
  const { isPending: pendingMovieIds, removeMovie, statuses } = useMovieStatus(movies)

  if (isPending) {
    return (
      <div className={styles.grid}>
        <MovieCardSkeleton />
      </div>
    )
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
            isUpdating={pendingMovieIds}
            remove={removeMovie}
            status={statuses.get(movie.id)}
          />
        )
      })}
    </InfiniteScroll>
  )
}
