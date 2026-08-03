import profileReducer from '@/modules/profile/slices/profileSlice'
import { configureStore } from '@reduxjs/toolkit'

export const store = configureStore({
    reducer: {
        profile: profileReducer,
    },
})

store.subscribe(() => {
    if (typeof window !== 'undefined') {
        try {
            const state = store.getState()
            localStorage.setItem('profile_state', JSON.stringify(state.profile))
        } catch (e) {
            console.error('Ошибка сохранения в localStorage:', e)
        }
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
