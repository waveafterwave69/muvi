'use client'

import { FC, useState, useMemo } from 'react'
import styles from './MovieList.module.scss'
import { ProfileMovie } from '../../types/profileTypes'
import { Card } from '@/shared/ui'
import Image from 'next/image'
import Link from 'next/link'
import Tabs from '@/shared/ui/Tabs/Tabs'
import { Star } from 'lucide-react'

interface MovieListProps {
  movies: ProfileMovie[]
}

const TAB_ALL = 0
const TAB_PLANNED = 1
const TAB_WATCHED = 2

const MovieList: FC<MovieListProps> = ({ movies }) => {
  const [activeTab, setActiveTab] = useState<number | string>(TAB_ALL)

  const profileTabs = [
    { id: TAB_ALL, label: 'Все' },
    { id: TAB_PLANNED, label: 'В планах' },
    { id: TAB_WATCHED, label: 'Просмотрено' },
  ]

  const filteredMovies = useMemo(() => {
    return movies.filter((item) => {
      if (activeTab === TAB_PLANNED) {
        return item.status === 'planned'
      }
      if (activeTab === TAB_WATCHED) {
        return item.status === 'watched'
      }
      return true
    })
  }, [movies, activeTab])

  if (!movies.length) {
    return <Card className={styles.empty}>Список фильмов пуст :(</Card>
  }

  return (
    <Card className={styles.wrapper_card}>
      <div className={styles.tabs__container}>
        <Tabs
          size="sm"
          tabs={profileTabs}
          value={activeTab}
          onChange={(id) => setActiveTab(id)}
          variant="secondary"
        />
      </div>

      {!filteredMovies.length ? (
        <div className={styles.empty_tab}>
          {activeTab === TAB_PLANNED && 'Нет запланированных фильмов'}
          {activeTab === TAB_WATCHED && 'Нет просмотренных фильмов'}
        </div>
      ) : (
        <div className={styles.movies__grid}>
          {filteredMovies.map((item) => {
            const movie = item.movies
            if (!movie) return null

            const posterUrl = movie.poster_path
              ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
              : null

            return (
              <div key={movie.id}>
                <Link href={`/movies/${movie.external_id}`} className={styles.movie__card}>
                  <div className={styles.poster__wrapper}>
                    {posterUrl ? (
                      <Image
                        src={posterUrl}
                        alt={movie.title}
                        className={styles.poster}
                        fill
                        sizes="(max-width: 768px) 50vw, 25vw"
                        priority={false}
                      />
                    ) : (
                      <div className={styles.poster__placeholder}>
                        <span>🎬</span>
                      </div>
                    )}

                    {item.status === 'watched' && item.rating && (
                      <div className={styles.user__rating}>
                        <Star aria-hidden="true" /> <span>{item.rating}</span>
                      </div>
                    )}
                  </div>

                  <div className={styles.info}>
                    <div className={styles.title_row}>
                      <h4 className={styles.title} title={movie.title}>
                        {movie.title}
                      </h4>
                    </div>

                    {item.status === 'planned' && item.comment && (
                      <p className={styles.comment} title={item.comment}>
                        {item.comment}
                      </p>
                    )}
                  </div>

                  <div className={styles.meta}>
                    <span className={`${styles.status} ${styles[`status__${item.status}`]}`}>
                      {item.status === 'watched' ? 'Просмотрено' : 'В планах'}
                    </span>
                  </div>
                </Link>
              </div>
            )
          })}
        </div>
      )}
    </Card>
  )
}

export default MovieList
