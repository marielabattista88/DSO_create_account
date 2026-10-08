/**
 * Portal home — where "Go to NationsDental Portal" lands.
 * Static prototype: numbers and businesses are sample data.
 */

import { PortalNav } from './PortalNav'
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

export function Dashboard() {
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
          <button type="button" className="dash__banner-btn">View All Business</button>
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
