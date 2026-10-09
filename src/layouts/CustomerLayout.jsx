import { NavLink, Outlet } from 'react-router-dom'
import { LogOut } from 'lucide-react'
import { signOut } from 'firebase/auth'
import Navbar from '../components/common/Navbar'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { auth } from '../config/firebase'
import { CUSTOMER_NAV } from '../utils/constants'
import './CustomerLayout.css'

export default function CustomerLayout() {
  const { profile } = useAuth()
  const toast = useToast()

  const handleLogout = async () => {
    try {
      await signOut(auth)
      toast.success('Signed out successfully.')
    } catch {
      toast.error('Could not sign out. Please try again.')
    }
  }

  return (
    <div className="customer-shell">
      <Navbar />
      <div className="container customer-shell__grid">
        <aside className="customer-sidebar" aria-label="Customer navigation">
          <div className="customer-sidebar__profile">
            <div className="customer-sidebar__avatar" aria-hidden="true">
              {(profile?.name || 'C').slice(0, 1).toUpperCase()}
            </div>
            <div>
              <strong>{profile?.name || 'Customer'}</strong>
              <p>{profile?.email || 'Account'}</p>
            </div>
          </div>
          <nav>
            {CUSTOMER_NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/dashboard'}
                className={({ isActive }) =>
                  `customer-sidebar__link${isActive ? ' is-active' : ''}`
                }
              >
                {item.label}
              </NavLink>
            ))}
            <button type="button" className="customer-sidebar__link" onClick={handleLogout}>
              <LogOut size={16} />
              Logout
            </button>
          </nav>
        </aside>
        <section className="customer-shell__content">
          <Outlet />
        </section>
      </div>
    </div>
  )
}
