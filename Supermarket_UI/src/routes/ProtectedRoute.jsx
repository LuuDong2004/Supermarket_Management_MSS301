import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { tokenStore } from '../lib/api.js'

export function ProtectedRoute({ children, roles }) {
  const { user } = useAuth()
  const location = useLocation()

  if (!user || !tokenStore.get()) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }
  if (roles && roles.length > 0 && !roles.includes(user.role)) {
    return <Navigate to="/app/forbidden" replace />
  }
  return children
}
