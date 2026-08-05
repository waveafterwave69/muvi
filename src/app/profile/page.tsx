'use client'

import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/shared/hooks/redux'
import { fetchMyProfile } from '@/modules/profile/slices/profileSlice'
import MyProfile from '@/modules/profile/components/MyProfile/MyProfile'
import styles from './profile.module.scss'

const MyProfilePage = () => {
  const dispatch = useAppDispatch()
  const { myProfile, isLoading } = useAppSelector((state) => state.profile)

  useEffect(() => {
    if (!myProfile) {
      dispatch(fetchMyProfile())
    }
  }, [dispatch, myProfile])

  if (isLoading || !myProfile) {
    return <section>Загрузка профиля...</section>
  }

  return (
    <section className={styles.profile}>
      <MyProfile profile={myProfile} />
    </section>
  )
}

export default MyProfilePage
