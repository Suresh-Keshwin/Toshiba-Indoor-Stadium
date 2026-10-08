import Button from './Button'

export default function EmptyState({
  title = 'Nothing here yet',
  description,
  actionLabel,
  actionTo,
}) {
  return (
    <div className="empty-state">
      <h3>{title}</h3>
      {description ? <p>{description}</p> : null}
      {actionLabel && actionTo ? (
        <div style={{ marginTop: '1.25rem' }}>
          <Button to={actionTo}>{actionLabel}</Button>
        </div>
      ) : null}
    </div>
  )
}
