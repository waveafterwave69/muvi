import type { FC, ReactNode } from 'react'
import styles from './ProfileCard.module.scss'
import { Card } from '@/shared/ui'
import Image from 'next/image'
import { Profile, ProfileMovie } from '../../types/profileTypes'
import { formatDate } from '@/shared/helpers/formatters'
import { Clapperboard, Heart } from 'lucide-react'
import defaultAvatar from '../../assets/default_avatar.png'

interface ProfileCardProps {
  actions?: ReactNode
  profile: Profile
  watchedMovies: ProfileMovie[]
  favMovies: ProfileMovie[]
}

const ProfileCard: FC<ProfileCardProps> = ({ actions, profile, favMovies, watchedMovies }) => {
  const avatarSrc = profile?.avatar_url || defaultAvatar

  return (
    <div>
      <Card size="lg">
        <div className={styles.profile__content}>
          <div className={styles.profile__left}>
            <div className={styles.avatar__container}>
              <Image
                priority
                src={avatarSrc}
                className={styles.left__avatar}
                width={250}
                height={250}
                alt="avatar"
              />
            </div>

            <div className={styles.left__info}>
              <div className={styles.info__text}>
                <p className={styles.info__name}>{profile?.username}</p>
                <p className={styles.info__date}>
                  Дата регистрации: {formatDate(profile?.created_at)}
                </p>
              </div>
              {actions && <div className={styles.profile__actions}>{actions}</div>}
            </div>
          </div>
          <div className={styles.profile__right}>
            <div className={`${styles.right__item} ${styles.right__fav}`}>
              <Heart size={30} color="var(--accent)" />
              <span>{favMovies.length}</span>
              <p>в избранном</p>
            </div>
            <div className={styles.bar}></div>
            <div className={`${styles.right__item} ${styles.right__watch}`}>
              <Clapperboard size={30} color="var(--accent)" />
              <span>{watchedMovies.length}</span>
              <p>просмотрено</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default ProfileCard
