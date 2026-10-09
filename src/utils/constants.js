export const PRICING = {
  oneHour: 2750,
  twoHours: 5500,
}

export const DURATION_OPTIONS = [
  {
    id: 1,
    hours: 1,
    label: '1 Hour',
    price: PRICING.oneHour,
    description: 'Ideal for focused practice or a quick group session.',
  },
  {
    id: 2,
    hours: 2,
    label: '2 Hours',
    price: PRICING.twoHours,
    description: 'A generous session for groups, training or hosted activities.',
  },
]

export const OPENING_HOUR = 8
export const CLOSING_HOUR = 24

export const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/stadium', label: 'Stadium' },
  { to: '/availability', label: 'Availability' },
  { to: '/pricing', label: 'Pricing' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/contact', label: 'Contact' },
]

export const CUSTOMER_NAV = [
  { to: '/dashboard', label: 'Overview' },
  { to: '/book', label: 'Book Now' },
  { to: '/my-bookings', label: 'My Bookings' },
  { to: '/booking-history', label: 'Booking History' },
  { to: '/notifications', label: 'Notifications' },
  { to: '/profile', label: 'Profile' },
]

export const ADMIN_NAV = [
  { to: '/admin', label: 'Dashboard' },
  { to: '/admin/calendar', label: 'Booking Calendar' },
  { to: '/admin/bookings', label: 'Bookings' },
  { to: '/admin/customers', label: 'Customers' },
  { to: '/admin/availability', label: 'Availability' },
  { to: '/admin/pricing', label: 'Pricing' },
  { to: '/admin/events', label: 'Events' },
  { to: '/admin/announcements', label: 'Announcements' },
  { to: '/admin/reviews', label: 'Reviews' },
  { to: '/admin/settings', label: 'Settings' },
]

export const TIME_SLOTS = [
  '06:00',
  '07:00',
  '08:00',
  '09:00',
  '10:00',
  '11:00',
  '12:00',
  '13:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
  '18:00',
  '19:00',
  '20:00',
  '21:00',
  '22:00',
  '23:00',
]

export const STADIUM = {
  name: 'Toshiba Indoor Stadium',
  shortName: 'Toshiba',
  tagline: 'A premium multi-purpose indoor venue for sports, training, clubs and recreational activities.',
  address: 'Toshiba Indoor Stadium, Kandy Road, Katugastota, Sri Lanka',
  phone: '+94 81 234 5678',
  email: 'bookings@toshibastadium.lk',
  hours: 'Daily 6:00 AM – 12:00 Midnight',
}

export function formatLkr(amount) {
  return `LKR ${Number(amount).toLocaleString('en-LK')}`
}

export function formatSlotLabel(timeStr) {
  if (!timeStr) return ''
  const [h, m] = String(timeStr).split(':').map(Number)
  const period = h >= 12 ? 'PM' : 'AM'
  const hour12 = h % 12 === 0 ? 12 : h % 12
  return `${hour12}:${String(m || 0).padStart(2, '0')} ${period}`
}

export function formatDateLabel(dateStr) {
  if (!dateStr) return ''
  const [y, m, d] = String(dateStr).split('-').map(Number)
  const date = new Date(y, m - 1, d)
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}
