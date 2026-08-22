'use client'

import type { FC } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, UserRound } from 'lucide-react'
import type { CastMember } from '@/modules/media/api/mediaDetails/types'
import styles from './MediaActors.module.scss'
import { Link } from '@/shared/ui'
import { useHorizontalSlider } from '@/modules/media/hooks/useHorizontalSlider'

interface MediaActorsProps {
  actors: CastMember[]
}

const MediaActors: FC<MediaActorsProps> = ({ actors }) => {
  const { listRef, canScrollBack, canScrollForward, scroll } = useHorizontalSlider(
    actors.length,
  )

  if (!actors?.length) return null

  return (
    <section className={styles.actors} aria-labelledby="media-actors-title">
      <div className={styles.header}>
        <div>
          <h3 id="media-actors-title" className={styles.title}>
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

export default MediaActors
