import Button from '../../components/common/Button'

export default function PageStub({
  title,
  description,
  eyebrow,
  actions,
  children,
}) {
  return (
    <div className="container page-header">
      {eyebrow ? <p className="section-label">{eyebrow}</p> : null}
      <h1>{title}</h1>
      {description ? <p>{description}</p> : null}
      {actions ? <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>{actions}</div> : null}
      {children}
    </div>
  )
}

export function ComingSoonNote({ phase }) {
  return (
    <div className="card" style={{ padding: '1.25rem', marginTop: '1.5rem' }}>
      <p style={{ color: 'var(--color-text-muted)' }}>
        This screen is scaffolded in Phase 2. Full UI matching the Figma/Stitch reference will be
        built in {phase}.
      </p>
      <div style={{ marginTop: '1rem' }}>
        <Button to="/">Back to Home</Button>
      </div>
    </div>
  )
}
