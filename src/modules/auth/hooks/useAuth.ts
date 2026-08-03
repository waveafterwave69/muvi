import { setProfile } from '@/modules/profile/slices/profileSlice'
import { supabase } from '@/shared/api/supabase'
import { useAppDispatch } from '@/shared/hooks/redux'
import { Profile } from '@/modules/profile/types/profileTypes'

export const useAuth = () => {
    const dispatch = useAppDispatch()

    const handleSignUp = async (
        username: string,
        email: string,
        password: string,
    ) => {
        const { error, data } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: { username },
            },
        })

        if (!error && data.user) {
            dispatch(setProfile(data.user as unknown as Profile))
        }

        return { error, user: data.user as unknown as Profile }
    }

    const handleUpdateProfile = async (
        username: string,
        avatarUrl?: string,
    ): Promise<{ error: Error | null; user: Profile | null }> => {
        const updateData: { username: string; avatar_url?: string } = {
            username,
        }

        if (avatarUrl) {
            updateData.avatar_url = avatarUrl
        }

        const { data, error } = await supabase.auth.updateUser({
            data: updateData,
        })

        const mappedUser = data.user ? (data.user as unknown as Profile) : null

        if (!error && mappedUser) {
            dispatch(setProfile(mappedUser))
        }

        return { error, user: mappedUser }
    }

    const handleUploadAvatar = async (
        file: File,
        userId: string,
    ): Promise<{ error: Error | null; publicUrl: string | null }> => {
        const fileExt = file.name.split('.').pop()
        const fileName = `${userId}/avatar_${Date.now()}.${fileExt}`

        const { error: uploadError } = await supabase.storage
            .from('avatars')
            .upload(fileName, file, { upsert: true })

        if (uploadError) {
            return { error: uploadError, publicUrl: null }
        }

        const { data } = supabase.storage.from('avatars').getPublicUrl(fileName)

        return { error: null, publicUrl: data.publicUrl }
    }

    return { handleSignUp, handleUpdateProfile, handleUploadAvatar }
}
