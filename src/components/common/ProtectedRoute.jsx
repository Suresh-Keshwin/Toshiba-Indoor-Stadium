import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Loader from './Loader'

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading, isFirebaseConfigured } = useAuth()
  const location = useLocation()

  if (loading) {
    return <Loader label="Checking your session…" />
  }

  if (!isFirebaseConfigured) {
    return (
      <div className="container page-header">
        <h1>Firebase not configured</h1>
        <p>
          Add your Firebase credentials to a local <code>.env</code> file to enable
          authentication and bookings. See <code>.env.example</code>.
        </p>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  return children || <Outlet />
}
