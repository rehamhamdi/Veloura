import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAppSelector } from '../store/hooks'
import type { RoleRouteProps } from '../types/routeGuards'

export function RequireAuth() {
  const { token } = useAppSelector((state) => state.auth)
  const location = useLocation()

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return <Outlet />
}

export function RequireGuest() {
  const { token, user } = useAppSelector((state) => state.auth)

  if (token) {
    return <Navigate to={user?.role === 'admin' ? '/admin' : '/'} replace />
  }

  return <Outlet />
}

export function RequireRole({ allowedRoles }: RoleRouteProps) {
  const { user } = useAppSelector((state) => state.auth)

  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}
