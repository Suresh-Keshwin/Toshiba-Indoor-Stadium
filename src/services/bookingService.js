import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  query,
  where,
  runTransaction,
} from 'firebase/firestore'
import { db, isFirebaseConfigured } from '../config/firebase'
import { addHoursToTime, hasBookingConflict } from '../utils/booking'
import { PRICING } from '../utils/constants'

// Local storage key for persistent demo bookings and notifications
const LOCAL_BOOKINGS_KEY = 'tis_stored_bookings'
const LOCAL_NOTIFS_KEY = 'tis_stored_notifications'
const LOCAL_BLOCKED_KEY = 'tis_stored_blocked_slots'

// Initial seed bookings for evaluation demo
const INITIAL_DEMO_BOOKINGS = [
  {
    id: 'TIS-1010-6PM',
    userId: 'demo-customer-101',
    customerName: 'Suresh Keshwin',
    customerEmail: 'suresh.keshwin@gmail.com',
    customerPhone: '+94 77 123 4567',
    date: '2026-10-10',
    startTime: '18:00',
    endTime: '20:00',
    duration: 2,
    totalPrice: 5500,
    status: 'confirmed',
    createdAt: '2026-10-01T10:00:00Z',
  },
  {
    id: 'TIS-0924-4PM',
    userId: 'demo-customer-101',
    customerName: 'Suresh Keshwin',
    customerEmail: 'suresh.keshwin@gmail.com',
    customerPhone: '+94 77 123 4567',
    date: '2026-09-24',
    startTime: '16:00',
    endTime: '18:00',
    duration: 2,
    totalPrice: 5500,
    status: 'completed',
    createdAt: '2026-09-20T14:30:00Z',
  },
  {
    id: 'TIS-0915-7PM',
    userId: 'demo-customer-101',
    customerName: 'Suresh Keshwin',
    customerEmail: 'suresh.keshwin@gmail.com',
    customerPhone: '+94 77 123 4567',
    date: '2026-09-15',
    startTime: '19:00',
    endTime: '20:00',
    duration: 1,
    totalPrice: 2750,
    status: 'completed',
    createdAt: '2026-09-10T12:00:00Z',
  },
  {
    id: 'TIS-0902-8PM',
    userId: 'demo-customer-101',
    customerName: 'Suresh Keshwin',
    customerEmail: 'suresh.keshwin@gmail.com',
    customerPhone: '+94 77 123 4567',
    date: '2026-09-02',
    startTime: '20:00',
    endTime: '21:00',
    duration: 1,
    totalPrice: 2750,
    status: 'cancelled',
    createdAt: '2026-08-28T09:00:00Z',
  },
]

export function getLocalBookings() {
  const data = localStorage.getItem(LOCAL_BOOKINGS_KEY)
  if (!data) {
    localStorage.setItem(LOCAL_BOOKINGS_KEY, JSON.stringify(INITIAL_DEMO_BOOKINGS))
    return INITIAL_DEMO_BOOKINGS
  }
  try {
    return JSON.parse(data)
  } catch {
    return INITIAL_DEMO_BOOKINGS
  }
}

export function saveLocalBookings(bookings) {
  localStorage.setItem(LOCAL_BOOKINGS_KEY, JSON.stringify(bookings))
}

export function getLocalBlockedSlots() {
  const data = localStorage.getItem(LOCAL_BLOCKED_KEY)
  if (!data) return []
  try {
    return JSON.parse(data)
  } catch {
    return []
  }
}

export function saveLocalBlockedSlots(slots) {
  localStorage.setItem(LOCAL_BLOCKED_KEY, JSON.stringify(slots))
}

// Generate unique booking reference like TIS-1010-6PM
export function generateBookingReference(date, startTime) {
  const [y, m, d] = date.split('-')
  const [h] = startTime.split(':').map(Number)
  const period = h >= 12 ? 'PM' : 'AM'
  const hour12 = h % 12 === 0 ? 12 : h % 12
  const rand = Math.floor(100 + Math.random() * 900)
  return `TIS-${m}${d}-${hour12}${period}-${rand}`
}

/**
 * Validate availability and prevent double booking
 */
export async function checkSlotAvailability(date, startTime, durationHours) {
  const duration = Number(durationHours)
  const endTime = addHoursToTime(startTime, duration)

  let bookings = []
  let blockedSlots = []

  if (isFirebaseConfigured && db) {
    try {
      const q = query(collection(db, 'bookings'), where('date', '==', date))
      const snapshot = await getDocs(q)
      bookings = snapshot.docs.map((docSnap) => docSnap.data())

      const bq = query(collection(db, 'blockedSlots'), where('date', '==', date))
      const bSnapshot = await getDocs(bq)
      blockedSlots = bSnapshot.docs.map((docSnap) => docSnap.data())
    } catch (err) {
      console.warn('Firestore fetch failed, checking local state:', err)
      bookings = getLocalBookings().filter((b) => b.date === date)
      blockedSlots = getLocalBlockedSlots().filter((b) => b.date === date)
    }
  } else {
    bookings = getLocalBookings().filter((b) => b.date === date)
    blockedSlots = getLocalBlockedSlots().filter((b) => b.date === date)
  }

  const conflict = hasBookingConflict({
    startTime,
    endTime,
    bookings,
    blockedSlots,
  })

  return !conflict
}

/**
 * Create confirmed booking with double-booking prevention and validated pricing
 */
export async function createBooking({
  userId,
  customerName,
  customerEmail,
  customerPhone,
  date,
  startTime,
  durationHours,
}) {
  const duration = Number(durationHours)
  if (duration !== 1 && duration !== 2) {
    throw new Error('Invalid duration. Sessions are 1 Hour or 2 Hours.')
  }

  // Trusted pricing calculation — never trust browser-submitted prices
  const totalPrice = duration === 1 ? PRICING.oneHour : PRICING.twoHours
  const endTime = addHoursToTime(startTime, duration)
  const bookingId = generateBookingReference(date, startTime)

  const bookingData = {
    id: bookingId,
    userId: userId || 'guest',
    customerName,
    customerEmail,
    customerPhone: customerPhone || '',
    date,
    startTime,
    endTime,
    duration,
    totalPrice,
    status: 'confirmed',
    createdAt: new Date().toISOString(),
  }

  // 1. Double-booking check
  const available = await checkSlotAvailability(date, startTime, duration)
  if (!available) {
    throw new Error('This time slot is no longer available. Please choose another time.')
  }

  // 2. Save in Firestore if configured
  if (isFirebaseConfigured && db) {
    try {
      const bookingDocRef = doc(db, 'bookings', bookingId)
      await setDoc(bookingDocRef, bookingData)

      // Add customer notification
      if (userId) {
        const notifDoc = doc(collection(db, 'notifications'))
        await setDoc(notifDoc, {
          userId,
          title: 'Booking Confirmed',
          message: `Your booking ${bookingId} for ${date} at ${startTime} has been secured.`,
          type: 'booking_confirmed',
          read: false,
          createdAt: new Date().toISOString(),
        })
      }
    } catch (err) {
      console.warn('Firestore save fallback to local:', err)
    }
  }

  // Always sync to local storage for instant reactive UI
  const allBookings = getLocalBookings()
  saveLocalBookings([bookingData, ...allBookings])

  // Save notification locally too
  const notifs = JSON.parse(localStorage.getItem(LOCAL_NOTIFS_KEY) || '[]')
  notifs.unshift({
    id: `notif-${Date.now()}`,
    userId: userId || 'guest',
    title: 'Booking Confirmed',
    message: `Your booking #${bookingId} on ${date} (${startTime} - ${endTime}) is confirmed.`,
    type: 'booking_confirmed',
    read: false,
    createdAt: new Date().toISOString(),
  })
  localStorage.setItem(LOCAL_NOTIFS_KEY, JSON.stringify(notifs))

  return bookingData
}

/**
 * Fetch bookings for a specific customer
 */
export async function getCustomerBookings(userId) {
  if (isFirebaseConfigured && db && userId) {
    try {
      const q = query(collection(db, 'bookings'), where('userId', '==', userId))
      const snapshot = await getDocs(q)
      if (!snapshot.empty) {
        return snapshot.docs.map((docSnap) => docSnap.data())
      }
    } catch (err) {
      console.warn('Firestore fetch failed, using local bookings', err)
    }
  }
  const all = getLocalBookings()
  return all.filter((b) => b.userId === userId || !b.userId || userId === 'demo-customer-101')
}

/**
 * Cancel a booking if permitted
 */
export async function cancelBooking(bookingId) {
  let updatedBooking = null
  const all = getLocalBookings()
  const updated = all.map((b) => {
    if (b.id === bookingId) {
      updatedBooking = { ...b, status: 'cancelled' }
      return updatedBooking
    }
    return b
  })
  saveLocalBookings(updated)

  if (isFirebaseConfigured && db) {
    try {
      await setDoc(doc(db, 'bookings', bookingId), { status: 'cancelled' }, { merge: true })
    } catch (err) {
      console.warn('Firestore cancel sync failed:', err)
    }
  }

  return updatedBooking
}

/**
 * Get all bookings for admin
 */
export async function getAllBookings() {
  if (isFirebaseConfigured && db) {
    try {
      const snapshot = await getDocs(collection(db, 'bookings'))
      if (!snapshot.empty) {
        return snapshot.docs.map((d) => d.data())
      }
    } catch (err) {
      console.warn('Firestore admin fetch failed:', err)
    }
  }
  return getLocalBookings()
}
