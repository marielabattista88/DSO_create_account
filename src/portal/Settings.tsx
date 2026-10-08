/** Account settings hub — Figma 8840:242688. Cards are not wired to detail pages yet. */

import { PortalNav } from './PortalNav'
import './Settings.css'

const ICON_USER = 'M12 12a4 4 0 100-8 4 4 0 000 8M6 19c1-3 3-4 6-4s5 1 6 4M12 22a10 10 0 110-20 10 10 0 010 20'
const ICON_BELL = 'M6 9a6 6 0 1 1 12 0c0 6 2 7 2 7H4s2-1 2-7ZM10 20a2 2 0 0 0 4 0'
const ICON_STORE = 'M4 9l1-5h14l1 5M4 9v11h16V9M4 9a2.7 2.7 0 005.3 0 2.7 2.7 0 005.4 0A2.7 2.7 0 0020 9M10 20v-5h4v5'

const GROUPS = [
  {
    title: 'Personal',
    items: [
      { icon: ICON_USER, title: 'Personal Details', desc: 'User information, password, authentication methods, and your activity sessions' },
      { icon: ICON_BELL, title: 'Notifications & Preferences', desc: 'Manage how you receive notifications, communication, and portal preferences.' },
    ],
  },
  {
    title: 'Organization',
    items: [
      { icon: ICON_STORE, title: 'Organization Information', desc: 'Account Details, legal entity, billing location and more' },
    ],
  },
]

function Icon({ d, size }: { d: string; size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={d} />
    </svg>
  )
}

export function Settings() {
  return (
    <div className="set">
      <PortalNav />
      <main className="set__main">
        {GROUPS.map((g) => (
          <section key={g.title} className="set__group">
            <h2>{g.title}</h2>
            <div className="set__card">
              {g.items.map((i) => (
                <button key={i.title} type="button" className="set__row">
                  <span className="set__icon"><Icon d={i.icon} size={20} /></span>
                  <span className="set__text">
                    <strong>{i.title}</strong>
                    <small>{i.desc}</small>
                  </span>
                  <span className="set__chev"><Icon d="m9 6 6 6-6 6" size={14} /></span>
                </button>
              ))}
            </div>
          </section>
        ))}
      </main>
    </div>
  )
}
