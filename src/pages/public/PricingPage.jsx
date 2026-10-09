import { Check, ShieldCheck, Clock, Award, Sparkles, HelpCircle } from 'lucide-react'
import Button from '../../components/common/Button'
import { DURATION_OPTIONS, formatLkr, STADIUM } from '../../utils/constants'
import './PricingPage.css'

export default function PricingPage() {
  return (
    <div className="pricing-page">
      <div className="container">
        {/* HEADER */}
        <div className="pricing-header">
          <p className="section-label">SIMPLE & TRANSPARENT PRICING</p>
          <h1>Premium Court Time, Clearly Priced</h1>
          <p className="pricing-sub">
            All bookings include full, private access to the entire indoor stadium court, premium artificial turf,
            high-lux illumination, changing rooms and shower facilities.
          </p>
        </div>

        {/* 2 ELEGANT PRICING CARDS */}
        <div className="pricing-grid-center">
          {/* 1 HOUR */}
          <article className="pricing-card">
            <p className="pricing-card__label">1 HOUR</p>
            <div className="pricing-amount">
              <h3>{formatLkr(2750)}</h3>
              <span>/ session</span>
            </div>
            <p className="pricing-desc">
              Ideal for casual matches, focused skill workouts, or squad training sessions.
            </p>
            <ul className="pricing-perks">
              <li>
                <Check size={16} /> Full 60 minutes court access
              </li>
              <li>
                <Check size={16} /> Premium artificial turf playing surface
              </li>
              <li>
                <Check size={16} /> High-lux LED stadium lighting
              </li>
              <li>
                <Check size={16} /> Dedicated changing rooms & hot showers
              </li>
              <li>
                <Check size={16} /> On-site spectator seating
              </li>
              <li>
                <Check size={16} /> Perimeter netting & goals included
              </li>
            </ul>
            <div style={{ marginTop: '2rem' }}>
              <Button to="/book?duration=1" variant="secondary" fullWidth size="lg">
                Book 1 Hour
              </Button>
            </div>
          </article>

          {/* 2 HOURS */}
          <article className="pricing-card pricing-card--featured">
            <div className="pricing-badge-row">
              <span className="pricing-badge">MOST POPULAR</span>
              <span className="pricing-badge-sub">BEST VALUE</span>
            </div>
            <p className="pricing-card__label">2 HOURS</p>
            <div className="pricing-amount">
              <h3>{formatLkr(5500)}</h3>
              <span>/ session</span>
            </div>
            <p className="pricing-desc">
              Double your playing time. Perfect for full competitive matches, mini-tournaments, or multi-team training.
            </p>
            <ul className="pricing-perks">
              <li>
                <Check size={16} /> Full 120 minutes continuous court block
              </li>
              <li>
                <Check size={16} /> Uninterrupted match play & tactical training
              </li>
              <li>
                <Check size={16} /> Pristine FIFA-standard turf condition
              </li>
              <li>
                <Check size={16} /> Priority slot booking & access
              </li>
              <li>
                <Check size={16} /> Full locker & shower facilities for all players
              </li>
              <li>
                <Check size={16} /> Dedicated stadium court manager on duty
              </li>
            </ul>
            <div style={{ marginTop: '2rem' }}>
              <Button to="/book?duration=2" variant="light" fullWidth size="lg">
                Book 2 Hours
              </Button>
            </div>
          </article>
        </div>

        {/* VALUE PROPOSITION STRIP */}
        <div className="pricing-guarantees card">
          <div className="guarantee-item">
            <ShieldCheck size={24} className="guarantee-icon" />
            <div>
              <strong>No Hidden Charges</strong>
              <p>Everything listed is included in your booking price.</p>
            </div>
          </div>
          <div className="guarantee-item">
            <Clock size={24} className="guarantee-icon" />
            <div>
              <strong>Instant Live Confirmation</strong>
              <p>Your slot is locked in real-time with zero double-booking.</p>
            </div>
          </div>
          <div className="guarantee-item">
            <Award size={24} className="guarantee-icon" />
            <div>
              <strong>Flexible Cancellation</strong>
              <p>Cancel or reschedule online up to 6 hours before session start.</p>
            </div>
          </div>
        </div>

        {/* PRICING FAQ */}
        <div className="pricing-faq">
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <p className="section-label">HAVE QUESTIONS?</p>
            <h2>Frequently Asked Pricing Questions</h2>
          </div>
          <div className="faq-list">
            <details className="faq-item">
              <summary>Are lights and changing rooms charged extra?</summary>
              <p>No. Overhead LED stadium lighting, changing rooms, restrooms, and on-site parking are completely covered in your booking fee.</p>
            </details>
            <details className="faq-item">
              <summary>Can I book consecutive hours?</summary>
              <p>Yes. You can select a 2-hour session or book multiple slots back-to-back if you are hosting a longer community event or tournament.</p>
            </details>
            <details className="faq-item">
              <summary>What payment methods are supported?</summary>
              <p>You can reserve online with your verified account and complete payment at the venue desk upon arrival or via bank transfer by contacting management.</p>
            </details>
          </div>
        </div>
      </div>
    </div>
  )
}
