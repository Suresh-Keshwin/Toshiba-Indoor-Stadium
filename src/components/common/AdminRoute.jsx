import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Loader from './Loader'

export default function AdminRoute({ children }) {
  const { isAuthenticated, isAdmin, loading, isFirebaseConfigured } = useAuth()

  if (loading) {
    return <Loader label="Verifying admin access…" />
  }

  if (!isFirebaseConfigured) {
    return (
      <div className="container page-header">
        <h1>Firebase not configured</h1>
        <p>Admin access requires a configured Firebase project and an account with role “admin”.</p>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />
  }

  return children || <Outlet />
}
