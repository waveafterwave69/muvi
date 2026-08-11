'use client'

import styles from './MovieList.module.scss'
import InfiniteScroll from 'react-infinite-scroll-component'
import { CommentModal, MovieCard, MovieCardSkeleton } from '../../components'
import { Movie } from '../../api/types'
import { useMovieStatus } from '../../hooks'
import { StarsModal } from '../StarsModal/StarsModal'
import { useState } from 'react'

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
  const [selectedWatchedMovie, setSelectedWatchedMovie] = useState<Movie | null>(null)
  const [selectedFavoriteMovie, setSelectedFavoriteMovie] = useState<Movie | null>(null)
  const [stars, setStars] = useState<number | null>(null)
  const [comment, setComment] = useState<string | null>(null)
  const { addMovie, isPending: pendingMovieIds, removeMovie, statuses } = useMovieStatus(movies)

  if (isPending) {
    return (
      <div className={styles.grid}>
        <MovieCardSkeleton />
      </div>
    )
  }

  const addToWatched = () => {
    if (!selectedWatchedMovie) return
    void addMovie(selectedWatchedMovie, {
      status: 'watched',
      rating: stars,
      comment: null,
    })
    setStars(null)
    setSelectedWatchedMovie(null)
  }

  const addToFavorite = () => {
    if (!selectedFavoriteMovie) return
    void addMovie(selectedFavoriteMovie, {
      status: 'planned',
      rating: null,
      comment: comment,
    })
    setComment(null)
    setSelectedFavoriteMovie(null)
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
            onMarkAsWatched={setSelectedWatchedMovie}
            onMarkAsFavorite={setSelectedFavoriteMovie}
            isUpdating={pendingMovieIds}
            remove={removeMovie}
            status={statuses.get(movie.id)}
          />
        )
      })}
      <StarsModal
        isOpen={!!selectedWatchedMovie}
        onClose={() => setSelectedWatchedMovie(null)}
        setStars={setStars}
        stars={stars}
        onSubmit={addToWatched}
      />
      <CommentModal
        isOpen={!!selectedFavoriteMovie}
        onClose={() => setSelectedFavoriteMovie(null)}
        comment={comment ?? ''}
        onCommentChange={setComment}
        onSubmit={addToFavorite}
      />
    </InfiniteScroll>
  )
}
