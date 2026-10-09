import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  Calendar as CalendarIcon,
  Clock,
  Users,
  DollarSign,
  TrendingUp,
  CheckCircle,
  Lock,
  Unlock,
} from 'lucide-react'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'
import Modal from '../../components/common/Modal'
import StatusBadge from '../../components/common/StatusBadge'
import EmptyState from '../../components/common/EmptyState'
import { useToast } from '../../context/ToastContext'
import {
  formatDateLabel,
  formatSlotLabel,
  formatLkr,
  TIME_SLOTS,
  PRICING,
  STADIUM,
} from '../../utils/constants'
import {
  getAllBookings,
  saveLocalBookings,
  getLocalBlockedSlots,
  saveLocalBlockedSlots,
} from '../../services/bookingService'
import './AdminPages.css'

// 1. ADMIN DASHBOARD PAGE
export function AdminDashboardPage() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const data = await getAllBookings()
      setBookings(data)
      setLoading(false)
    }
    load()
  }, [])

  const todayStr = new Date().toISOString().split('T')[0]
  const todayBookings = bookings.filter((b) => b.date === todayStr && b.status === 'confirmed')
  const upcomingBookings = bookings.filter((b) => b.status === 'confirmed')
  const totalRevenue = bookings
    .filter((b) => b.status !== 'cancelled')
    .reduce((sum, b) => sum + (b.totalPrice || 0), 0)

  // Chart data simulation
  const days = [
    { label: 'Mon', amount: 16500, height: '55%' },
    { label: 'Tue', amount: 22000, height: '70%' },
    { label: 'Wed', amount: 19250, height: '62%' },
    { label: 'Thu', amount: 24750, height: '80%' },
    { label: 'Fri', amount: 33000, height: '95%' },
    { label: 'Sat', amount: 38500, height: '100%' },
    { label: 'Sun', amount: 30250, height: '85%' },
  ]

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1>Stadium Operations Dashboard</h1>
          <p>Real-time booking metrics, venue capacity, and court revenue.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Button to="/admin/bookings" variant="secondary" size="sm">
            Manage Bookings
          </Button>
          <Button to="/admin/availability" variant="primary" size="sm">
            Block Slots
          </Button>
        </div>
      </div>

      {/* 4 KPI CARDS */}
      <div className="admin-kpi-grid">
        <div className="admin-kpi-card">
          <div className="admin-kpi-top">
            <span>Today’s Bookings</span>
            <CalendarIcon size={18} color="var(--color-primary)" />
          </div>
          <div className="admin-kpi-value">{todayBookings.length}</div>
          <div className="admin-kpi-sub">
            <CheckCircle size={14} /> 100% court operational
          </div>
        </div>

        <div className="admin-kpi-card">
          <div className="admin-kpi-top">
            <span>Upcoming Sessions</span>
            <Clock size={18} color="var(--color-primary)" />
          </div>
          <div className="admin-kpi-value">{upcomingBookings.length}</div>
          <div className="admin-kpi-sub">Next 7 days scheduled</div>
        </div>

        <div className="admin-kpi-card">
          <div className="admin-kpi-top">
            <span>Total Customers</span>
            <Users size={18} color="var(--color-primary)" />
          </div>
          <div className="admin-kpi-value">142</div>
          <div className="admin-kpi-sub">+18 this month</div>
        </div>

        <div className="admin-kpi-card">
          <div className="admin-kpi-top">
            <span>Total Booking Revenue</span>
            <DollarSign size={18} color="var(--color-primary)" />
          </div>
          <div className="admin-kpi-value">{formatLkr(totalRevenue)}</div>
          <div className="admin-kpi-sub">
            <TrendingUp size={14} /> Confirmed venue revenue
          </div>
        </div>
      </div>

      {/* TWO COLUMN CONTENT */}
      <div className="admin-two-col">
        {/* RECENT BOOKINGS TABLE */}
        <div className="admin-card">
          <div className="admin-card-head">
            <h2>Recent Bookings</h2>
            <Link to="/admin/bookings" style={{ fontSize: '0.85rem', color: 'var(--color-primary)' }}>
              View All
            </Link>
          </div>
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Customer</th>
                  <th>Date & Time</th>
                  <th>Price</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {bookings.slice(0, 5).map((b) => (
                  <tr key={b.id}>
                    <td>
                      <strong>{b.id}</strong>
                    </td>
                    <td>{b.customerName}</td>
                    <td>
                      {b.date} ({formatSlotLabel(b.startTime)})
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
        </div>

        {/* WEEKLY REVENUE CHART */}
        <div className="admin-card">
          <div className="admin-card-head">
            <h2>Weekly Revenue</h2>
            <span style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>Last 7 Days</span>
          </div>
          <div className="revenue-bars">
            {days.map((d) => (
              <div key={d.label} className="revenue-bar-item">
                <div className="bar-fill" style={{ height: d.height }} title={formatLkr(d.amount)} />
                <span className="bar-label">{d.label}</span>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
            Peak utilization on weekends (Friday – Sunday)
          </div>
        </div>
      </div>
    </div>
  )
}

// 2. ADMIN CALENDAR PAGE
export function AdminCalendarPage() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [bookings, setBookings] = useState([])
  const [blocked, setBlocked] = useState([])

  useEffect(() => {
    async function load() {
      const b = await getAllBookings()
      setBookings(b)
      setBlocked(getLocalBlockedSlots())
    }
    load()
  }, [])

  const currentBookings = bookings.filter((b) => b.date === selectedDate && b.status !== 'cancelled')
  const currentBlocked = blocked.filter((s) => s.date === selectedDate)

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1>Booking Calendar Matrix</h1>
          <p>Inspect hourly slot occupancy across the indoor turf arena.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <label style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>Inspect Date:</label>
          <input
            type="date"
            className="input"
            style={{ width: 'auto' }}
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>
      </div>

      <div className="admin-toolbar">
        <span className="legend-item">
          <i className="status-dot status-dot--available" /> Open (Available)
        </span>
        <span className="legend-item">
          <i className="status-dot status-dot--booked" /> Booked by Customer
        </span>
        <span className="legend-item">
          <i className="status-dot status-dot--selected" /> Maintenance / Blocked
        </span>
      </div>

      <div className="admin-cal-matrix">
        {TIME_SLOTS.map((time) => {
          const booking = currentBookings.find((b) => b.startTime === time)
          const isBlocked = currentBlocked.some((s) => s.startTime === time)

          let state = 'is-available'
          let title = 'Available'
          let sub = 'Open for booking'

          if (booking) {
            state = 'is-booked'
            title = 'Booked'
            sub = booking.customerName
          } else if (isBlocked) {
            state = 'is-blocked'
            title = 'Blocked'
            sub = 'Admin hold / maintenance'
          }

          return (
            <div key={time} className={`cal-slot-item ${state}`}>
              <strong style={{ fontSize: '1rem', display: 'block', color: 'var(--color-charcoal)' }}>
                {formatSlotLabel(time)}
              </strong>
              <div style={{ fontSize: '0.78rem', fontWeight: '600', marginTop: '0.25rem', textTransform: 'uppercase' }}>
                {title}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.2rem' }}>
                {sub}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// 3. ADMIN BOOKINGS PAGE
export function AdminBookingsPage() {
  const toast = useToast()
  const [bookings, setBookings] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [activeModalBooking, setActiveModalBooking] = useState(null)

  useEffect(() => {
    async function load() {
      const data = await getAllBookings()
      setBookings(data)
    }
    load()
  }, [])

  const handleUpdateStatus = (id, newStatus) => {
    const updated = bookings.map((b) => (b.id === id ? { ...b, status: newStatus } : b))
    setBookings(updated)
    saveLocalBookings(updated)
    toast.success(`Booking ${id} updated to ${newStatus}`)
    if (activeModalBooking?.id === id) {
      setActiveModalBooking({ ...activeModalBooking, status: newStatus })
    }
  }

  const filtered = useMemo(() => {
    return bookings.filter((b) => {
      const match =
        !searchQuery ||
        b.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.date.includes(searchQuery)
      const st = statusFilter === 'all' || b.status === statusFilter
      return match && st
    })
  }, [bookings, searchQuery, statusFilter])

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1>Booking Management</h1>
          <p>Search, review, confirm and update player reservations.</p>
        </div>
      </div>

      <div className="admin-toolbar">
        <div style={{ flex: 1, minWidth: '240px' }}>
          <Input
            placeholder="Search by customer name, booking ID or date..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
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

      <div className="admin-card table-container">
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Time</th>
              <th>Duration</th>
              <th>Price</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((b) => (
              <tr key={b.id}>
                <td>
                  <strong>{b.id}</strong>
                </td>
                <td>
                  <div>{b.customerName}</div>
                  <small style={{ color: 'var(--color-text-muted)' }}>{b.customerPhone}</small>
                </td>
                <td>{b.date}</td>
                <td>{formatSlotLabel(b.startTime)}</td>
                <td>{b.duration} {b.duration === 1 ? 'Hour' : 'Hours'}</td>
                <td>{formatLkr(b.totalPrice)}</td>
                <td>
                  <StatusBadge status={b.status} />
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '0.4rem' }}>
                    <button
                      type="button"
                      className="btn btn--secondary btn--sm"
                      onClick={() => setActiveModalBooking(b)}
                    >
                      View
                    </button>
                    {b.status === 'confirmed' && (
                      <button
                        type="button"
                        className="btn btn--primary btn--sm"
                        onClick={() => handleUpdateStatus(b.id, 'completed')}
                      >
                        Complete
                      </button>
                    )}
                    {b.status !== 'cancelled' && (
                      <button
                        type="button"
                        className="btn btn--ghost btn--sm"
                        style={{ color: 'var(--color-danger)' }}
                        onClick={() => handleUpdateStatus(b.id, 'cancelled')}
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {activeModalBooking && (
        <Modal
          title={`Booking Details: ${activeModalBooking.id}`}
          isOpen={Boolean(activeModalBooking)}
          onClose={() => setActiveModalBooking(null)}
        >
          <div style={{ display: 'grid', gap: '1rem' }}>
            <ul className="success-details-list" style={{ margin: 0 }}>
              <li>
                <span>Customer</span>
                <strong>{activeModalBooking.customerName}</strong>
              </li>
              <li>
                <span>Email</span>
                <strong>{activeModalBooking.customerEmail}</strong>
              </li>
              <li>
                <span>Phone</span>
                <strong>{activeModalBooking.customerPhone || '—'}</strong>
              </li>
              <li>
                <span>Date</span>
                <strong>{formatDateLabel(activeModalBooking.date)}</strong>
              </li>
              <li>
                <span>Time Slot</span>
                <strong>
                  {formatSlotLabel(activeModalBooking.startTime)} – {formatSlotLabel(activeModalBooking.endTime)}
                </strong>
              </li>
              <li>
                <span>Duration</span>
                <strong>{activeModalBooking.duration} Hours</strong>
              </li>
              <li>
                <span>Fee</span>
                <strong>{formatLkr(activeModalBooking.totalPrice)}</strong>
              </li>
              <li>
                <span>Status</span>
                <StatusBadge status={activeModalBooking.status} />
              </li>
            </ul>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1rem' }}>
              {activeModalBooking.status !== 'confirmed' && (
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => handleUpdateStatus(activeModalBooking.id, 'confirmed')}
                >
                  Set as Confirmed
                </Button>
              )}
              {activeModalBooking.status !== 'cancelled' && (
                <button
                  type="button"
                  className="btn btn--ghost btn--sm"
                  style={{ color: 'var(--color-danger)' }}
                  onClick={() => handleUpdateStatus(activeModalBooking.id, 'cancelled')}
                >
                  Cancel Booking
                </button>
              )}
              <Button type="button" variant="primary" size="sm" onClick={() => setActiveModalBooking(null)}>
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}

// 4. ADMIN CUSTOMERS PAGE
export function AdminCustomersPage() {
  const customers = [
    {
      id: 'cust-1',
      name: 'Suresh Keshwin',
      email: 'suresh.keshwin@gmail.com',
      phone: '+94 77 123 4567',
      totalBookings: 8,
      status: 'Active',
      joined: '2026-08-15',
    },
    {
      id: 'cust-2',
      name: 'Kasun Perera',
      email: 'kasun.perera@gmail.com',
      phone: '+94 71 456 7890',
      totalBookings: 14,
      status: 'Active',
      joined: '2026-07-22',
    },
    {
      id: 'cust-3',
      name: 'Dinuka Silva',
      email: 'dinuka.silva@yahoo.com',
      phone: '+94 78 890 1234',
      totalBookings: 6,
      status: 'Active',
      joined: '2026-09-01',
    },
    {
      id: 'cust-4',
      name: 'Mohamed Rizvi',
      email: 'm.rizvi@outlook.com',
      phone: '+94 72 345 6789',
      totalBookings: 11,
      status: 'Active',
      joined: '2026-06-10',
    },
  ]

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1>Customer Management</h1>
          <p>View registered stadium players, session frequency, and account status.</p>
        </div>
      </div>

      <div className="admin-card table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Customer Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Total Bookings</th>
              <th>Member Since</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c) => (
              <tr key={c.id}>
                <td>
                  <strong>{c.name}</strong>
                </td>
                <td>{c.email}</td>
                <td>{c.phone}</td>
                <td>
                  <strong>{c.totalBookings} sessions</strong>
                </td>
                <td>{c.joined}</td>
                <td>
                  <span className="badge badge--success">{c.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// 5. ADMIN AVAILABILITY & BLOCKING PAGE
export function AdminAvailabilityPage() {
  const toast = useToast()
  const [blocked, setBlocked] = useState(() => getLocalBlockedSlots())
  const [newBlock, setNewBlock] = useState({
    date: new Date().toISOString().split('T')[0],
    startTime: '10:00',
    endTime: '12:00',
    reason: 'Routine turf maintenance',
  })

  const handleAddBlock = (e) => {
    e.preventDefault()
    const updated = [
      ...blocked,
      { ...newBlock, id: `blk-${Date.now()}`, createdAt: new Date().toISOString() },
    ]
    setBlocked(updated)
    saveLocalBlockedSlots(updated)
    toast.success(`Slot on ${newBlock.date} at ${newBlock.startTime} blocked successfully.`)
  }

  const handleRemoveBlock = (id) => {
    const updated = blocked.filter((b) => b.id !== id)
    setBlocked(updated)
    saveLocalBlockedSlots(updated)
    toast.success('Block removed. Time slot opened for booking.')
  }

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1>Availability & Slot Blocking</h1>
          <p>Block court times for maintenance or private events to prevent customer booking.</p>
        </div>
      </div>

      <div className="admin-two-col">
        {/* CREATE BLOCK FORM */}
        <div className="admin-card">
          <div className="admin-card-head">
            <h2>Block Date / Time</h2>
          </div>
          <form onSubmit={handleAddBlock} style={{ display: 'grid', gap: '1.25rem' }}>
            <Input
              label="Date"
              type="date"
              value={newBlock.date}
              onChange={(e) => setNewBlock({ ...newBlock, date: e.target.value })}
              required
            />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <label className="field">
                <span className="field__label">Start Time</span>
                <select
                  className="select"
                  value={newBlock.startTime}
                  onChange={(e) => setNewBlock({ ...newBlock, startTime: e.target.value })}
                >
                  {TIME_SLOTS.map((t) => (
                    <option key={t} value={t}>
                      {formatSlotLabel(t)}
                    </option>
                  ))}
                </select>
              </label>
              <label className="field">
                <span className="field__label">End Time</span>
                <select
                  className="select"
                  value={newBlock.endTime}
                  onChange={(e) => setNewBlock({ ...newBlock, endTime: e.target.value })}
                >
                  {TIME_SLOTS.map((t) => (
                    <option key={t} value={t}>
                      {formatSlotLabel(t)}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <Input
              label="Reason for Hold"
              value={newBlock.reason}
              onChange={(e) => setNewBlock({ ...newBlock, reason: e.target.value })}
              placeholder="e.g. Turf deep grooming, floodlight bulb replacement"
              required
            />
            <Button type="submit" variant="primary">
              <Lock size={16} /> Block Time Slot
            </Button>
          </form>
        </div>

        {/* CURRENT BLOCKED SLOTS */}
        <div className="admin-card">
          <div className="admin-card-head">
            <h2>Active Blocked Slots</h2>
          </div>
          {blocked.length === 0 ? (
            <EmptyState title="No active holds" description="All hours are currently open according to calendar schedule." />
          ) : (
            <div style={{ display: 'grid', gap: '0.75rem' }}>
              {blocked.map((b) => (
                <div
                  key={b.id || b.startTime}
                  style={{
                    padding: '1rem',
                    borderRadius: '8px',
                    border: '1px solid #fae4a7',
                    background: '#fcfaf2',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div>
                    <strong>{formatDateLabel(b.date)}</strong>
                    <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                      {formatSlotLabel(b.startTime)} – {formatSlotLabel(b.endTime)} • {b.reason}
                    </div>
                  </div>
                  <button
                    type="button"
                    className="btn btn--ghost btn--sm"
                    style={{ color: 'var(--color-danger)' }}
                    onClick={() => handleRemoveBlock(b.id)}
                  >
                    <Unlock size={16} /> Unblock
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// 6. ADMIN PRICING MANAGEMENT
export function AdminPricingPage() {
  const toast = useToast()
  const [rates, setRates] = useState({
    oneHour: PRICING.oneHour,
    twoHours: PRICING.twoHours,
  })

  const handleSavePricing = (e) => {
    e.preventDefault()
    PRICING.oneHour = Number(rates.oneHour)
    PRICING.twoHours = Number(rates.twoHours)
    toast.success('Stadium rates updated in system!')
  }

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1>Pricing Management</h1>
          <p>Configure authorized session prices. All bookings validate against these system rates.</p>
        </div>
      </div>

      <div className="admin-card" style={{ maxWidth: '600px' }}>
        <form onSubmit={handleSavePricing} style={{ display: 'grid', gap: '1.5rem' }}>
          <Input
            label="1 Hour Rate (LKR)"
            type="number"
            value={rates.oneHour}
            onChange={(e) => setRates({ ...rates, oneHour: e.target.value })}
            required
            helpText="Official fee for 60-minute standard bookings (currently LKR 2,750)."
          />
          <Input
            label="2 Hours Rate (LKR)"
            type="number"
            value={rates.twoHours}
            onChange={(e) => setRates({ ...rates, twoHours: e.target.value })}
            required
            helpText="Official fee for 120-minute extended session (currently LKR 5,500)."
          />

          <Button type="submit" variant="primary">
            Save Pricing Updates
          </Button>
        </form>
      </div>
    </div>
  )
}

// 7. ADMIN EVENTS PAGE
export function AdminEventsPage() {
  const toast = useToast()
  const [events, setEvents] = useState([
    {
      id: 1,
      title: 'Kandy Inter-Club Futsal Championship',
      date: '2026-10-24',
      status: 'Published',
      desc: '16-team tournament across Saturday afternoon.',
    },
    {
      id: 2,
      title: 'Youth Sports Academy Open Day',
      date: '2026-11-05',
      status: 'Published',
      desc: 'Free coaching clinic and trials for under-17s.',
    },
  ])

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1>Stadium Events</h1>
          <p>Organize, schedule and publish tournaments and community events.</p>
        </div>
      </div>

      <div className="admin-card table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Event Title</th>
              <th>Date</th>
              <th>Description</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {events.map((e) => (
              <tr key={e.id}>
                <td>
                  <strong>{e.title}</strong>
                </td>
                <td>{formatDateLabel(e.date)}</td>
                <td>{e.desc}</td>
                <td>
                  <span className="badge badge--success">{e.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// 8. ADMIN ANNOUNCEMENTS PAGE
export function AdminAnnouncementsPage() {
  const toast = useToast()
  const [announcements, setAnnouncements] = useState([
    {
      id: 1,
      title: 'Extended Weekend Opening Hours',
      type: 'Announcement',
      date: '2026-10-10',
      status: 'Published',
    },
    {
      id: 2,
      title: 'Community Open Evening Session',
      type: 'Event',
      date: '2026-10-18',
      status: 'Published',
    },
  ])

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1>Announcements & Notices</h1>
          <p>Publish news, maintenance alerts and promotional offers visible to public visitors.</p>
        </div>
      </div>

      <div className="admin-card table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {announcements.map((a) => (
              <tr key={a.id}>
                <td>
                  <strong>{a.title}</strong>
                </td>
                <td>
                  <span className="badge badge--neutral">{a.type}</span>
                </td>
                <td>{a.date}</td>
                <td>
                  <span className="badge badge--success">{a.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// 9. ADMIN REVIEWS PAGE
export function AdminReviewsPage() {
  const toast = useToast()
  const [reviews, setReviews] = useState([
    {
      id: 1,
      customer: 'Kasun Perera',
      rating: 5,
      comment: 'The online booking was clear, and the venue looked exactly as shown.',
      approved: true,
    },
    {
      id: 2,
      customer: 'Dinuka Silva',
      rating: 5,
      comment: 'Bright, clean and easy to access. The reminders made organizing simple.',
      approved: true,
    },
    {
      id: 3,
      customer: 'Mohamed Rizvi',
      rating: 5,
      comment: 'A polished venue and very helpful communication. Will definitely return.',
      approved: true,
    },
  ])

  const toggleApproval = (id) => {
    setReviews((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          const next = !r.approved
          toast.success(`Review ${next ? 'approved and published' : 'hidden from public view'}`)
          return { ...r, approved: next }
        }
        return r
      }),
    )
  }

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1>Guest Reviews Moderation</h1>
          <p>Review customer ratings and approve feedback for public website display.</p>
        </div>
      </div>

      <div className="admin-card table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Customer</th>
              <th>Rating</th>
              <th>Comment</th>
              <th>Public Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {reviews.map((r) => (
              <tr key={r.id}>
                <td>
                  <strong>{r.customer}</strong>
                </td>
                <td style={{ color: 'var(--color-star)' }}>{'★'.repeat(r.rating)}</td>
                <td>“{r.comment}”</td>
                <td>
                  <span className={`badge badge--${r.approved ? 'success' : 'neutral'}`}>
                    {r.approved ? 'Approved' : 'Hidden'}
                  </span>
                </td>
                <td>
                  <Button
                    type="button"
                    variant={r.approved ? 'ghost' : 'secondary'}
                    size="sm"
                    onClick={() => toggleApproval(r.id)}
                  >
                    {r.approved ? 'Hide' : 'Approve'}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// 10. ADMIN SETTINGS PAGE
export function AdminSettingsPage() {
  const toast = useToast()
  const [settings, setSettings] = useState({
    stadiumName: STADIUM.name,
    address: STADIUM.address,
    phone: STADIUM.phone,
    email: STADIUM.email,
    hours: STADIUM.hours,
  })

  const handleSave = (e) => {
    e.preventDefault()
    STADIUM.name = settings.stadiumName
    STADIUM.address = settings.address
    STADIUM.phone = settings.phone
    STADIUM.email = settings.email
    STADIUM.hours = settings.hours
    toast.success('Stadium settings updated successfully.')
  }

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1>Stadium Configuration & Settings</h1>
          <p>Manage venue contact details, opening times, and system operating parameters.</p>
        </div>
      </div>

      <div className="admin-card" style={{ maxWidth: '640px' }}>
        <form onSubmit={handleSave} style={{ display: 'grid', gap: '1.25rem' }}>
          <Input
            label="Stadium Name"
            value={settings.stadiumName}
            onChange={(e) => setSettings({ ...settings, stadiumName: e.target.value })}
            required
          />
          <Input
            label="Location Address"
            value={settings.address}
            onChange={(e) => setSettings({ ...settings, address: e.target.value })}
            required
          />
          <Input
            label="Desk Contact Hotline"
            value={settings.phone}
            onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
            required
          />
          <Input
            label="Booking Support Email"
            value={settings.email}
            onChange={(e) => setSettings({ ...settings, email: e.target.value })}
            required
          />
          <Input
            label="Operating Hours"
            value={settings.hours}
            onChange={(e) => setSettings({ ...settings, hours: e.target.value })}
            required
          />

          <Button type="submit" variant="primary">
            Save Settings
          </Button>
        </form>
      </div>
    </div>
  )
}
