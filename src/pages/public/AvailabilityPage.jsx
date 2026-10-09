import { useState, useMemo } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Clock, Calendar as CalendarIcon, ArrowRight, CheckCircle2 } from 'lucide-react'
import Button from '../../components/common/Button'
import { TIME_SLOTS, formatDateLabel, formatSlotLabel } from '../../utils/constants'
import './AvailabilityPage.css'

// Demo booked slots to represent realistic stadium activity
const DEMO_BOOKED_SLOTS = {
  // Key format: YYYY-MM-DD
  today: ['12:00', '19:00', '20:00'],
  tomorrow: ['09:00', '15:00', '18:00'],
}

export default function AvailabilityPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const today = useMemo(() => new Date(), [])
  const initialDateStr = searchParams.get('date') || today.toISOString().split('T')[0]

  const [currentMonth, setCurrentMonth] = useState(new Date(initialDateStr))
  const [selectedDate, setSelectedDate] = useState(initialDateStr)
  const [selectedSlot, setSelectedSlot] = useState(searchParams.get('time') || '18:00')

  // Calendar calculations
  const year = currentMonth.getFullYear()
  const month = currentMonth.getMonth()

  const monthName = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

  const firstDayOfMonth = new Date(year, month, 1).getDay()
  // Adjust so Monday is 0, Sunday is 6
  const startOffset = (firstDayOfMonth + 6) % 7
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(year, month - 1, 1))
  }

  const handleNextMonth = () => {
    setCurrentMonth(new Date(year, month + 1, 1))
  }

  const isDatePast = (dayNum) => {
    const checkDate = new Date(year, month, dayNum, 23, 59, 59)
    return checkDate < today
  }

  const handleSelectDay = (dayNum) => {
    const m = String(month + 1).padStart(2, '0')
    const d = String(dayNum).padStart(2, '0')
    const dateStr = `${year}-${m}-${d}`
    setSelectedDate(dateStr)
  }

  // Determine booked slots for current selected date
  const isBooked = (time) => {
    const todayStr = today.toISOString().split('T')[0]
    const tomorrowDate = new Date(today)
    tomorrowDate.setDate(today.getDate() + 1)
    const tomorrowStr = tomorrowDate.toISOString().split('T')[0]

    if (selectedDate === todayStr && DEMO_BOOKED_SLOTS.today.includes(time)) return true
    if (selectedDate === tomorrowStr && DEMO_BOOKED_SLOTS.tomorrow.includes(time)) return true
    // Deterministic simulation for other days
    const daySeed = new Date(selectedDate).getDate() || 1
    if ((daySeed % 3 === 0 && time === '14:00') || (daySeed % 2 === 0 && time === '19:00')) return true
    return false
  }

  const handleContinue = () => {
    if (selectedDate && selectedSlot) {
      navigate(`/book?date=${selectedDate}&time=${selectedSlot}&duration=1`)
    }
  }

  const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

  return (
    <div className="availability-page">
      <div className="container availability-flow">
        <div className="availability-header">
          <p className="section-label">LIVE STADIUM SCHEDULE</p>
          <h1>Select your date & time</h1>
          <p>Choose an available slot. Bookings update live 24/7 with zero double-booking.</p>
        </div>

        <div className="availability-card">
          {/* STEP 1: DATE CALENDAR */}
          <div className="calendar-top">
            <h2 className="calendar-month">{monthName}</h2>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                type="button"
                className="calendar-nav-btn"
                onClick={handlePrevMonth}
                aria-label="Previous Month"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                type="button"
                className="calendar-nav-btn"
                onClick={handleNextMonth}
                aria-label="Next Month"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          <div className="calendar-weekdays">
            {weekdays.map((w) => (
              <div key={w}>{w}</div>
            ))}
          </div>

          <div className="calendar-grid">
            {Array.from({ length: startOffset }).map((_, i) => (
              <div key={`offset-${i}`} />
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const dayNum = i + 1
              const m = String(month + 1).padStart(2, '0')
              const d = String(dayNum).padStart(2, '0')
              const dateStr = `${year}-${m}-${d}`
              const isPast = isDatePast(dayNum)
              const isSelected = selectedDate === dateStr
              const isCurrentDay = today.toISOString().split('T')[0] === dateStr

              return (
                <button
                  key={dayNum}
                  type="button"
                  disabled={isPast}
                  onClick={() => handleSelectDay(dayNum)}
                  className={`calendar-day${isSelected ? ' calendar-day--selected' : ''}${
                    isCurrentDay ? ' calendar-day--today' : ''
                  }`}
                >
                  <span>{dayNum}</span>
                </button>
              )
            })}
          </div>

          {/* STEP 2: TIME SLOTS */}
          <div className="slot-selection-section">
            <div className="slots-header-row">
              <div>
                <h3>Select a time</h3>
                <p style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)', margin: 0 }}>
                  Viewing schedule for <strong>{formatDateLabel(selectedDate)}</strong>
                </p>
              </div>
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
            </div>

            <div className="slots-grid-full">
              {TIME_SLOTS.map((time) => {
                const booked = isBooked(time)
                const isSelected = selectedSlot === time && !booked
                return (
                  <button
                    key={time}
                    type="button"
                    disabled={booked}
                    onClick={() => setSelectedSlot(time)}
                    className={`slot-card${isSelected ? ' slot-card--selected' : ''}${
                      booked ? ' slot-card--booked' : ''
                    }`}
                  >
                    <span className="slot-time">{formatSlotLabel(time)}</span>
                    <span className="slot-status">{booked ? 'Booked' : isSelected ? 'Selected' : 'Available'}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* ACTION BAR */}
          <div className="availability-action-bar">
            <div className="selected-summary">
              <div className="selected-summary-icon">
                <CalendarIcon size={20} />
              </div>
              <div className="selected-summary-text">
                <strong>{formatDateLabel(selectedDate)}</strong>
                <span>
                  {selectedSlot ? `Selected time: ${formatSlotLabel(selectedSlot)}` : 'Select a time slot above'}
                </span>
              </div>
            </div>

            <Button
              type="button"
              variant="primary"
              size="lg"
              disabled={!selectedDate || !selectedSlot || isBooked(selectedSlot)}
              onClick={handleContinue}
            >
              Continue to Booking <ArrowRight size={18} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
