'use client'

import styles from './MovieList.module.scss'
import InfiniteScroll from 'react-infinite-scroll-component'
import { MovieCard, MovieCardSkeleton } from '../../components'
import { Movie } from '../../api/types'
import { useMovieStatus } from '../../hooks'

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
  const { addMovieToCollection, pendingMovieIds, removeMovieFromCollection, statuses } =
    useMovieStatus(movies)

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
        const collectionEntry = statuses.get(movie.id)

        return (
          <MovieCard
            movie={movie}
            key={movie.id}
            add={addMovieToCollection}
            isUpdating={pendingMovieIds.has(movie.id)}
            remove={removeMovieFromCollection}
            status={collectionEntry?.status}
          />
        )
      })}
    </InfiniteScroll>
  )
}
