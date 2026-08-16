'use client'

import type { FC } from 'react'
import { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, UserRound } from 'lucide-react'
import type { CastMember } from '@/modules/movies/api/moviePage/types'
import styles from './MovieActors.module.scss'
import { Link } from '@/shared/ui'

interface MovieActorsProps {
  actors: CastMember[]
}

const MovieActors: FC<MovieActorsProps> = ({ actors }) => {
  const listRef = useRef<HTMLUListElement>(null)
  const [canScrollBack, setCanScrollBack] = useState(false)
  const [canScrollForward, setCanScrollForward] = useState(false)

  const updateControls = useCallback(() => {
    const list = listRef.current

    if (!list) return

    const maxScrollLeft = list.scrollWidth - list.clientWidth
    setCanScrollBack(list.scrollLeft > 1)
    setCanScrollForward(list.scrollLeft < maxScrollLeft - 1)
  }, [])

  useEffect(() => {
    const list = listRef.current

    if (!list) return

    updateControls()
    list.addEventListener('scroll', updateControls, { passive: true })
    window.addEventListener('resize', updateControls)

    return () => {
      list.removeEventListener('scroll', updateControls)
      window.removeEventListener('resize', updateControls)
    }
  }, [actors?.length, updateControls])

  const scroll = (direction: -1 | 1) => {
    const list = listRef.current
    const firstActor = list?.firstElementChild as HTMLElement | null

    if (!list || !firstActor) return

    const gap = Number.parseFloat(window.getComputedStyle(list).columnGap) || 0
    const step = firstActor.offsetWidth + gap
    const visibleCards = Math.max(1, Math.round(list.clientWidth / step))

    list.scrollBy({ left: direction * step * visibleCards, behavior: 'smooth' })
  }

  if (!actors?.length) return null

  return (
    <section className={styles.actors} aria-labelledby="movie-actors-title">
      <div className={styles.header}>
        <div>
          <h3 id="movie-actors-title" className={styles.title}>
            Актёры
          </h3>
          <p className={styles.subtitle}>В ролях:</p>
        </div>

        <div className={styles.controls} aria-label="Навигация по списку актёров">
          <button
            type="button"
            className={styles.control}
            aria-label="Предыдущие актёры"
            disabled={!canScrollBack}
            onClick={() => scroll(-1)}
          >
            <ChevronLeft aria-hidden="true" />
          </button>
          <button
            type="button"
            className={styles.control}
            aria-label="Следующие актёры"
            disabled={!canScrollForward}
            onClick={() => scroll(1)}
          >
            <ChevronRight aria-hidden="true" />
          </button>
        </div>
      </div>

      <ul ref={listRef} className={styles.list}>
        {actors.map((actor) => {
          const profileUrl = actor.profile_path
            ? `https://image.tmdb.org/t/p/w342${actor.profile_path}`
            : null

          return (
            <li key={actor.credit_id || actor.id} className={styles.actor}>
              <Link href={`/actor/${actor.id}`}>
                <div className={styles.photoWrapper}>
                  {profileUrl ? (
                    <Image
                      src={profileUrl}
                      alt={`Фото актёра ${actor.name}`}
                      fill
                      sizes="(max-width: 768px) 50vw, 16vw"
                      className={styles.photo}
                    />
                  ) : (
                    <div className={styles.photoFallback}>
                      <UserRound aria-hidden="true" />
                      <span>Фото отсутствует</span>
                    </div>
                  )}
                </div>
              </Link>

              <h3 className={styles.name}>{actor.name}</h3>
              <p className={styles.character}>{actor.character || 'Роль не указана'}</p>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

export default MovieActors
