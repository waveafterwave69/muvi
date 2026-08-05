'use client'

import { useEffect } from 'react'
import { useParams } from 'next/navigation'
import { useAppDispatch, useAppSelector } from '@/shared/hooks/redux'
import { fetchUserProfileById } from '@/modules/profile/slices/profileSlice'
import UserProfile from '@/modules/profile/components/UserProfile/UserProfile'
import styles from '../profile.module.scss'

const UserProfilePage = () => {
  const { id } = useParams<{ id: string }>()
  const dispatch = useAppDispatch()
  const { userProfile, isLoading } = useAppSelector((state) => state.profile)

  useEffect(() => {
    if (id) {
      dispatch(fetchUserProfileById(id))
    }
  }, [dispatch, id])

  if (isLoading) {
    return <section>Загрузка профиля пользователя...</section>
  }

  if (!userProfile) {
    return <section>Пользователь не найден</section>
  }

  return (
    <section className={styles.profile}>
      <UserProfile profile={userProfile} />
    </section>
  )
}

export default UserProfilePage
