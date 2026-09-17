export type UserRole = 'user' | 'buyer' | 'customer' | 'admin'

export type User = {
  id: string
  name: string
  email: string
  role: UserRole
}

export type AuthResponse = {
  token: string
  user: User
}

export type RawAuthResponse = {
  token?: string
  accessToken?: string
  user?: User
  data?: {
    token?: string
    accessToken?: string
    user?: User
  } | User
}

export type RegisterPayload = {
  name: string
  email: string
  password: string
}

export type LoginPayload = {
  email: string
  password: string
}

export type ApiErrorResponse = {
  message?: string
  error?: string
}

export type AuthState = {
  user: User | null
  token: string | null
  isLoading: boolean
  error: string | null
}