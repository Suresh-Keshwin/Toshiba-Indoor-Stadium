export default function Loader({ label = 'Loading…' }) {
  return (
    <div className="loading-state" role="status" aria-live="polite">
      <div className="loader-spinner" aria-hidden="true" />
      <p>{label}</p>
    </div>
  )
}
