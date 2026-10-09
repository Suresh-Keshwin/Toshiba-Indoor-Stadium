import { useState } from 'react'
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2 } from 'lucide-react'
import Input from '../../components/common/Input'
import Button from '../../components/common/Button'
import { STADIUM } from '../../utils/constants'
import { useToast } from '../../context/ToastContext'
import './ContactPage.css'

export default function ContactPage() {
  const toast = useToast()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'general',
    message: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setSubmitted(true)
      toast.success('Thank you! Your message has been received. Our team will contact you shortly.')
      setFormData({ name: '', email: '', phone: '', subject: 'general', message: '' })
    }, 600)
  }

  return (
    <div className="contact-page">
      <div className="container">
        <div className="contact-header">
          <p className="section-label">GET IN TOUCH</p>
          <h1>Plan Your Arrival & Contact Us</h1>
          <p>
            Have a question about venue hire, tournament organization, or court availability? Reach out directly
            to our stadium management team in Katugastota, Kandy.
          </p>
        </div>

        <div className="contact-grid">
          {/* LEFT: FORM */}
          <div className="card contact-form-card">
            {submitted ? (
              <div className="contact-success">
                <CheckCircle2 size={54} color="var(--color-primary)" />
                <h3>Message Sent Successfully!</h3>
                <p>We have received your inquiry. One of our venue coordinators will respond via email or phone within 2 hours.</p>
                <Button type="button" variant="secondary" onClick={() => setSubmitted(false)}>
                  Send Another Message
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="contact-form">
                <h3>Send Us an Inquiry</h3>
                <p className="form-sub">Fill out the form below and we will get back to you promptly.</p>

                <Input
                  label="Full Name"
                  name="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Kasun Perera"
                  required
                />

                <div className="form-two-col">
                  <Input
                    label="Email Address"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="name@example.com"
                    required
                  />
                  <Input
                    label="Phone Number"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+94 77 123 4567"
                  />
                </div>

                <label className="field">
                  <span className="field__label">Inquiry Subject</span>
                  <select
                    className="select"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  >
                    <option value="general">General Venue Information</option>
                    <option value="corporate">Corporate or School Tournament</option>
                    <option value="recurring">Recurring Weekly Slot Reservation</option>
                    <option value="feedback">Feedback & Lost Items</option>
                  </select>
                </label>

                <Input
                  label="Your Message"
                  name="message"
                  as="textarea"
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Describe your session requirements or questions..."
                  required
                />

                <Button type="submit" variant="primary" size="lg" fullWidth disabled={loading}>
                  <Send size={16} /> {loading ? 'Sending...' : 'Send Message'}
                </Button>
              </form>
            )}
          </div>

          {/* RIGHT: INFO & MAP */}
          <div className="contact-info-col">
            <div className="card contact-details-card">
              <h3>Stadium Location & Details</h3>
              <ul className="contact-details-list">
                <li>
                  <MapPin className="contact-icon" size={20} />
                  <div>
                    <strong>Address</strong>
                    <span>{STADIUM.address}</span>
                  </div>
                </li>
                <li>
                  <Phone className="contact-icon" size={20} />
                  <div>
                    <strong>Direct Hotline</strong>
                    <a href={`tel:${STADIUM.phone.replace(/\s/g, '')}`}>{STADIUM.phone}</a>
                  </div>
                </li>
                <li>
                  <Mail className="contact-icon" size={20} />
                  <div>
                    <strong>Email Inquiries</strong>
                    <a href={`mailto:${STADIUM.email}`}>{STADIUM.email}</a>
                  </div>
                </li>
                <li>
                  <Clock className="contact-icon" size={20} />
                  <div>
                    <strong>Operating Hours</strong>
                    <span>{STADIUM.hours}</span>
                  </div>
                </li>
              </ul>
            </div>

            {/* MAP CARD */}
            <div className="map-card" style={{ marginTop: '1.5rem' }}>
              <div className="map-card__inner">
                <div className="map-badge">
                  <MapPin size={18} />
                  <span>Toshiba Indoor Stadium · Katugastota</span>
                </div>
                <p className="map-sub">Kandy Road, Katugastota, Sri Lanka</p>
                <div style={{ marginTop: '1rem' }}>
                  <a
                    href={`https://maps.google.com/?q=${encodeURIComponent(STADIUM.address)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn--secondary btn--sm"
                  >
                    Open in Google Maps →
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
