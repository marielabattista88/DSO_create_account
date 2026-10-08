/**
 * DSO portal menu — Figma "DSO Menu" (8229:130237), 1440 × 72.
 *   bar        padding 16px 24px, Secondary/Night
 *   menu       3 pills (33px tall, 24px side padding, 16px gap), centred
 *   right      2 icon buttons 36×36 (8px gap) · 16px · 1px divider · 16px · profile 158×40
 */

import { useEffect, useRef, useState } from 'react'
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
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!open) return
    const close = (e: MouseEvent) => { if (!menuRef.current?.contains(e.target as Node)) setOpen(false) }
    const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('mousedown', close)
    document.addEventListener('keydown', esc)
    return () => { document.removeEventListener('mousedown', close); document.removeEventListener('keydown', esc) }
  }, [open])
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
            className={`pnav__tab${(pathname === tab.path || pathname.startsWith(tab.path + '/')) ? ' pnav__tab--active' : ''}`}
            aria-current={(pathname === tab.path || pathname.startsWith(tab.path + '/')) ? 'page' : undefined}
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
        <div className="pnav__account" ref={menuRef}>
        <button type="button" className="pnav__profile" onClick={() => setOpen((o) => !o)} aria-label="Account menu" aria-expanded={open}>
          <span className="pnav__avatar" aria-hidden="true">{initials}</span>
          <span className="pnav__who">
            <strong>{fullName}</strong>
            <small>DSO Admin</small>
          </span>
          <span className="pnav__chevron" aria-hidden="true">
            <Icon d={CHEVRON} size={16} />
          </span>
        </button>
        {open && (
          <div className="pnav__pop" role="menu">
            <div className="pnav__pop-head">
              <strong>{fullName}</strong>
              <span>{state.email || 'johndoe@gmail.com'}</span>
            </div>
            <button type="button" role="menuitem" className="pnav__pop-item" onClick={() => navigate('/settings')}>
              <Icon d="M12 15a3 3 0 100-6 3 3 0 000 6M19 12a7 7 0 00-.1-1.2l2-1.5-2-3.4-2.3 1a7 7 0 00-2-1.2L14.2 3H9.8l-.4 2.7a7 7 0 00-2 1.2l-2.3-1-2 3.4 2 1.5a7 7 0 000 2.4l-2 1.5 2 3.4 2.3-1a7 7 0 002 1.2l.4 2.7h4.4l.4-2.7a7 7 0 002-1.2l2.3 1 2-3.4-2-1.5c.1-.4.1-.8.1-1.2Z" size={20} />
              <span>Settings</span>
              <Icon d="m9 6 6 6-6 6" size={18} />
            </button>
            <button type="button" role="menuitem" className="pnav__pop-item">
              <Icon d="M6 3h12v18H6zM9 8h6M9 12h6" size={20} />
              <span>Agreements</span>
              <Icon d="m9 6 6 6-6 6" size={18} />
            </button>
            <button type="button" role="menuitem" className="pnav__pop-item pnav__pop-out" onClick={() => navigate('/')}>
              <Icon d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" size={20} />
              <span>Sign out</span>
            </button>
          </div>
        )}
        </div>
      </div>
    </header>
  )
}
