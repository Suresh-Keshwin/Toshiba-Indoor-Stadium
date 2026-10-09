import { useState } from 'react'
import { Link } from 'react-router-dom'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'
import stadiumHero from '../../assets/stadium-hero.jpg'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import './AuthPages.css'

export default function ForgotPasswordPage() {
  const { sendPasswordReset } = useAuth()
  const toast = useToast()

  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await sendPasswordReset(email)
      setSent(true)
      toast.success('Password reset link sent! Check your inbox.')
    } catch (err) {
      console.error(err)
      setError(err.message || 'Could not send reset link. Please check your email address.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-layout">
      {/* LEFT: VISUAL */}
      <aside className="auth-layout__visual">
        <img src={stadiumHero} alt="Toshiba Indoor Stadium" />
        <div className="auth-layout__brand-tag">
          <span>T</span>
          <strong>TOSHIBA INDOOR STADIUM</strong>
        </div>
        <div className="auth-layout__copy">
          <h2>Your time, beautifully organised.</h2>
          <p>Book, manage and revisit every stadium session from one private account.</p>
        </div>
      </aside>

      {/* RIGHT: FORM */}
      <section className="auth-layout__form">
        <div className="auth-layout__top">
          <Link to="/">← Back to home</Link>
          <Link to="/login">Back to login</Link>
        </div>

        <h1>Reset your password</h1>
        <p className="auth-layout__lead">
          Enter the email linked to your account and we’ll send a secure reset link.
        </p>

        {sent ? (
          <div className="auth-info" style={{ marginTop: '1rem', lineHeight: '1.6' }}>
            <strong>Reset link dispatched</strong>
            <p style={{ margin: '0.5rem 0 0', fontSize: '0.88rem' }}>
              We have sent password reset instructions to <strong>{email}</strong>. Please check your inbox and spam folder.
            </p>
            <div style={{ marginTop: '1.5rem' }}>
              <Link to="/login" className="btn btn--secondary btn--sm">
                Return to Login
              </Link>
            </div>
          </div>
        ) : (
          <form className="auth-form" onSubmit={handleSubmit}>
            {error && <div className="auth-error">{error}</div>}

            <Input
              label="Email Address"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              required
            />

            <Button type="submit" variant="primary" size="lg" fullWidth disabled={loading}>
              {loading ? 'Sending Link...' : 'Send Reset Link →'}
            </Button>
          </form>
        )}
      </section>
    </div>
  )
}
