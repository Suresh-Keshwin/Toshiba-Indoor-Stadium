import Button from '../components/common/Button'

export default function NotFoundPage() {
  return (
    <div className="container page-header" style={{ textAlign: 'center', paddingTop: '5rem' }}>
      <p className="section-label">404</p>
      <h1>Page not found</h1>
      <p>The page you are looking for is unavailable or has moved.</p>
      <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
        <Button to="/">Back to Home</Button>
        <Button to="/book" variant="secondary">
          Book Now
        </Button>
      </div>
    </div>
  )
}
