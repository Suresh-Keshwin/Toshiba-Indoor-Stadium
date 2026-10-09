export default function StatusBadge({ status }) {
  const map = {
    confirmed: { label: 'Confirmed', className: 'badge--success' },
    upcoming: { label: 'Upcoming', className: 'badge--success' },
    completed: { label: 'Completed', className: 'badge--muted' },
    cancelled: { label: 'Cancelled', className: 'badge--danger' },
    available: { label: 'Available', className: 'badge--primary' },
    booked: { label: 'Booked', className: 'badge--muted' },
    blocked: { label: 'Blocked', className: 'badge--danger' },
    published: { label: 'Published', className: 'badge--success' },
    draft: { label: 'Draft', className: 'badge--muted' },
  }

  const item = map[status] || { label: status, className: 'badge--muted' }

  return <span className={`badge ${item.className}`}>{item.label}</span>
}
