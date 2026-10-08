import { Link } from 'react-router-dom'
import { Share2, Globe, MessageCircle } from 'lucide-react'
import { NAV_LINKS, STADIUM } from '../../utils/constants'
import './Footer.css'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="container footer__grid">
        <div className="footer__brand">
          <div className="footer__logo">
            <span aria-hidden="true">T</span>
            <strong>TOSHIBA</strong>
          </div>
          <p>{STADIUM.tagline}</p>
        </div>

        <div>
          <h3>Explore</h3>
          <ul>
            {NAV_LINKS.filter((link) => link.to !== '/').map((link) => (
              <li key={link.to}>
                <Link to={link.to}>{link.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3>Booking</h3>
          <ul>
            <li>
              <Link to="/availability">Check Availability</Link>
            </li>
            <li>
              <Link to="/pricing">View Pricing</Link>
            </li>
            <li>
              <Link to="/book">Book Now</Link>
            </li>
            <li>
              <Link to="/login">Customer Login</Link>
            </li>
          </ul>
        </div>

        <div>
          <h3>Visit</h3>
          <ul className="footer__meta">
            <li>{STADIUM.address}</li>
            <li>{STADIUM.hours}</li>
            <li>
              <a href={`tel:${STADIUM.phone.replace(/\s/g, '')}`}>{STADIUM.phone}</a>
            </li>
            <li>
              <a href={`mailto:${STADIUM.email}`}>{STADIUM.email}</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="container footer__bottom">
        <p>
          © {year} {STADIUM.name}. All rights reserved.
        </p>
        <div className="footer__legal">
          <Link to="/contact">Privacy</Link>
          <Link to="/contact">Terms</Link>
          <div className="footer__social" aria-label="Social links">
            <a href="#" aria-label="Share">
              <Share2 size={18} />
            </a>
            <a href="#" aria-label="Website">
              <Globe size={18} />
            </a>
            <a href="#" aria-label="WhatsApp">
              <MessageCircle size={18} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
