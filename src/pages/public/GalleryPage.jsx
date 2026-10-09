import { useState } from 'react'
import stadiumHero from '../../assets/stadium-hero.jpg'
import stadium1 from '../../assets/stadium-1.jpg'
import stadium2 from '../../assets/stadium-2.jpg'
import Button from '../../components/common/Button'
import Modal from '../../components/common/Modal'
import './GalleryPage.css'

export default function GalleryPage() {
  const [activeFilter, setActiveFilter] = useState('all')
  const [activeImage, setActiveImage] = useState(null)

  const galleryItems = [
    {
      id: 1,
      src: stadiumHero,
      title: 'Main Multi-Purpose Court',
      category: 'court',
      desc: 'FIFA-grade artificial turf with high-lux overhead sports lighting and perimeter nets.',
    },
    {
      id: 2,
      src: stadium1,
      title: 'Wide Angle Playing Arena',
      category: 'court',
      desc: 'Spacious 14,000 sq ft enclosed hall suitable for multiple sports and squad workouts.',
    },
    {
      id: 3,
      src: stadium2,
      title: 'Goalposts & Perimeter Boards',
      category: 'facilities',
      desc: 'Heavy-duty rebound boards and tournament specification goals for seamless gameplay.',
    },
    {
      id: 4,
      src: stadiumHero,
      title: 'Evening Session Lighting',
      category: 'lighting',
      desc: 'Glare-free LED floodlights providing crisp illumination for evening & night games.',
    },
    {
      id: 5,
      src: stadium1,
      title: 'Spectator & Team Benches',
      category: 'facilities',
      desc: 'Side-court spectator area and sheltered team dugout seating for players and subs.',
    },
    {
      id: 6,
      src: stadium2,
      title: 'Clean Court Surface Detail',
      category: 'court',
      desc: 'Shock-absorbing underlayment designed to minimize joint impact during fast-paced play.',
    },
  ]

  const filteredItems =
    activeFilter === 'all'
      ? galleryItems
      : galleryItems.filter((item) => item.category === activeFilter)

  return (
    <div className="gallery-page">
      <div className="container">
        <div className="gallery-header">
          <p className="section-label">PHOTO SHOWCASE</p>
          <h1>Inside Toshiba Indoor Stadium</h1>
          <p>
            Explore our state-of-the-art multi-purpose indoor arena in Katugastota, Kandy. Built for
            performance, safety, and an exceptional player experience.
          </p>

          <div className="gallery-filters">
            {[
              { id: 'all', label: 'All Photos' },
              { id: 'court', label: 'Turf Court' },
              { id: 'facilities', label: 'Facilities' },
              { id: 'lighting', label: 'Lighting' },
            ].map((f) => (
              <button
                key={f.id}
                type="button"
                className={`gallery-filter-btn${activeFilter === f.id ? ' is-active' : ''}`}
                onClick={() => setActiveFilter(f.id)}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div className="gallery-grid">
          {filteredItems.map((item) => (
            <article
              key={item.id}
              className="gallery-card"
              onClick={() => setActiveImage(item)}
            >
              <div className="gallery-card__thumb">
                <img src={item.src} alt={item.title} loading="lazy" />
                <span className="gallery-card__tag">{item.category.toUpperCase()}</span>
              </div>
              <div className="gallery-card__body">
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            </article>
          ))}
        </div>

        <div className="gallery-cta card">
          <div>
            <h3>Want to experience the court in person?</h3>
            <p>Book a 1-hour or 2-hour session online and reserve your game time now.</p>
          </div>
          <Button to="/book" variant="primary" size="lg">
            Book Now →
          </Button>
        </div>
      </div>

      {activeImage && (
        <Modal
          title={activeImage.title}
          isOpen={Boolean(activeImage)}
          onClose={() => setActiveImage(null)}
        >
          <img
            src={activeImage.src}
            alt={activeImage.title}
            style={{ width: '100%', borderRadius: '12px', maxHeight: '65vh', objectFit: 'cover' }}
          />
          <p style={{ marginTop: '1rem', color: 'var(--color-text-muted)' }}>{activeImage.desc}</p>
        </Modal>
      )}
    </div>
  )
}
