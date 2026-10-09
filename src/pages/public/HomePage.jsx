import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, CalendarDays, Clock3, CheckCircle2, ShieldCheck, Sparkles, MapPin, Phone, Mail, Award, Users, ChevronRight, Activity } from 'lucide-react'
import Button from '../../components/common/Button'
import stadiumHero from '../../assets/stadium-hero.jpg'
import stadium1 from '../../assets/stadium-1.jpg'
import stadium2 from '../../assets/stadium-2.jpg'
import { DURATION_OPTIONS, formatLkr, STADIUM } from '../../utils/constants'
import './HomePage.css'

const AMENITIES = [
  { title: 'Spacious indoor area', desc: 'A flexible, spacious layout suited for multiple playing requirements' },
  { title: 'Bright lighting', desc: 'Optimal illumination for day and evening bookings' },
  { title: 'Convenient access', desc: 'Ample on-site parking and easy stadium entry' },
  { title: 'Managed venue', desc: 'Regularly cleaned, serviced and ready for every booking' },
  { title: 'Group-friendly', desc: 'Ideal for clubs, schools, private teams and organized leagues' },
]

const FEATURES = [
  {
    title: 'Easy Online Booking',
    text: 'Choose a date, pick an open slot and lock in your session in minutes.',
    icon: CalendarDays,
  },
  {
    title: 'Flexible Time Slots',
    text: 'Book 1-hour or 2-hour sessions that fit your squad or training plans.',
    icon: Clock3,
  },
  {
    title: 'Multi-Purpose Venue',
    text: 'A high-spec indoor turf space for sports, training, tournaments and clubs.',
    icon: Activity,
  },
  {
    title: 'Transparent Pricing',
    text: 'Clear rates (LKR 2,750 / hr) with no hidden fees or surprise charges.',
    icon: ShieldCheck,
  },
]

const STEPS = [
  { n: '01', title: 'Choose Date', text: 'Pick the day that fits your activity or group training.' },
  { n: '02', title: 'Select Time', text: 'Browse available time slots updated live 24/7.' },
  { n: '03', title: 'Confirm Booking', text: 'Review duration, price and player details.' },
  { n: '04', title: 'Receive Confirmation', text: 'Get your unique reference code and venue QR access.' },
]

const REVIEWS = [
  {
    quote: 'The online booking was clear, and the venue looked exactly as shown. Our group had a smooth evening.',
    name: 'Kasun Perera',
    role: 'Futsal group organizer',
    rating: 5,
  },
  {
    quote: 'Bright, clean and easy to access. The confirmation and reminders made organizing everyone simple.',
    name: 'Dinuka Silva',
    role: 'Weekly training captain',
    rating: 5,
  },
  {
    quote: 'A polished venue and very helpful communication. We will definitely reserve another session.',
    name: 'Mohamed Rizvi',
    role: 'Club captain',
    rating: 5,
  },
]

const FAQ = [
  {
    q: 'How do I make a booking?',
    a: 'Simply select your desired date on the calendar, choose an available time slot from 6:00 AM to 11:00 PM, select 1 Hour (LKR 2,750) or 2 Hours (LKR 5,500), fill in your details and confirm your reservation.',
  },
  {
    q: 'Can I cancel a booking?',
    a: 'Yes. Eligible upcoming bookings can be cancelled directly through your Customer Dashboard up to 6 hours prior to session start, in accordance with stadium policy.',
  },
  {
    q: 'Can I reschedule?',
    a: 'To reschedule, you can cancel an eligible upcoming booking and rebook your preferred new slot, or contact our stadium desk directly at +94 81 234 5678.',
  },
  {
    q: 'How long can I book?',
    a: 'Sessions are booked in standardized blocks: 1 Hour (LKR 2,750) or 2 Hours (LKR 5,500). Multiple back-to-back slots can also be reserved for longer tournaments or events.',
  },
  {
    q: 'What activities can be played?',
    a: 'Toshiba Indoor Stadium is a multi-purpose indoor arena equipped with premium artificial turf, perimeter netting and adjustable goals, suitable for futsal, cricket practice, badminton/conditioning, fitness camps and recreational training.',
  },
  {
    q: 'How will I receive confirmation?',
    a: 'Immediately upon completing your reservation, you will receive an on-screen confirmation with a unique reference number (e.g. TIS-1010-6PM) and a scannable QR pass, also saved to your account dashboard.',
  },
]

export default function HomePage() {
  const navigate = useNavigate()
  const todayStr = new Date().toISOString().split('T')[0]
  const [searchDate, setSearchDate] = useState(todayStr)
  const [searchTime, setSearchTime] = useState('18:00')
  const [searchDuration, setSearchDuration] = useState('1')
  const [previewSlot, setPreviewSlot] = useState('18:00')

  const handleQuickSearch = (e) => {
    e.preventDefault()
    navigate(`/book?date=${searchDate}&time=${searchTime}&duration=${searchDuration}`)
  }
  return (
    <div className="home">
      <section className="hero">
        <img src={stadiumHero} alt="Indoor stadium court with artificial turf and overhead lighting" className="hero__image" />
        <div className="hero__overlay" />
        <div className="container hero__content">
          <p className="hero__eyebrow">Toshiba Indoor Stadium · Kandy</p>
          <h1>Your Court. Your Time. Your Game.</h1>
          <p className="hero__lead">
            A premium multi-purpose indoor venue for sports, training, clubs and recreational
            activities.
          </p>
          <div className="hero__actions">
            <Button to="/book" variant="primary" size="lg">
              Book Now
            </Button>
            <Button to="/availability" variant="outline-light" size="lg">
              Check Availability
            </Button>
          </div>
        </div>
      </section>

      <section className="quick-search">
        <div className="container">
          <form className="quick-search__card" onSubmit={handleQuickSearch}>
            <label className="field">
              <span className="field__label">Date</span>
              <input
                className="input"
                type="date"
                name="date"
                value={searchDate}
                min={todayStr}
                onChange={(e) => setSearchDate(e.target.value)}
              />
            </label>
            <label className="field">
              <span className="field__label">Start Time</span>
              <select
                className="select"
                name="time"
                value={searchTime}
                onChange={(e) => setSearchTime(e.target.value)}
              >
                <option value="08:00">8:00 AM</option>
                <option value="10:00">10:00 AM</option>
                <option value="12:00">12:00 PM</option>
                <option value="14:00">2:00 PM</option>
                <option value="16:00">4:00 PM</option>
                <option value="18:00">6:00 PM</option>
                <option value="20:00">8:00 PM</option>
                <option value="22:00">10:00 PM</option>
              </select>
            </label>
            <label className="field">
              <span className="field__label">Duration</span>
              <select
                className="select"
                name="duration"
                value={searchDuration}
                onChange={(e) => setSearchDuration(e.target.value)}
              >
                <option value="1">1 Hour — LKR 2,750</option>
                <option value="2">2 Hours — LKR 5,500</option>
              </select>
            </label>
            <Button type="submit" variant="primary">
              Check Availability <ArrowRight size={16} />
            </Button>
          </form>
        </div>
      </section>

      {/* SECTION 3 — ABOUT */}
      <section className="section section--white about">
        <div className="container about__grid">
          <div className="about__media">
            <img src={stadium1} alt="Wide view of Toshiba Indoor Stadium turf court" />
          </div>
          <div className="about__content">
            <p className="section-label">ABOUT THE STADIUM</p>
            <h2 className="section-title">A considered space for every kind of play</h2>
            <p className="section-lead">
              Purpose-built for flexibility, Toshiba Indoor Stadium welcomes casual groups,
              competitive training squads and community organizers alike. Enjoy an exceptional
              playing surface, pristine changing facilities, and seamless access.
            </p>
            <div className="about__stats">
              <div className="about__stat-item">
                <span className="stat-label">Indoor</span>
                <strong>14,000 sq ft hall</strong>
              </div>
              <div className="about__stat-item">
                <span className="stat-label">Flexible</span>
                <strong>1 or 2 hr session slots</strong>
              </div>
              <div className="about__stat-item">
                <span className="stat-label">Simple</span>
                <strong>Fast online booking</strong>
              </div>
            </div>
            <div style={{ marginTop: '2rem' }}>
              <Button to="/stadium" variant="secondary">
                Explore the Stadium →
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4 — FACILITIES & AMENITIES */}
      <section className="section section--ivory">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <p className="section-label">FACILITIES & AMENITIES</p>
            <h2 className="section-title">Everything you need, thoughtfully arranged</h2>
          </div>
          <div className="amenities-row">
            {AMENITIES.map((item) => (
              <div key={item.title} className="amenity-card">
                <CheckCircle2 size={18} className="amenity-icon" />
                <div>
                  <strong>{item.title}</strong>
                  <p>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 5 — PRICING */}
      <section className="section section--white" id="pricing">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <p className="section-label">SIMPLE PRICING</p>
            <h2 className="section-title">Premium time, clearly priced</h2>
          </div>
          <div className="pricing-grid">
            <article className="pricing-card">
              <p className="pricing-card__label">1 HOUR</p>
              <h3>{formatLkr(2750)}</h3>
              <p>Ideal for casual games, focused training sessions, or club practice.</p>
              <ul className="pricing-features">
                <li>Full indoor court access</li>
                <li>Pristine artificial turf</li>
                <li>Equipment & boundary nets</li>
                <li>Changing room & shower access</li>
              </ul>
              <Button
                to={`/book?duration=1&date=${searchDate}`}
                variant="secondary"
                fullWidth
                style={{ marginTop: '1.5rem' }}
              >
                Book 1 Hour
              </Button>
            </article>

            <article className="pricing-card pricing-card--featured">
              <span className="pricing-card__badge">MOST POPULAR</span>
              <p className="pricing-card__label">2 HOURS</p>
              <h3>{formatLkr(5500)}</h3>
              <p>Double your court time. Perfect for full matches, tournament play, or larger group sessions.</p>
              <ul className="pricing-features">
                <li>Full 120-minute uninterrupted block</li>
                <li>Priority slot reservations</li>
                <li>Complete locker & facility access</li>
                <li>Best value per player</li>
              </ul>
              <Button
                to={`/book?duration=2&date=${searchDate}`}
                variant="light"
                fullWidth
                style={{ marginTop: '1.5rem' }}
              >
                Book 2 Hours
              </Button>
            </article>
          </div>
        </div>
      </section>

      {/* SECTION 6 — AVAILABILITY PREVIEW */}
      <section className="section section--ivory">
        <div className="container availability-preview">
          <div>
            <p className="section-label">LIVE AVAILABILITY</p>
            <h2 className="section-title">Find a time that works</h2>
            <p className="section-lead">
              Live view of today's schedule at Toshiba Indoor Stadium. Booked slots are clearly
              marked so planning is effortless.
            </p>
            <div className="legend">
              <span className="legend-item">
                <i className="status-dot status-dot--available" /> Available
              </span>
              <span className="legend-item">
                <i className="status-dot status-dot--selected" /> Selected
              </span>
              <span className="legend-item">
                <i className="status-dot status-dot--booked" /> Booked
              </span>
            </div>
            <div style={{ marginTop: '2rem' }}>
              <Button to="/availability" variant="primary">
                View Full Availability →
              </Button>
            </div>
          </div>
          <div className="card slot-preview">
            <div className="slot-preview__head">
              <div>
                <strong>Saturday, 10 October</strong>
                <span style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', display: 'block' }}>
                  Toshiba Indoor Stadium Court
                </span>
              </div>
              <span className="badge badge--success">12 SLOTS OPEN</span>
            </div>
            <div className="slot-preview__grid">
              {[
                { time: '08:00 AM', status: 'available' },
                { time: '09:00 AM', status: 'available' },
                { time: '10:00 AM', status: 'available' },
                { time: '11:00 AM', status: 'available' },
                { time: '12:00 PM', status: 'booked' },
                { time: '01:00 PM', status: 'available' },
                { time: '02:00 PM', status: 'available' },
                { time: '03:00 PM', status: 'available' },
                { time: '04:00 PM', status: 'available' },
                { time: '05:00 PM', status: 'available' },
                { time: '06:00 PM', status: 'selected' },
                { time: '07:00 PM', status: 'available' },
                { time: '08:00 PM', status: 'booked' },
                { time: '09:00 PM', status: 'available' },
                { time: '10:00 PM', status: 'available' },
                { time: '11:00 PM', status: 'available' },
              ].map((slot) => {
                const isSelected = previewSlot === slot.time
                const state = isSelected ? 'selected' : slot.status
                return (
                  <button
                    key={slot.time}
                    type="button"
                    className={`slot-chip slot-chip--${state}`}
                    disabled={slot.status === 'booked'}
                    onClick={() => {
                      if (slot.status !== 'booked') setPreviewSlot(slot.time)
                    }}
                  >
                    {slot.time}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 7 — PROCESS / HOW IT WORKS */}
      <section className="section section--emerald">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <p className="section-label" style={{ color: 'rgba(255,255,255,0.7)' }}>
              HOW IT WORKS
            </p>
            <h2 className="section-title" style={{ color: 'var(--color-white)' }}>
              From plan to play in four simple steps
            </h2>
          </div>
          <div className="steps-grid">
            {STEPS.map((step) => (
              <article key={step.n} className="step-card">
                <span className="step-num">{step.n}</span>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 8 — GALLERY SHOWCASE */}
      <section className="section section--white">
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
            <div>
              <p className="section-label">GALLERY</p>
              <h2 className="section-title">Inside Toshiba Indoor Stadium</h2>
            </div>
            <Link to="/gallery" className="btn btn--secondary btn--sm">
              View All Photos →
            </Link>
          </div>
          <div className="gallery-banner">
            <img src={stadiumHero} alt="Interior view of Toshiba Indoor Stadium showing turf, boundary lines and goals" />
          </div>
        </div>
      </section>

      {/* SECTION 9 — WHY CHOOSE US / BENEFITS */}
      <section className="section section--ivory">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <p className="section-label">WHY CHOOSE US</p>
            <h2 className="section-title">A better way to book your venue</h2>
          </div>
          <div className="feature-grid">
            {FEATURES.map((feature) => {
              const Icon = feature.icon
              return (
                <article key={feature.title} className="feature-card card">
                  <div className="feature-icon-box">
                    <Icon size={24} />
                  </div>
                  <h3>{feature.title}</h3>
                  <p>{feature.text}</p>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      {/* SECTION 10 — REVIEWS */}
      <section className="section section--white">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <p className="section-label">GUEST REVIEWS</p>
            <h2 className="section-title">Loved by groups across Kandy</h2>
          </div>
          <div className="reviews-grid">
            {REVIEWS.map((review) => (
              <article key={review.name} className="card review-card">
                <div className="review-card__stars" aria-label="5 out of 5 stars">
                  {'★'.repeat(review.rating)}
                </div>
                <p>“{review.quote}”</p>
                <footer>
                  <strong>{review.name}</strong>
                  <span>{review.role}</span>
                </footer>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--white">
        <div className="container announcements">
          <div>
            <p className="section-label">Announcements</p>
            <h2 className="section-title">What’s happening</h2>
            <div className="announcement-list">
              <article>
                <div className="date-badge">
                  <span>10</span>
                  <small>OCT</small>
                </div>
                <div>
                  <h3>Extended weekend opening</h3>
                  <p>Announcement · Demo content for public notices.</p>
                </div>
              </article>
              <article>
                <div className="date-badge">
                  <span>18</span>
                  <small>OCT</small>
                </div>
                <div>
                  <h3>Community open evening</h3>
                  <p>Event · Demo content until Firebase announcements are live.</p>
                </div>
              </article>
            </div>
          </div>
          <aside className="offer-card">
            <h3>Make more time for your group</h3>
            <p>Book a 2-hour session for {formatLkr(5500)} and enjoy a longer, uninterrupted slot.</p>
            <Button to="/book" variant="primary">
              View 2-Hour Slots
            </Button>
          </aside>
        </div>
      </section>

      <section className="section section--ivory">
        <div className="container">
          <p className="section-label" style={{ textAlign: 'center', width: '100%' }}>
            Frequently asked questions
          </p>
          <h2 className="section-title" style={{ textAlign: 'center' }}>
            Everything before you book
          </h2>
          <div className="faq-list">
            {FAQ.map((item) => (
              <details key={item.q} className="faq-item">
                <summary>{item.q}</summary>
                <p>{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 13 — LOCATION */}
      <section className="section section--white">
        <div className="container location">
          <div>
            <p className="section-label">CONTACT & VISIT</p>
            <h2 className="section-title">Plan your arrival</h2>
            <p className="section-lead">
              Reach out for bookings, group sessions or visit details. Ample parking and spectator seating
              available on-site.
            </p>
            <ul className="location__meta">
              <li>
                <strong>Address</strong>
                <span>{STADIUM.address}</span>
              </li>
              <li>
                <strong>Phone</strong>
                <span>
                  <a href={`tel:${STADIUM.phone.replace(/\s/g, '')}`}>{STADIUM.phone}</a>
                </span>
              </li>
              <li>
                <strong>Email</strong>
                <span>
                  <a href={`mailto:${STADIUM.email}`}>{STADIUM.email}</a>
                </span>
              </li>
              <li>
                <strong>Opening hours</strong>
                <span>{STADIUM.hours}</span>
              </li>
            </ul>
            <div style={{ marginTop: '1.5rem' }}>
              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(STADIUM.address)}`}
                target="_blank"
                rel="noreferrer"
                className="btn btn--secondary"
              >
                Get Directions →
              </a>
            </div>
          </div>
          <div className="map-card" role="region" aria-label="Stadium Location Map">
            <div className="map-card__inner">
              <div className="map-badge">
                <MapPin size={16} />
                <span>Toshiba Indoor Stadium · Katugastota, Kandy</span>
              </div>
              <p className="map-sub">5 min drive from Katugastota Junction • Main Kandy Road</p>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-band">
        <div className="container">
          <h2>Ready to get on the court?</h2>
          <p>Choose your date, select an available time and receive instant confirmation.</p>
          <Button to="/book" variant="light" size="lg">
            Book Now
          </Button>
        </div>
      </section>
    </div>
  )
}
