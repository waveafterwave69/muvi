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

  const forgotPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: process.env.NEXT_PUBLIC_REDIRECT_RESET_PASSWORD_URL,
    })

    return error
  }

  const updatePassword = async (password: string) => {
    const { error } = await supabase.auth.updateUser({
      password,
    })

    return { error }
  }

  return { handleSignUp, handleLogin, forgotPassword, updatePassword }
}
