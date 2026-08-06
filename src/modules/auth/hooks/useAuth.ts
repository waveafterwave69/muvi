import { supabase } from '@/shared/api/supabase'

export const useAuth = () => {
  const handleSignUp = async (username: string, email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username: username,
        },
      },
    })

    return error
  }

  const handleLogin = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    return error
  }

  return { handleSignUp, handleLogin }
}
