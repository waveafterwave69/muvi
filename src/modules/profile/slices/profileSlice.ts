import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { Profile } from '../types/profileTypes'
import { supabase } from '@/shared/api/supabase'
import { profileService } from '../services/profileServices'

interface ProfileState {
  myProfile: Profile | null
  userProfile: Profile | null
  isLoading: boolean
  error: string | null
}

const initialState: ProfileState = {
  myProfile: null,
  userProfile: null,
  isLoading: false,
  error: null,
}

export const fetchMyProfile = createAsyncThunk(
  'profile/fetchMyProfile',
  async (_, { rejectWithValue }) => {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()
    if (error || !user) return rejectWithValue(error?.message || 'Пользователь не найден')
    return user as unknown as Profile
  },
)

export const fetchUserProfileById = createAsyncThunk(
  'profile/fetchUserProfileById',
  async (id: string, { rejectWithValue }) => {
    const { data, error } = await profileService.fetchProfileById(id)
    if (error) return rejectWithValue(error.message)
    return data
  },
)

export const signOutAction = createAsyncThunk('profile/signOut', async (_, { dispatch }) => {
  await supabase.auth.signOut()
  dispatch(clearProfileState())
})

export const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    clearProfileState: (state) => {
      state.myProfile = null
      state.userProfile = null
    },
    setMyProfile: (state, action: PayloadAction<Profile>) => {
      state.myProfile = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyProfile.pending, (state) => {
        state.isLoading = true
      })
      .addCase(fetchMyProfile.fulfilled, (state, action) => {
        state.isLoading = false
        state.myProfile = action.payload
      })
      .addCase(fetchMyProfile.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      .addCase(fetchUserProfileById.pending, (state) => {
        state.isLoading = true
      })
      .addCase(fetchUserProfileById.fulfilled, (state, action) => {
        state.isLoading = false
        state.userProfile = action.payload
      })
  },
})

export const { clearProfileState, setMyProfile } = profileSlice.actions
export default profileSlice.reducer
