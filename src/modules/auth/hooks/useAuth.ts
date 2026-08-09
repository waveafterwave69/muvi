import { supabase } from '@/shared/api/supabase'

export const useAuth = () => {
  const handleSignUp = async (username: string, email: string, password: string) => {
    const { error, data } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { username } },
    })

    return { error, user: data.user }
  }

  const handleLogin = async (email: string, password: string) => {
    const { error, data } = await supabase.auth.signInWithPassword({ email, password })

    return { error, user: data.user }
  }

  return { handleSignUp, handleLogin }
}
