'use client'

import styles from './MoviesPage.module.scss'
import { MovieList } from '../../components/movies/MovieList/MovieList'
import { Filters } from '../../components/movies/filters/filters'
import { useInfiniteMoviesQuery } from '../../api/movies/queries'
import type { FiltersType, Movie } from '../../api/movies/types'
import { useMemo, useState } from 'react'
import { useDebounce } from '../../hooks/useDebounce'

const initialFilters: FiltersType = {
  search: '',
  type: 'popular',
}

interface MoviesPageProps {
  initialSearch?: string
  initialCollectionId?: number
}

export function MoviesPage({ initialSearch = '', initialCollectionId }: MoviesPageProps) {
  const [filters, setFilters] = useState<FiltersType>({
    ...initialFilters,
    search: initialSearch,
  })
  const [collectionId, setCollectionId] = useState(initialCollectionId)
  const debouncedSearch = useDebounce(filters.search, 400)
  const { data, error, fetchNextPage, hasNextPage, isError, isFetchingNextPage, isPending } =
    useInfiniteMoviesQuery({
      category: filters.type,
      search: debouncedSearch,
      collectionId,
    })

  const movies = useMemo(() => {
    const uniqueMovies = new Map<number, Movie>()

    data?.pages.forEach((page) => {
      page.results.forEach((movie: Movie) => {
        uniqueMovies.set(movie.id, movie)
      })
    })

    return Array.from(uniqueMovies.values())
  }, [data])

  const handleChange = <K extends keyof FiltersType>(key: K, value: FiltersType[K]) => {
    if (key === 'search') {
      setCollectionId(undefined)
    }

    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  if (isError) {
    return (
      <main className={styles.error} role="alert">
        <p>{error.message}</p>
      </main>
    )
  }

  return (
    <main className={styles.root}>
      <Filters filters={filters} handleChange={handleChange} />
      <MovieList
        movies={movies}
        fetchNextPage={fetchNextPage}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        isPending={isPending}
      />
    </main>
  )
}
