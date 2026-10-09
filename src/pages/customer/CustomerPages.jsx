import { useState, useEffect, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  Bell,
  User,
  Search,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'
import Modal from '../../components/common/Modal'
import StatusBadge from '../../components/common/StatusBadge'
import EmptyState from '../../components/common/EmptyState'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import {
  formatDateLabel,
  formatSlotLabel,
  formatLkr,
  STADIUM,
} from '../../utils/constants'
import {
  getCustomerBookings,
  cancelBooking,
} from '../../services/bookingService'
import './CustomerPages.css'

// 1. DASHBOARD PAGE
export function DashboardPage() {
  const { profile } = useAuth()
  const navigate = useNavigate()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const data = await getCustomerBookings(profile?.uid)
        setBookings(data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [profile?.uid])

  const upcomingBookings = useMemo(
    () => bookings.filter((b) => b.status === 'confirmed'),
    [bookings],
  )
  const completedBookings = useMemo(
    () => bookings.filter((b) => b.status === 'completed'),
    [bookings],
  )
  const totalHours = useMemo(
    () => bookings.reduce((sum, b) => (b.status !== 'cancelled' ? sum + (b.duration || 1) : sum), 0),
    [bookings],
  )

  const nextBooking = upcomingBookings[0]

  return (
    <div className="cust-overview">
      {/* HEADER */}
      <div className="cust-header">
        <div>
          <h1>Good morning, {profile?.name || 'Customer'}</h1>
          <p>Here’s everything happening with your stadium bookings.</p>
        </div>
        <Button to="/book" variant="primary" size="md">
          Book a Session →
        </Button>
      </div>

      {/* 3 STAT CARDS */}
      <div className="cust-stats-grid">
        <div className="cust-stat-card">
          <span className="cust-stat-num">{upcomingBookings.length}</span>
          <span className="cust-stat-label">Upcoming Bookings</span>
        </div>
        <div className="cust-stat-card">
          <span className="cust-stat-num">{completedBookings.length}</span>
          <span className="cust-stat-label">Completed Bookings</span>
        </div>
        <div className="cust-stat-card">
          <span className="cust-stat-num">{totalHours} hrs</span>
          <span className="cust-stat-label">Total Hours Booked</span>
        </div>
      </div>

      {/* FEATURED NEXT BOOKING */}
      {nextBooking ? (
        <div className="next-booking-card">
          <div>
            <span className="next-booking-tag">NEXT BOOKING</span>
            <h2>{formatDateLabel(nextBooking.date)}</h2>
            <div className="next-booking-meta">
              <span>
                <Clock size={16} /> {formatSlotLabel(nextBooking.startTime)} – {formatSlotLabel(nextBooking.endTime)} ({nextBooking.duration}h)
              </span>
              <span>
                <CheckCircle size={16} /> {STADIUM.name}
              </span>
            </div>
          </div>
          <div className="next-booking-actions">
            <Link to="/my-bookings" className="btn btn--light btn--sm">
              Manage Booking
            </Link>
          </div>
        </div>
      ) : (
        <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: '1rem' }}>No upcoming bookings scheduled.</p>
          <Button to="/book" variant="primary" size="sm">
            Book Court Now
          </Button>
        </div>
      )}

      {/* UPCOMING SESSIONS LIST */}
      <div>
        <div className="cust-section-title">
          <span>Upcoming Bookings</span>
          <Link to="/my-bookings" style={{ fontSize: '0.88rem', color: 'var(--color-primary)' }}>
            View All ({upcomingBookings.length})
          </Link>
        </div>
        {upcomingBookings.length === 0 ? (
          <EmptyState title="No upcoming bookings" description="Your upcoming sessions will appear here once reserved." />
        ) : (
          <div className="booking-cards-list">
            {upcomingBookings.map((b) => (
              <BookingRowItem key={b.id} booking={b} />
            ))}
          </div>
        )}
      </div>

      {/* RECENTLY COMPLETED */}
      {completedBookings.length > 0 && (
        <div>
          <div className="cust-section-title">
            <span>Recently Completed</span>
          </div>
          <div className="booking-cards-list">
            {completedBookings.slice(0, 3).map((b) => (
              <BookingRowItem key={b.id} booking={b} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// 2. MY BOOKINGS PAGE
export function MyBookingsPage() {
  const { profile } = useAuth()
  const toast = useToast()
  const [bookings, setBookings] = useState([])
  const [tab, setTab] = useState('upcoming')
  const [cancellingBooking, setCancellingBooking] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    async function load() {
      const data = await getCustomerBookings(profile?.uid)
      setBookings(data)
    }
    load()
  }, [profile?.uid])

  const filtered = useMemo(() => {
    if (tab === 'all') return bookings
    if (tab === 'upcoming') return bookings.filter((b) => b.status === 'confirmed')
    if (tab === 'completed') return bookings.filter((b) => b.status === 'completed')
    if (tab === 'cancelled') return bookings.filter((b) => b.status === 'cancelled')
    return bookings
  }, [bookings, tab])

  const handleConfirmCancel = async () => {
    if (!cancellingBooking) return
    setIsProcessing(true)
    try {
      await cancelBooking(cancellingBooking.id)
      setBookings((prev) =>
        prev.map((b) => (b.id === cancellingBooking.id ? { ...b, status: 'cancelled' } : b)),
      )
      toast.success(`Booking ${cancellingBooking.id} has been cancelled.`)
      setCancellingBooking(null)
    } catch (err) {
      toast.error('Failed to cancel booking.')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div>
      <div className="cust-header" style={{ marginBottom: '2rem' }}>
        <div>
          <h1>My Bookings</h1>
          <p>Review, manage and cancel your court reservations.</p>
        </div>
        <Button to="/book" variant="primary" size="md">
          Book Another Session
        </Button>
      </div>

      {/* FILTER TABS */}
      <div className="cust-tabs">
        {[
          { id: 'upcoming', label: 'Upcoming' },
          { id: 'completed', label: 'Completed' },
          { id: 'cancelled', label: 'Cancelled' },
          { id: 'all', label: 'All Bookings' },
        ].map((t) => (
          <button
            key={t.id}
            type="button"
            className={`cust-tab-btn${tab === t.id ? ' is-active' : ''}`}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title={`No ${tab} bookings`}
          description="You do not have any sessions in this category."
          action={<Button to="/book">Book Court Now</Button>}
        />
      ) : (
        <div className="booking-cards-list">
          {filtered.map((b) => (
            <BookingRowItem
              key={b.id}
              booking={b}
              showCancelButton={b.status === 'confirmed'}
              onCancelRequest={() => setCancellingBooking(b)}
            />
          ))}
        </div>
      )}

      {/* CANCELLATION MODAL */}
      {cancellingBooking && (
        <Modal
          title="Cancel Booking"
          isOpen={Boolean(cancellingBooking)}
          onClose={() => setCancellingBooking(null)}
        >
          <div style={{ display: 'grid', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--color-danger)' }}>
              <ShieldAlert size={24} />
              <strong style={{ fontSize: '1.05rem' }}>Are you sure you want to cancel this booking?</strong>
            </div>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.92rem', lineHeight: '1.5' }}>
              Reference <strong>{cancellingBooking.id}</strong> scheduled for{' '}
              <strong>{formatDateLabel(cancellingBooking.date)}</strong> at{' '}
              <strong>{formatSlotLabel(cancellingBooking.startTime)}</strong> will be released and made available for other players.
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
              <Button
                type="button"
                variant="secondary"
                onClick={() => setCancellingBooking(null)}
                disabled={isProcessing}
              >
                Keep Booking
              </Button>
              <button
                type="button"
                className="btn btn--primary"
                style={{ background: 'var(--color-danger)', borderColor: 'var(--color-danger)' }}
                onClick={handleConfirmCancel}
                disabled={isProcessing}
              >
                {isProcessing ? 'Cancelling...' : 'Confirm Cancellation'}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}

// 3. BOOKING HISTORY PAGE
export function BookingHistoryPage() {
  const { profile } = useAuth()
  const [bookings, setBookings] = useState([])
  const [queryText, setQueryText] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => {
    async function load() {
      const data = await getCustomerBookings(profile?.uid)
      setBookings(data)
    }
    load()
  }, [profile?.uid])

  const filtered = useMemo(() => {
    return bookings.filter((b) => {
      const matchesQuery =
        !queryText ||
        b.id.toLowerCase().includes(queryText.toLowerCase()) ||
        b.date.includes(queryText)
      const matchesStatus = statusFilter === 'all' || b.status === statusFilter
      return matchesQuery && matchesStatus
    })
  }, [bookings, queryText, statusFilter])

  return (
    <div>
      <div className="cust-header" style={{ marginBottom: '2rem' }}>
        <div>
          <h1>Booking History</h1>
          <p>Complete historical log of all your previous stadium sessions.</p>
        </div>
      </div>

      {/* SEARCH AND FILTERS */}
      <div className="card" style={{ padding: '1.25rem', marginBottom: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '220px' }}>
          <Input
            placeholder="Search by Booking ID or date..."
            value={queryText}
            onChange={(e) => setQueryText(e.target.value)}
          />
        </div>
        <select
          className="select"
          style={{ width: 'auto', minWidth: '160px' }}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Statuses</option>
          <option value="confirmed">Confirmed</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* TABLE */}
      {filtered.length === 0 ? (
        <EmptyState title="No records found" description="No booking records match your search criteria." />
      ) : (
        <div className="card table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>Date</th>
                <th>Time & Duration</th>
                <th>Price</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((b) => (
                <tr key={b.id}>
                  <td>
                    <strong>{b.id}</strong>
                  </td>
                  <td>{formatDateLabel(b.date)}</td>
                  <td>
                    {formatSlotLabel(b.startTime)} ({b.duration} {b.duration === 1 ? 'Hour' : 'Hours'})
                  </td>
                  <td>{formatLkr(b.totalPrice)}</td>
                  <td>
                    <StatusBadge status={b.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

// 4. NOTIFICATIONS PAGE
export function NotificationsPage() {
  const { profile } = useAuth()
  const toast = useToast()

  const defaultNotifications = [
    {
      id: 'notif-1',
      title: 'Booking Confirmed',
      message: 'Your booking TIS-1010-6PM for Saturday, 10 October at 6:00 PM is locked in.',
      type: 'confirmed',
      time: 'Today, 2:15 PM',
      read: false,
    },
    {
      id: 'notif-2',
      title: 'Upcoming Session Reminder',
      message: 'Your session starts in 24 hours. Ensure your team arrives 10 minutes before kickoff.',
      type: 'reminder',
      time: 'Yesterday, 6:00 PM',
      read: false,
    },
    {
      id: 'notif-3',
      title: 'Evening Slot Maintenance Update',
      message: 'Perimeter net servicing completed. All courts fully open for play.',
      type: 'maintenance',
      time: '28 September, 9:00 AM',
      read: true,
    },
    {
      id: 'notif-4',
      title: 'Welcome to Toshiba Indoor Stadium',
      message: 'Thank you for visiting Toshiba Indoor Stadium online.',
      type: 'welcome',
      time: '20 September, 4:10 PM',
      read: true,
    },
  ]

  const [notifs, setNotifs] = useState(() => {
    const saved = localStorage.getItem('tis_stored_notifications')
    return saved ? JSON.parse(saved) : defaultNotifications
  })

  const markAllAsRead = () => {
    const updated = notifs.map((n) => ({ ...n, read: true }))
    setNotifs(updated)
    localStorage.setItem('tis_stored_notifications', JSON.stringify(updated))
    toast.success('All notifications marked as read.')
  }

  return (
    <div>
      <div className="cust-header" style={{ marginBottom: '2rem' }}>
        <div>
          <h1>Notifications</h1>
          <p>Booking confirmations, schedule alerts, and stadium updates.</p>
        </div>
        <Button type="button" variant="secondary" size="sm" onClick={markAllAsRead}>
          Mark All as Read
        </Button>
      </div>

      <div className="notif-list">
        {notifs.map((n) => (
          <article key={n.id} className={`notif-card${!n.read ? ' is-unread' : ''}`}>
            <div className="notif-main">
              <Bell className="notif-icon" size={20} />
              <div className="notif-content">
                <strong>{n.title}</strong>
                <p>{n.message}</p>
              </div>
            </div>
            <span className="notif-time">{n.time || 'Recently'}</span>
          </article>
        ))}
      </div>
    </div>
  )
}

// 5. PROFILE PAGE
export function ProfilePage() {
  const { profile, updateProfileData, sendPasswordReset } = useAuth()
  const toast = useToast()

  const [formData, setFormData] = useState({
    name: profile?.name || '',
    email: profile?.email || '',
    phone: profile?.phone || '',
  })
  const [isSaving, setIsSaving] = useState(false)
  const [isResetting, setIsResetting] = useState(false)

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        email: profile.email || '',
        phone: profile.phone || '',
      })
    }
  }, [profile])

  const handleSave = async (e) => {
    e.preventDefault()
    setIsSaving(true)
    try {
      await updateProfileData(formData)
      toast.success('Profile updated successfully!')
    } catch (err) {
      toast.error('Failed to save profile changes.')
    } finally {
      setIsSaving(false)
    }
  }

  const handlePasswordReset = async () => {
    if (!profile?.email) return
    setIsResetting(true)
    try {
      await sendPasswordReset(profile.email)
      toast.success(`Password reset email sent to ${profile.email}`)
    } catch (err) {
      toast.error('Could not send password reset email.')
    } finally {
      setIsResetting(false)
    }
  }

  const initials = (profile?.name || 'Customer')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <div>
      <div className="cust-header" style={{ marginBottom: '2.5rem' }}>
        <div>
          <h1>Profile & Account</h1>
          <p>Manage your contact details and account security.</p>
        </div>
      </div>

      <div className="profile-grid">
        {/* AVATAR COLUMN */}
        <div className="profile-card-side">
          <div className="profile-avatar-large">{initials}</div>
          <h2>{profile?.name || 'Customer'}</h2>
          <p>{profile?.email || 'customer@example.com'}</p>
          <StatusBadge status={profile?.role === 'admin' ? 'confirmed' : 'available'} label={profile?.role?.toUpperCase() || 'CUSTOMER'} />
        </div>

        {/* DETAILS FORM */}
        <div className="profile-form-card">
          <h2>Personal Information</h2>
          <form onSubmit={handleSave} style={{ display: 'grid', gap: '1.25rem' }}>
            <Input
              label="Full Name"
              name="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <Input
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              disabled
              helpText="Email address is associated with your account login."
            />
            <Input
              label="Phone Number"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+94 77 123 4567"
            />

            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', flexWrap: 'wrap' }}>
              <Button type="submit" variant="primary" disabled={isSaving}>
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={handlePasswordReset}
                disabled={isResetting}
              >
                {isResetting ? 'Sending...' : 'Change Password'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

// HELPER ITEM ROW FOR BOOKING LISTS
function BookingRowItem({ booking, showCancelButton, onCancelRequest }) {
  const [y, m, d] = (booking.date || '2026-10-10').split('-')
  const dateObj = new Date(Number(y), Number(m) - 1, Number(d))
  const dayStr = dateObj.getDate()
  const monthStr = dateObj.toLocaleDateString('en-US', { month: 'short' })

  return (
    <article className="booking-item-card">
      <div className="booking-item-left">
        <div className="booking-date-block">
          <span className="day">{dayStr}</span>
          <span className="month">{monthStr}</span>
        </div>
        <div className="booking-item-details">
          <strong>
            {STADIUM.name} · {booking.id}
          </strong>
          <span>
            {formatDateLabel(booking.date)} • {formatSlotLabel(booking.startTime)} –{' '}
            {formatSlotLabel(booking.endTime)} ({booking.duration} {booking.duration === 1 ? 'Hour' : 'Hours'})
          </span>
        </div>
      </div>

      <div className="booking-item-right">
        <span className="booking-price">{formatLkr(booking.totalPrice)}</span>
        <StatusBadge status={booking.status} />
        {showCancelButton && (
          <button
            type="button"
            className="btn btn--ghost btn--sm"
            style={{ color: 'var(--color-danger)' }}
            onClick={onCancelRequest}
          >
            Cancel
          </button>
        )}
      </div>
    </article>
  )
}
