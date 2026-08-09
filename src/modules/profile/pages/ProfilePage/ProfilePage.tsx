'use client'

import { useEffect, FC } from 'react'
import { useRouter } from 'next/navigation'
import styles from './ProfilePage.module.scss'
import { ProfileCard } from '@/modules/profile'
import { Button } from '@/shared/ui'
import { LogOut, Pencil } from 'lucide-react'
import SkeletonProfilePage from './SkeletonProfilePage/SkeletonProfilePage'
import { useGetProfile, useLogout, useGetUserMovies } from '../../api/profile/queries'
import MovieList from '../../components/MovieList/MovieList'
import SkeletonMovieList from '../../components/MovieList/SkeletonMovieList/SkeletonMovieList'

interface ProfilePageProps {
  id: string | null
}

const ProfilePage: FC<ProfilePageProps> = ({ id }) => {
  const router = useRouter()

  const { data: profile, isLoading: isProfileLoading } = useGetProfile(id)
  const { mutate: handleLogout } = useLogout()
  const { data: userMovies = [], isLoading: isMoviesLoading } = useGetUserMovies(
    id,
    !isProfileLoading,
  )

  const favMovies = userMovies.filter((movie) => {
    return movie.status === 'planned'
  })
  const watchedMovies = userMovies.filter((movie) => {
    return movie.status === 'watched'
  })

  useEffect(() => {
    if (profile?.isOwn && id) {
      router.replace('/profile')
    }
  }, [id, profile?.isOwn, router])

  if (isProfileLoading || isMoviesLoading) {
    return (
      <>
        <SkeletonProfilePage isOwn={!id} />
        <SkeletonMovieList />
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
          watchedMovies={watchedMovies}
          favMovies={favMovies}
          profile={profile}
          actions={profile?.isOwn ? actionsElement : undefined}
        />
      </div>
      <MovieList movies={userMovies} />
    </section>
  )
}

export default ProfilePage
