import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { LogOut } from 'lucide-react'
import { signOut } from 'firebase/auth'
import { auth } from '../config/firebase'
import { useToast } from '../context/ToastContext'
import { ADMIN_NAV, STADIUM } from '../utils/constants'
import './AdminLayout.css'

export default function AdminLayout() {
  const toast = useToast()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await signOut(auth)
      toast.success('Signed out successfully.')
      navigate('/login')
    } catch {
      toast.error('Could not sign out. Please try again.')
    }
  }

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar" aria-label="Admin navigation">
        <div className="admin-sidebar__brand">
          <span aria-hidden="true">T</span>
          <div>
            <strong>Admin</strong>
            <p>{STADIUM.shortName} Stadium</p>
          </div>
        </div>
        <nav>
          {ADMIN_NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/admin'}
              className={({ isActive }) =>
                `admin-sidebar__link${isActive ? ' is-active' : ''}`
              }
            >
              {item.label}
            </NavLink>
          ))}
          <button type="button" className="admin-sidebar__link" onClick={handleLogout}>
            <LogOut size={16} />
            Logout
          </button>
        </nav>
      </aside>
      <div className="admin-shell__main">
        <Outlet />
      </div>
    </div>
  )
}
