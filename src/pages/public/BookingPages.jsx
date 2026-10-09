import { useState, useEffect, useMemo } from 'react'
import { useNavigate, useSearchParams, Link, useLocation } from 'react-router-dom'
import {
  Calendar as CalendarIcon,
  Clock,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  QrCode,
  ArrowRight,
  User,
  AlertCircle,
} from 'lucide-react'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import {
  TIME_SLOTS,
  formatDateLabel,
  formatSlotLabel,
  formatLkr,
  STADIUM,
  PRICING,
} from '../../utils/constants'
import { addHoursToTime } from '../../utils/booking'
import { checkSlotAvailability, createBooking } from '../../services/bookingService'
import './BookingPages.css'

export function BookPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { profile, isAuthenticated } = useAuth()
  const toast = useToast()

  const today = useMemo(() => new Date(), [])
  const todayStr = today.toISOString().split('T')[0]

  // Form State
  const [step, setStep] = useState(1) // 1 to 5
  const [date, setDate] = useState(searchParams.get('date') || todayStr)
  const [time, setTime] = useState(searchParams.get('time') || '18:00')
  const [duration, setDuration] = useState(Number(searchParams.get('duration')) || 1)
  const [customer, setCustomer] = useState({
    name: profile?.name || '',
    email: profile?.email || '',
    phone: profile?.phone || '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  // Calendar navigation state for Step 1
  const [calendarMonth, setCalendarMonth] = useState(new Date(date))

  // Update customer fields when profile loads
  useEffect(() => {
    if (profile) {
      setCustomer((prev) => ({
        name: prev.name || profile.name || '',
        email: prev.email || profile.email || '',
        phone: prev.phone || profile.phone || '',
      }))
    }
  }, [profile])

  const calculatedEndTime = addHoursToTime(time, duration)
  const calculatedPrice = duration === 1 ? PRICING.oneHour : PRICING.twoHours

  // Calendar math
  const cYear = calendarMonth.getFullYear()
  const cMonth = calendarMonth.getMonth()
  const monthTitle = calendarMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  const firstDay = new Date(cYear, cMonth, 1).getDay()
  const startOffset = (firstDay + 6) % 7
  const daysInMonth = new Date(cYear, cMonth + 1, 0).getDate()

  const isDayPast = (dayNum) => {
    const check = new Date(cYear, cMonth, dayNum, 23, 59, 59)
    return check < today
  }

  // Handle advancing steps
  const handleNextStep = async () => {
    setErrorMessage('')

    if (step === 1) {
      if (!date) {
        setErrorMessage('Please select a booking date.')
        return
      }
      setStep(2)
    } else if (step === 2) {
      if (!time) {
        setErrorMessage('Please select a session start time.')
        return
      }
      setStep(3)
    } else if (step === 3) {
      if (!duration) {
        setErrorMessage('Please choose a session duration.')
        return
      }
      setStep(4)
    } else if (step === 4) {
      if (!customer.name.trim() || !customer.email.trim()) {
        setErrorMessage('Please complete your name and email address.')
        return
      }
      // Check availability before moving to final confirmation
      setIsSubmitting(true)
      try {
        const available = await checkSlotAvailability(date, time, duration)
        if (!available) {
          setErrorMessage('This time slot is no longer available. Please choose another time.')
          toast.error('Selected slot has conflict. Please pick another time.')
          setIsSubmitting(false)
          setStep(2) // send back to choose time
          return
        }
      } catch (err) {
        console.warn('Availability check warning:', err)
      } finally {
        setIsSubmitting(false)
      }
      setStep(5)
    } else if (step === 5) {
      // Confirm Booking
      setIsSubmitting(true)
      try {
        const newBooking = await createBooking({
          userId: profile?.uid,
          customerName: customer.name,
          customerEmail: customer.email,
          customerPhone: customer.phone,
          date,
          startTime: time,
          durationHours: duration,
        })
        toast.success('Your stadium time has been secured!')
        navigate('/booking-success', { state: { booking: newBooking } })
      } catch (err) {
        console.error(err)
        setErrorMessage(err.message || 'This time slot is no longer available. Please choose another time.')
        toast.error('Booking conflict detected.')
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  const handlePrevStep = () => {
    setErrorMessage('')
    setStep((s) => Math.max(1, s - 1))
  }

  const stepsList = ['Date', 'Time', 'Duration', 'Details', 'Review']

  return (
    <div className="booking-page">
      <div className="container booking-container">
        {/* HEADER */}
        <div className="booking-header">
          <p className="section-label">ONLINE VENUE RESERVATION</p>
          <h1>Book Toshiba Indoor Stadium</h1>
          <p>Complete your session booking in four simple steps with instant confirmation.</p>
        </div>

        {/* STEPPER BREADCRUMBS */}
        <nav className="stepper-nav" aria-label="Booking steps">
          {stepsList.map((stepName, i) => {
            const stepNum = i + 1
            const isCompleted = step > stepNum
            const isActive = step === stepNum
            return (
              <div key={stepName} style={{ display: 'flex', alignItems: 'center' }}>
                <div
                  className={`stepper-item${isActive ? ' is-active' : ''}${
                    isCompleted ? ' is-completed' : ''
                  }`}
                >
                  <span className="stepper-num">
                    {isCompleted ? '✓' : stepNum}
                  </span>
                  <span>{stepName}</span>
                </div>
                {i < stepsList.length - 1 && <span className="stepper-sep">/</span>}
              </div>
            )
          })}
        </nav>

        {/* ERROR CALLOUT */}
        {errorMessage && (
          <div className="auth-error" style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertCircle size={18} />
            <span>{errorMessage}</span>
          </div>
        )}

        <div className="booking-card-main">
          {/* STEP 1: DATE */}
          {step === 1 && (
            <div>
              <h2 className="booking-step-title">Select your date</h2>
              <p className="booking-step-sub">Choose a day to see stadium availability.</p>

              <div className="calendar-top">
                <h3 className="calendar-month">{monthTitle}</h3>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    type="button"
                    className="calendar-nav-btn"
                    onClick={() => setCalendarMonth(new Date(cYear, cMonth - 1, 1))}
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    type="button"
                    className="calendar-nav-btn"
                    onClick={() => setCalendarMonth(new Date(cYear, cMonth + 1, 1))}
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>

              <div className="calendar-weekdays">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((w) => (
                  <div key={w}>{w}</div>
                ))}
              </div>

              <div className="calendar-grid">
                {Array.from({ length: startOffset }).map((_, i) => (
                  <div key={`offset-${i}`} />
                ))}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const dayNum = i + 1
                  const m = String(cMonth + 1).padStart(2, '0')
                  const d = String(dayNum).padStart(2, '0')
                  const dayDateStr = `${cYear}-${m}-${d}`
                  const past = isDayPast(dayNum)
                  const isSelected = date === dayDateStr

                  return (
                    <button
                      key={dayNum}
                      type="button"
                      disabled={past}
                      onClick={() => setDate(dayDateStr)}
                      className={`calendar-day${isSelected ? ' calendar-day--selected' : ''}`}
                    >
                      <span>{dayNum}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* STEP 2: TIME */}
          {step === 2 && (
            <div>
              <h2 className="booking-step-title">Select a time</h2>
              <p className="booking-step-sub">
                Available, selected and booked slots are clearly marked for <strong>{formatDateLabel(date)}</strong>.
              </p>

              <div className="legend" style={{ marginBottom: '1.5rem' }}>
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

              <div className="slots-grid-full">
                {TIME_SLOTS.map((slot) => {
                  const isSelected = time === slot
                  // Demo booked slots
                  const isBooked = (date === todayStr && ['12:00', '19:00', '20:00'].includes(slot))
                  return (
                    <button
                      key={slot}
                      type="button"
                      disabled={isBooked}
                      onClick={() => setTime(slot)}
                      className={`slot-card${isSelected ? ' slot-card--selected' : ''}${
                        isBooked ? ' slot-card--booked' : ''
                      }`}
                    >
                      <span className="slot-time">{formatSlotLabel(slot)}</span>
                      <span className="slot-status">{isBooked ? 'Booked' : isSelected ? 'Selected' : 'Available'}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* STEP 3: DURATION */}
          {step === 3 && (
            <div>
              <h2 className="booking-step-title">Choose your duration</h2>
              <p className="booking-step-sub">Select 1 hour or 2 hours for your stadium session.</p>

              <div className="duration-choice-grid">
                <button
                  type="button"
                  className={`duration-card-btn${duration === 1 ? ' is-selected' : ''}`}
                  onClick={() => setDuration(1)}
                >
                  <span className="duration-tag">STANDARD SESSION</span>
                  <h3>1 Hour</h3>
                  <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--color-primary)', margin: '0.5rem 0' }}>
                    {formatLkr(PRICING.oneHour)}
                  </div>
                  <p>Ideal for casual games, focused training sessions, or club practice.</p>
                </button>

                <button
                  type="button"
                  className={`duration-card-btn${duration === 2 ? ' is-selected' : ''}`}
                  onClick={() => setDuration(2)}
                >
                  <span className="duration-tag" style={{ color: '#8a6a1f' }}>MOST POPULAR · 2X TIME</span>
                  <h3>2 Hours</h3>
                  <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--color-primary)', margin: '0.5rem 0' }}>
                    {formatLkr(PRICING.twoHours)}
                  </div>
                  <p>Double your court time. Perfect for full matches, tournament play, or larger group sessions.</p>
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: CUSTOMER DETAILS */}
          {step === 4 && (
            <div>
              <h2 className="booking-step-title">Your details</h2>
              <p className="booking-step-sub">Enter your contact information for booking confirmation and venue access.</p>

              <div style={{ display: 'grid', gap: '1.25rem', maxWidth: '600px' }}>
                <Input
                  label="Full Name"
                  name="name"
                  value={customer.name}
                  onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                  placeholder="e.g. Suresh Keshwin"
                  required
                />
                <Input
                  label="Email Address"
                  name="email"
                  type="email"
                  value={customer.email}
                  onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                  placeholder="name@example.com"
                  required
                />
                <Input
                  label="Phone Number"
                  name="phone"
                  type="tel"
                  value={customer.phone}
                  onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                  placeholder="+94 77 123 4567"
                  required
                />
              </div>
            </div>
          )}

          {/* STEP 5: REVIEW & CONFIRM */}
          {step === 5 && (
            <div>
              <h2 className="booking-step-title">Review & confirm your booking</h2>
              <p className="booking-step-sub">Check every detail before locking in your stadium session.</p>

              <div className="review-split">
                <div>
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--color-charcoal)' }}>
                    Player Information
                  </h3>
                  <div className="card" style={{ padding: '1.5rem', display: 'grid', gap: '0.75rem', marginBottom: '1.5rem' }}>
                    <div>
                      <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>NAME</span>
                      <strong style={{ display: 'block' }}>{customer.name}</strong>
                    </div>
                    <div>
                      <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>EMAIL</span>
                      <strong style={{ display: 'block' }}>{customer.email}</strong>
                    </div>
                    <div>
                      <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>PHONE</span>
                      <strong style={{ display: 'block' }}>{customer.phone || '—'}</strong>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--color-success)', fontSize: '0.9rem' }}>
                    <ShieldCheck size={20} />
                    <span>Slot verified available • No overlapping reservation</span>
                  </div>
                </div>

                <div className="review-summary-box">
                  <div>
                    <h3>Booking Summary</h3>
                    <ul className="review-summary-items">
                      <li>
                        <span>Venue</span>
                        <strong>{STADIUM.name}</strong>
                      </li>
                      <li>
                        <span>Date</span>
                        <strong>{formatDateLabel(date)}</strong>
                      </li>
                      <li>
                        <span>Session Time</span>
                        <strong>
                          {formatSlotLabel(time)} — {formatSlotLabel(calculatedEndTime)}
                        </strong>
                      </li>
                      <li>
                        <span>Duration</span>
                        <strong>{duration} {duration === 1 ? 'Hour' : 'Hours'}</strong>
                      </li>
                    </ul>
                  </div>

                  <div className="review-total-strip">
                    <span>Total Fee</span>
                    <strong>{formatLkr(calculatedPrice)}</strong>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* BOTTOM STEP CONTROLS */}
          <div className="booking-nav-buttons">
            {step > 1 ? (
              <Button type="button" variant="secondary" onClick={handlePrevStep} disabled={isSubmitting}>
                ← Back
              </Button>
            ) : (
              <Link to="/availability" className="btn btn--ghost">
                View Calendar
              </Link>
            )}

            <Button
              type="button"
              variant="primary"
              size="lg"
              onClick={handleNextStep}
              disabled={isSubmitting}
            >
              {isSubmitting
                ? 'Processing...'
                : step === 5
                ? 'Confirm Booking →'
                : 'Continue →'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export function BookingSuccessPage() {
  const location = useLocation()
  const booking = location.state?.booking || {
    id: 'TIS-1010-6PM',
    customerName: 'Suresh Keshwin',
    customerEmail: 'suresh.keshwin@gmail.com',
    customerPhone: '+94 77 123 4567',
    date: '2026-10-10',
    startTime: '18:00',
    endTime: '20:00',
    duration: 2,
    totalPrice: 5500,
    status: 'confirmed',
  }

  return (
    <div className="booking-success-wrap">
      <div className="container">
        <div className="booking-success-card">
          <div className="success-badge-circle">
            <CheckCircle2 size={42} />
          </div>

          <p className="section-label">CONFIRMED RESERVATION</p>
          <h1>Your stadium time is secured</h1>
          <p className="lead-text">
            A confirmation email has been sent to <strong>{booking.customerEmail}</strong>. Present your
            booking reference or QR pass upon arrival at the venue desk.
          </p>

          <div className="qr-code-box">
            <div className="qr-matrix" role="img" aria-label="QR Pass Code">
              <QrCode size={88} color="var(--color-primary-dark)" />
            </div>
            <div className="qr-details">
              <span>BOOKING REFERENCE</span>
              <strong>{booking.id}</strong>
              <span style={{ color: 'var(--color-success)', fontWeight: '600' }}>
                STATUS: CONFIRMED
              </span>
            </div>
          </div>

          <ul className="success-details-list">
            <li>
              <span>Customer</span>
              <strong>{booking.customerName}</strong>
            </li>
            <li>
              <span>Venue</span>
              <strong>{STADIUM.name}</strong>
            </li>
            <li>
              <span>Date</span>
              <strong>{formatDateLabel(booking.date)}</strong>
            </li>
            <li>
              <span>Session Time</span>
              <strong>
                {formatSlotLabel(booking.startTime)} – {formatSlotLabel(booking.endTime)} ({booking.duration} {booking.duration === 1 ? 'Hour' : 'Hours'})
              </strong>
            </li>
            <li>
              <span>Total Price</span>
              <strong style={{ color: 'var(--color-primary)', fontSize: '1.15rem' }}>
                {formatLkr(booking.totalPrice)}
              </strong>
            </li>
          </ul>

          <div className="success-actions">
            <Link to="/my-bookings" className="btn btn--primary btn--lg">
              View My Bookings →
            </Link>
            <Link to="/" className="btn btn--secondary btn--lg">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
