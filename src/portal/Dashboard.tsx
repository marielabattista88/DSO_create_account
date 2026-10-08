/**
 * Portal home — where "Go to NationsDental Portal" lands.
 * Static prototype: numbers and businesses are sample data.
 */

import { useNavigate } from 'react-router-dom'
import { PortalNav } from './PortalNav'
import { PageHeader, AddBusinessButton } from './PageHeader'
import { useEnrollment } from '../enrollment/data/store'
import './Dashboard.css'

const STATS = [
  { label: 'Ative', value: 3, tone: 'green' },
  { label: 'Under Review', value: 0, tone: 'purple' },
  { label: 'Rejected', value: 0, tone: 'red' },
  { label: 'Pending Information', value: 15, tone: 'orange' },
  { label: 'Inactive', value: 0, tone: 'grey' },
]

const ACTIONS = [
  { name: 'Sunrise Dental Partners LLC', note: 'Bank account not linked — payments blocked', tone: 'red' },
  { name: 'Great Lakes Dental Corp', note: 'Hours of operation not set for 3 locations', tone: 'orange' },
  { name: 'Bright Smile Dental Group', note: 'No providers linked to 2 service locations', tone: 'orange' },
]

const BUILDING = 'M4 21V8l6-4v17M10 21V10h10v11M3 21h18M13 13h4M13 17h4'

function formatToday() {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

function BuildingIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={BUILDING} />
    </svg>
  )
}

const ACTIVE_STATS = [
  { label: 'Ative', value: 3, tone: 'green' },
  { label: 'Under Review', value: 2, tone: 'purple' },
  { label: 'Rejected', value: 0, tone: 'red' },
  { label: 'Inactive', value: 0, tone: 'grey' },
]

const ACTIVE_ACTIONS = [
  { name: 'Sunrise Dental Partners LLC', note: 'Missing bank information — approval blocked', tone: 'red' },
  { name: 'Jim Halpert', note: 'Invite pending — sent 3 days ago', tone: 'orange' },
]

const ACTIVITY = [
  { title: 'Business info updated', note: 'Great Lakes Dental Corp · by Angela Martin', date: 'May 2, 2026', icon: 'M4 20h4L18 10l-4-4L4 16v4M13 7l4 4' },
  { title: 'New user invited', note: 'Jim Halpert · by Sarah Johnson', date: 'Apr 15, 2026', icon: 'M12 12a4 4 0 100-8 4 4 0 000 8M4 21c0-4 4-6 8-6s8 2 8 6' },
  { title: 'Business approved', note: 'Great Lakes Dental Corp · by NB Admin', date: 'May 2, 2026', icon: 'M5 12l5 5 9-10' },
  { title: 'New business added', note: 'Sunrise Dental Partners LLC · by Sarah Johnson', date: 'Apr 15, 2026', icon: BUILDING },
]

function hasSubmitted() {
  try { return JSON.parse(sessionStorage.getItem('submittedBusinesses') ?? '[]').length > 0 } catch { return false }
}

function greeting() {
  const h = new Date().getHours()
  return h < 12 ? 'Good Morning!' : h < 19 ? 'Good Afternoon!' : 'Good Evening!'
}

function ActiveDashboard() {
  const navigate = useNavigate()
  return (
    <div className="dash">
      <PortalNav />
      <main className="dash__main">
        <div className="dash__top">
          <div className="dash__hero">
            <p className="dash__date">{formatToday()}</p>
            <h1 className="dash__title heading-1">{greeting()}</h1>
          </div>
          <AddBusinessButton />
        </div>

        <section className="dash__stats dash__stats--4">
          {ACTIVE_STATS.map((s) => (
            <div key={s.label} className="dash__stat">
              <span className={`dash__stat-label dash__tone--${s.tone}`}>
                <i className="dash__dot" />
                {s.label}
              </span>
              <strong>{s.value}</strong>
              <small>of 5 total</small>
            </div>
          ))}
        </section>

        <div className="dash__panels">
          <section className="dash__panel">
            <div className="dash__panel-head">
              <h3>Action Required</h3>
              <span className="dash__count">{ACTIVE_ACTIONS.length} Items</span>
            </div>
            <ul>
              {ACTIVE_ACTIONS.map((a) => (
                <li key={a.name}>
                  <div className="dash__row">
                    <i className={`dash__bullet dash__bullet--${a.tone}`} />
                    <div>
                      <strong>{a.name}</strong>
                      <small>{a.note}</small>
                    </div>
                    <a href="#/businesses" className="dash__view">View <span aria-hidden="true">›</span></a>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <section className="dash__panel">
            <div className="dash__panel-head">
              <h3>Recent Activity</h3>
              <a href="#/businesses">View All</a>
            </div>
            <ul>
              {ACTIVITY.map((a) => (
                <li key={a.title}>
                  <div className="dash__row">
                    <span className="dash__activity-icon">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={a.icon} /></svg>
                    </span>
                    <div>
                      <strong>{a.title}</strong>
                      <small>{a.note}</small>
                    </div>
                    <time>{a.date}</time>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <section className="dash__panel dash__last">
          <div className="dash__panel-head">
            <h3>Last View</h3>
            <a href="#/businesses">See all business</a>
          </div>
          <div className="dash__cards">
            {[0, 1, 2].map((i) => (
              <button key={i} type="button" className="dash__card" onClick={() => navigate('/businesses')}>
                <span>
                  <strong>Bright Smile Dental Group LLC · TIN 92904505</strong>
                  <small>12 providers · 3 locations</small>
                </span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0087cd" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 01-1 1H5a1 1 0 01-1-1V7a1 1 0 011-1h5" /></svg>
              </button>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}

export function Dashboard() {
  return hasSubmitted() ? <ActiveDashboard /> : <WelcomeDashboard />
}

function WelcomeDashboard() {
  const navigate = useNavigate()
  const { state } = useEnrollment()
  const dsoName = state.organization.legalName || '[DSO]'

  return (
    <div className="dash">
      <PortalNav />

      <main className="dash__main">
        <div className="dash__hero">
          <p className="dash__date">{formatToday()}</p>
          <h1 className="dash__title heading-1">Welcome to NationsDental, {dsoName}!</h1>
          <p className="dash__sub subtitle-3">Your account is ready. Follow the steps below to set up your first business and start using the portal.</p>
        </div>

        <section className="dash__banner">
          <span className="dash__banner-icon"><BuildingIcon size={36} /></span>
          <div className="dash__banner-text">
            <h2>We found your businesses in our records</h2>
            <p>5 businesses were pre-loaded. Some need your attention before they can go live. Review the action items below to get started.</p>
          </div>
          <button type="button" className="dash__banner-btn" onClick={() => navigate('/businesses')}>View All Business</button>
        </section>

        <section className="dash__stats">
          {STATS.map((s) => (
            <div key={s.label} className="dash__stat">
              <span className={`dash__stat-label dash__tone--${s.tone}`}>
                <i className="dash__dot" />
                {s.label}
              </span>
              <strong>{s.value}</strong>
              <small>of 5 total</small>
            </div>
          ))}
        </section>

        <div className="dash__panels">
          <section className="dash__panel">
            <div className="dash__panel-head">
              <h3>Action Required</h3>
              <a href="#/home">View All</a>
            </div>
            <ul>
              {ACTIONS.map((a) => (
                <li key={a.name}>
                <div className="dash__row">
                  <i className={`dash__bullet dash__bullet--${a.tone}`} />
                  <div>
                    <strong>{a.name}</strong>
                    <small>{a.note}</small>
                  </div>
                  <a href="#/home" className="dash__view">
                    View <span aria-hidden="true">›</span>
                  </a>
                </div>
                </li>
              ))}
            </ul>
          </section>

          <section className="dash__panel">
            <div className="dash__panel-head">
              <h3>Recent Activity</h3>
              <a href="#/home">View All</a>
            </div>
            <ul>
              <li>
                <div className="dash__row">
                <span className="dash__activity-icon"><BuildingIcon size={20} /></span>
                <div>
                  <strong>18 businesses pre-loaded from records</strong>
                  <small>by Network</small>
                </div>
                <time>Apr 15, 2026</time>
                </div>
              </li>
            </ul>
          </section>
        </div>
      </main>
    </div>
  )
}
