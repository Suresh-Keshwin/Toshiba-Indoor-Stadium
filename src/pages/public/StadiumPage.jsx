import { Check, Shield, Zap, Users, Trophy, Sparkles, Clock, MapPin, ArrowRight } from 'lucide-react'
import Button from '../../components/common/Button'
import stadiumHero from '../../assets/stadium-hero.jpg'
import stadium1 from '../../assets/stadium-1.jpg'
import stadium2 from '../../assets/stadium-2.jpg'
import { STADIUM } from '../../utils/constants'
import './StadiumPage.css'

export default function StadiumPage() {
  const specs = [
    { label: 'Surface', val: 'FIFA-standard non-abrasive synthetic turf with shock pad' },
    { label: 'Area', val: '14,000 sq ft uninterrupted playing arena' },
    { label: 'Lighting', val: '500+ Lux glare-free overhead LED sports floodlighting' },
    { label: 'Height Clearance', val: '28 ft unobstructed vertical ceiling clearance' },
    { label: 'Perimeter', val: 'Heavy-duty rebound netting & impact-absorbing boards' },
    { label: 'Changing Rooms', val: 'Separate male & female locker rooms with hot showers' },
  ]

  const sports = [
    {
      title: 'Futsal & 5-a-side Football',
      desc: 'Regulation dimensions, responsive turf bounce, and reinforced goals for rapid matches.',
    },
    {
      title: 'Indoor Cricket Nets',
      desc: 'All-weather practice lanes with true ball bounce and enclosed safety netting.',
    },
    {
      title: 'Badminton & Conditioning',
      desc: 'High-ceiling air circulation ideal for agility drills, shuttle play and speed training.',
    },
    {
      title: 'School & Corporate Tournaments',
      desc: 'Spectator gallery, sound system hookup and comfortable staging area for private events.',
    },
  ]

  return (
    <div className="stadium-page">
      <div className="container">
        {/* HERO INTRO */}
        <div className="stadium-header">
          <p className="section-label">VENUE OVERVIEW</p>
          <h1>A Considered Space for Every Kind of Play</h1>
          <p className="stadium-lead">
            Toshiba Indoor Stadium is Kandy's premier all-weather indoor venue. Built with player safety,
            comfort, and competitive excellence in mind, our facility welcomes athletes, clubs, and weekend groups alike.
          </p>
          <div className="stadium-hero-banner">
            <img src={stadium1} alt="Toshiba Indoor Stadium full court view" />
          </div>
        </div>

        {/* SPECIFICATIONS GRID */}
        <div className="stadium-section">
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <p className="section-label">COURT SPECIFICATIONS</p>
            <h2>Built to Professional Standards</h2>
          </div>
          <div className="specs-grid">
            {specs.map((item) => (
              <div key={item.label} className="spec-card card">
                <span className="spec-label">{item.label}</span>
                <strong>{item.val}</strong>
              </div>
            ))}
          </div>
        </div>

        {/* SPORTS SUPPORTED */}
        <div className="stadium-section">
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <p className="section-label">VERSATILITY</p>
            <h2>Designed for Multi-Sport Activity</h2>
          </div>
          <div className="sports-grid">
            {sports.map((sport) => (
              <article key={sport.title} className="sport-card card">
                <Trophy size={24} className="sport-icon" />
                <h3>{sport.title}</h3>
                <p>{sport.desc}</p>
              </article>
            ))}
          </div>
        </div>

        {/* PHOTO SPLIT */}
        <div className="stadium-split">
          <div className="stadium-split__img">
            <img src={stadium2} alt="Perimeter boards and turf" />
          </div>
          <div className="stadium-split__content">
            <p className="section-label">AMENITIES & ENVIRONMENT</p>
            <h2>Everything around the court is taken care of</h2>
            <p>
              From the moment you arrive, Toshiba Indoor Stadium offers effortless convenience. Enjoy secure on-site
              vehicle parking, modern locker facilities, chilled water stations, and an elevated viewing mezzanine for
              friends and supporters.
            </p>
            <ul className="stadium-check-list">
              <li>
                <Check size={18} /> Dedicated on-site court coordinator
              </li>
              <li>
                <Check size={18} /> First-aid kit and emergency protocols
              </li>
              <li>
                <Check size={18} /> Equipment rental (futsal balls, training bibs, cones)
              </li>
              <li>
                <Check size={18} /> Sanitized daily with pristine turf maintenance
              </li>
            </ul>
            <div style={{ marginTop: '2rem' }}>
              <Button to="/book" variant="primary" size="lg">
                Book a Session Now <ArrowRight size={18} />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
