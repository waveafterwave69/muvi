import { supabase } from '@/shared/api/supabase'
import { useAppDispatch } from '@/shared/hooks/redux'
import { setMyProfile } from '@/modules/profile/slices/profileSlice'
import { Profile } from '@/modules/profile/types/profileTypes'

export const useAuth = () => {
  const dispatch = useAppDispatch()

  const handleSignUp = async (username: string, email: string, password: string) => {
    const { error, data } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { username } },
    })

    if (!error && data.user) {
      dispatch(setMyProfile(data.user as unknown as Profile))
    }
    return { error, user: data.user }
  }

  const handleLogin = async (email: string, password: string) => {
    const { error, data } = await supabase.auth.signInWithPassword({ email, password })

    if (!error && data.user) {
      dispatch(setMyProfile(data.user as unknown as Profile))
    }
    return { error, user: data.user }
  }

  return { handleSignUp, handleLogin }
}
