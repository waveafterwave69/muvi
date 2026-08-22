'use client'

import { useEffect, FC } from 'react'
import { useRouter } from 'next/navigation'
import styles from './ProfilePage.module.scss'
import { ProfileCard } from '@/modules/profile'
import { Button } from '@/shared/ui'
import { LogOut, Pencil } from 'lucide-react'
import SkeletonProfilePage from './SkeletonProfilePage/SkeletonProfilePage'
import { useGetProfile, useLogout, useGetUserMedia } from '../../api/profile/queries'
import MediaList from '../../components/MediaList/MediaList'
import SkeletonMediaList from '../../components/MediaList/SkeletonMediaList/SkeletonMediaList'

interface ProfilePageProps {
  id: string | null
}

const ProfilePage: FC<ProfilePageProps> = ({ id }) => {
  const router = useRouter()

  const { data: profile, isLoading: isProfileLoading } = useGetProfile(id)
  const { mutate: handleLogout } = useLogout()
  const { data: userMedia = [], isLoading: isMediaLoading } = useGetUserMedia(
    id,
    !isProfileLoading,
  )

  const favoriteMedia = userMedia.filter((media) => {
    return media.status === 'planned'
  })
  const watchedMedia = userMedia.filter((media) => {
    return media.status === 'watched'
  })

  useEffect(() => {
    if (profile?.isOwn && id) {
      router.replace('/profile')
    }
  }, [id, profile?.isOwn, router])

  if (isProfileLoading || isMediaLoading) {
    return (
      <>
        <SkeletonProfilePage isOwn={!id} />
        <SkeletonMediaList />
      </>
    )
  }

  const actionsElement = (
    <div className={styles.button__row}>
      <Button className={styles.action__button} onClick={() => router.push('/profile/settings')}>
        <Pencil size={18} />
      </Button>
      <Button variant="secondary" className={styles.action__button} onClick={() => handleLogout()}>
        <LogOut size={18} />
      </Button>
    </div>
  )

  return (
    <section className={styles.profile}>
      <div className={styles.profile__card}>
        <ProfileCard
          watchedMedia={watchedMedia}
          favoriteMedia={favoriteMedia}
          profile={profile}
          actions={profile?.isOwn ? actionsElement : undefined}
        />
      </div>
      <MediaList media={userMedia} />
    </section>
  )
}

export default ProfilePage
