'use client'

import { MoviePage } from '@/modules/movies'
import { useParams } from 'next/navigation'
import { useCurrentUser } from '@/modules/auth/hooks/useCurrentUser'

const Page = () => {
  const { id } = useParams<{ id: string }>()
  const movieId = Number(id)
  const { data: user, isLoading: isUserLoading, error: authError } = useCurrentUser()

  if (isUserLoading) {
    return <div></div>
  }

  if (authError) {
    return <div>Ошибка авторизации: {authError.message}</div>
  }

  if (!user) {
    return (
      <div>
        <p>Для просмотра этой страницы необходимо авторизоваться</p>
        <button onClick={() => (window.location.href = '/login')}>Войти</button>
      </div>
    )
  }

  return <MoviePage movieId={movieId} currentUserId={user.id} />
}

export default Page
