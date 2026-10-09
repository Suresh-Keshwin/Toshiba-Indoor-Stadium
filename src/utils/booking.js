/**
 * Booking overlap helpers
 * Pure utilities — safe to unit-test without Firebase.
 */

/** Convert "HH:MM" (24h) to minutes from midnight */
export function timeToMinutes(time) {
  const [hours, minutes] = String(time).split(':').map(Number)
  return hours * 60 + minutes
}

/** True when [startA, endA) overlaps [startB, endB) */
export function intervalsOverlap(startA, endA, startB, endB) {
  return startA < endB && startB < endA
}

/**
 * Returns true if the requested booking overlaps any existing booking
 * or blocked slot on the same date.
 */
export function hasBookingConflict({
  startTime,
  endTime,
  bookings = [],
  blockedSlots = [],
}) {
  const start = timeToMinutes(startTime)
  const end = timeToMinutes(endTime)

  const activeBookings = bookings.filter(
    (booking) => booking.status === 'confirmed' || booking.status === 'completed',
  )

  for (const booking of activeBookings) {
    if (
      intervalsOverlap(
        start,
        end,
        timeToMinutes(booking.startTime),
        timeToMinutes(booking.endTime),
      )
    ) {
      return true
    }
  }

  for (const slot of blockedSlots) {
    if (
      intervalsOverlap(
        start,
        end,
        timeToMinutes(slot.startTime),
        timeToMinutes(slot.endTime),
      )
    ) {
      return true
    }
  }

  return false
}

export function addHoursToTime(startTime, hours) {
  const total = timeToMinutes(startTime) + hours * 60
  const h = Math.floor(total / 60) % 24
  const m = total % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}
