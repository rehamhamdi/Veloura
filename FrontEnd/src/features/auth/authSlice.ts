import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { AxiosError } from 'axios'
import api from '../../services/api'

export type UserRole = 'user' | 'buyer' | 'customer' | 'admin'

export type User = {
  id: string
  name: string
  email?: string
  role: UserRole
}

type AuthResponse = {
  token: string
  user: User
}

type LoginApiResponse = {
  succeeded: boolean
  data?: {
    token?: string
    user?: {
      id?: string | number
      name?: string
      email?: string
      role?: string
    }
  }
  message?: string
}

type RegisterPayload = {
  name: string
  email: string
  password: string
}

type LoginPayload = {
  email: string
  password: string
}

type ApiErrorResponse = {
  message?: string
  error?: string
}

type AuthState = {
  user: User | null
  token: string | null
  isLoading: boolean
  error: string | null
}

function normalizeLoginResponse(response: LoginApiResponse): AuthResponse {
  const token = response.data?.token
  const apiUser = response.data?.user

  if (!token || !apiUser) {
    throw new Error(response.message ?? 'Login response is missing user data.')
  }

  return {
    token,
    user: {
      id: String(apiUser.id ?? ''),
      name: apiUser.name ?? '',
      email: apiUser.email,
      role: (apiUser.role ?? 'user').toLowerCase() as UserRole,
    },
  }
}

function parseJwt(token: string) {
  try {
    const base64Url = token.split('.')[1]
    if (!base64Url) return null
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )
    return JSON.parse(jsonPayload)
  } catch {
    return null
  }
}

function getInitialUser(): User | null {
  try {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      return JSON.parse(storedUser) as User
    }
    const token = localStorage.getItem('token')
    if (token) {
      const decoded = parseJwt(token)
      if (decoded) {
        const role =
          decoded.role ||
          decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] ||
          'user'
        const name =
          decoded.name ||
          decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] ||
          decoded.email ||
          'User'
        const email =
          decoded.email ||
          decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress']
        const id = decoded.nameid || decoded.sub || String(decoded.id ?? '')
        return {
          id,
          name,
          email,
          role: String(role).toLowerCase() as UserRole,
        }
      }
    }
  } catch {
    return null
  }
  return null
}

const initialState: AuthState = {
  user: getInitialUser(),
  token: localStorage.getItem('token'),
  isLoading: false,
  error: null,
}

function getErrorMessage(error: unknown) {
  const axiosError = error as AxiosError<ApiErrorResponse>
  return axiosError.response?.data?.message ?? axiosError.response?.data?.error ?? 'Something went wrong. Please try again.'
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
      const response = await api.post<LoginApiResponse>('/auth/login', payload)
      return normalizeLoginResponse(response.data)
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
