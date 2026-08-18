'use client'

import styles from './FavoritesPage.module.scss'
import { FavoriteFilters } from '../../components/FavoriteFilters/FavoriteFilters'
import { useMemo, useState } from 'react'
import { useDebounce } from '@/modules/movies/hooks/useDebounce'
import { FavoriteFiltersType, Movie } from '../../api/movies/types'
import { useInfiniteFavoriteMoviesQuery } from '../../api/movies/queries'
import { MovieList } from '../../components/movies/MovieList/MovieList'

const initialFilters: FavoriteFiltersType = {
  status: 'planned',
  search: '',
}

export const FavoritesPage = () => {
  const [filters, setFilters] = useState<FavoriteFiltersType>(initialFilters)
  const debouncedSearch = useDebounce(filters.search, 400)

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isPending } =
    useInfiniteFavoriteMoviesQuery({ status: filters.status, search: debouncedSearch })

  const { movies } = useMemo(() => {
    const movies: Movie[] = []

    data?.pages.forEach((page) => {
      page.items.forEach((item) => {
        const { external_id, release_date, ...movie } = item.movie

        movies.push({
          ...movie,
          id: external_id,
          release_date: release_date ?? '',
          vote_average: item.rating ?? 0,
        })
      })
    })

    return { movies }
  }, [data])

  const onChangeFilter = <K extends keyof FavoriteFiltersType>(
    key: K,
    value: FavoriteFiltersType[K],
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <div className={styles.root}>
      <FavoriteFilters filters={filters} onChange={onChangeFilter} />
      <MovieList
        movies={movies ?? []}
        isPending={isPending}
        fetchNextPage={fetchNextPage}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
      />
    </div>
  )
}
