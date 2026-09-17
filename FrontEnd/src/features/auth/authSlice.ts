import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { AxiosError } from 'axios'
import api from '../../services/api'
import type { ApiErrorResponse, AuthResponse, AuthState, LoginPayload, RawAuthResponse, RegisterPayload, User, UserRole } from '../../types/auth'

const initialState: AuthState = {
  user: readStoredUser(),
  token: localStorage.getItem('token'),
  isLoading: false,
  error: null,
}

function readStoredUser(): User | null {
  const storedUser = localStorage.getItem('user')

  if (!storedUser) return null

  try {
    return JSON.parse(storedUser) as User
  } catch {
    localStorage.removeItem('user')
    return null
  }
}

function getErrorMessage(error: unknown) {
  const axiosError = error as AxiosError<ApiErrorResponse>
  return axiosError.response?.data?.message ?? axiosError.response?.data?.error ?? 'Something went wrong. Please try again.'
}

function normalizeAuthResponse(response: RawAuthResponse): AuthResponse {
  let token = response.token ?? response.accessToken
  let user = response.user

  if (response.data && 'user' in response.data) {
    token = response.data.token ?? response.data.accessToken ?? token
    user = response.data.user
  } else if (response.data) {
    user = response.data as User
  }

  if (!token || !user) {
    throw new Error('Login response is missing the token or user data.')
  }

  return { token, user: { ...user, role: user.role?.toLowerCase() as UserRole } }
}

export const registerUser = createAsyncThunk<void, RegisterPayload, { rejectValue: string }>(
  'auth/registerUser',
  async (payload, { rejectWithValue }) => {
    try {
      await api.post('/auth/register', payload)
    } catch (error) {
      return rejectWithValue(getErrorMessage(error))
    }
  },
)

export const loginUser = createAsyncThunk<AuthResponse, LoginPayload, { rejectValue: string }>(
  'auth/loginUser',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await api.post<RawAuthResponse>('/auth/login', payload)
      return normalizeAuthResponse(response.data)
    } catch (error) {
      return rejectWithValue(getErrorMessage(error))
    }
  },
)

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user = null
      state.token = null
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    },
    clearAuthError(state) {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.isLoading = false
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload ?? 'Registration failed.'
      })
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload.user
        state.token = action.payload.token
        localStorage.setItem('token', action.payload.token)
        localStorage.setItem('user', JSON.stringify(action.payload.user))
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload ?? 'Login failed.'
      })
  },
})

export const { logout, clearAuthError } = authSlice.actions
export default authSlice.reducer
