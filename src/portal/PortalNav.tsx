/**
 * DSO portal menu — Figma "DSO Menu" (8229:130237), 1440 × 72.
 *   bar        padding 16px 24px, Secondary/Night
 *   menu       3 pills (33px tall, 24px side padding, 16px gap), centred
 *   right      2 icon buttons 36×36 (8px gap) · 16px · 1px divider · 16px · profile 158×40
 */

import { useNavigate, useLocation } from 'react-router-dom'
import logoUrl from '../assets/nations-dental-logo.svg'
import { useEnrollment } from '../enrollment/data/store'
import './PortalNav.css'

const TABS = [
  { label: 'Home', path: '/home' },
  { label: 'My Businesses', path: '/businesses' },
  { label: 'User & Roles', path: '/users' },
]

function Icon({ d, size = 24 }: { d: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={d} />
    </svg>
  )
}

const GLOBE = 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18'
const BELL = 'M6 9a6 6 0 1 1 12 0c0 6 2 7 2 7H4s2-1 2-7ZM10 20a2 2 0 0 0 4 0'
const CHEVRON = 'm6 9 6 6 6-6'

export function PortalNav() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { state } = useEnrollment()
  const fullName = [state.firstName, state.lastName].filter(Boolean).join(' ') || 'John Doe'
  const initials = fullName
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <header className="pnav">
      <div className="pnav__brand">
        <img src={logoUrl} alt="NationsDental" width={270} height={40} />
      </div>

      <nav className="pnav__menu" aria-label="Primary">
        {TABS.map((tab) => (
          <button
            key={tab.path}
            type="button"
            className={`pnav__tab${pathname === tab.path ? ' pnav__tab--active' : ''}`}
            aria-current={pathname === tab.path ? 'page' : undefined}
            onClick={() => navigate(tab.path)}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <div className="pnav__right">
        <div className="pnav__icons">
          <button type="button" className="pnav__icon" aria-label="Language">
            <Icon d={GLOBE} />
          </button>
          <button type="button" className="pnav__icon pnav__icon--dot" aria-label="Notifications">
            <Icon d={BELL} />
          </button>
        </div>
        <span className="pnav__divider" />
        <button type="button" className="pnav__profile" onClick={() => navigate('/')} aria-label="Account menu">
          <span className="pnav__avatar" aria-hidden="true">{initials}</span>
          <span className="pnav__who">
            <strong>{fullName}</strong>
            <small>DSO Admin</small>
          </span>
          <span className="pnav__chevron" aria-hidden="true">
            <Icon d={CHEVRON} size={16} />
          </span>
        </button>
      </div>
    </header>
  )
}
