import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { NAV_LINKS, STADIUM } from '../../utils/constants'
import Button from './Button'
import './Navbar.css'

export default function Navbar() {
  const { isAuthenticated, isAdmin, profile } = useAuth()
  const [open, setOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    setOpen(false)
  }, [location.pathname])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <header className="navbar">
      <div className="container navbar__inner">
        <Link to="/" className="navbar__brand" aria-label={`${STADIUM.name} home`}>
          <span className="navbar__mark" aria-hidden="true">
            T
          </span>
          <span className="navbar__brand-text">
            <strong>TOSHIBA</strong>
            <small>Indoor Stadium</small>
          </span>
        </Link>

        <nav className="navbar__links" aria-label="Primary">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `navbar__link${isActive ? ' navbar__link--active' : ''}`
              }
              end={link.to === '/'}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="navbar__actions">
          {isAuthenticated ? (
            <>
              <Link to={isAdmin ? '/admin' : '/dashboard'} className="navbar__text-link">
                {isAdmin ? 'Admin' : profile?.name?.split(' ')[0] || 'Dashboard'}
              </Link>
              <Button to="/book" size="sm">
                Book Now
              </Button>
            </>
          ) : (
            <>
              <Link to="/login" className="navbar__text-link">
                Login
              </Link>
              <Button to="/book" size="sm">
                Book Now
              </Button>
            </>
          )}

          <button
            type="button"
            className="navbar__menu-btn"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      <div
        id="mobile-nav"
        className={`navbar__mobile${open ? ' navbar__mobile--open' : ''}`}
        hidden={!open}
      >
        <nav aria-label="Mobile">
          {NAV_LINKS.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.to === '/'}>
              {link.label}
            </NavLink>
          ))}
          {isAuthenticated ? (
            <>
              <NavLink to={isAdmin ? '/admin' : '/dashboard'}>
                {isAdmin ? 'Admin Dashboard' : 'Dashboard'}
              </NavLink>
              <NavLink to="/book">Book Now</NavLink>
              <NavLink to="/profile">Profile</NavLink>
            </>
          ) : (
            <>
              <NavLink to="/login">Login</NavLink>
              <NavLink to="/register">Register</NavLink>
              <NavLink to="/book">Book Now</NavLink>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
