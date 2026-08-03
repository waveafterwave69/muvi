import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { Profile } from '../types/profileTypes'

interface ProfileState {
    profile: Profile | null
}

const loadFromLocalStorage = (): ProfileState => {
    if (typeof window !== 'undefined') {
        try {
            const persistedState = localStorage.getItem('profile_state')
            if (persistedState) {
                return JSON.parse(persistedState)
            }
        } catch (e) {
            console.error('Ошибка загрузки из localStorage:', e)
        }
    }
    return { profile: null }
}

const initialState: ProfileState = loadFromLocalStorage()

export const userSlice = createSlice({
    name: 'profile',
    initialState,
    reducers: {
        setProfile: (state, action: PayloadAction<Profile>) => {
            state.profile = action.payload
        },
        logOut: (state) => {
            state.profile = null
        },
    },
})

export const { setProfile, logOut } = userSlice.actions

export default userSlice.reducer
