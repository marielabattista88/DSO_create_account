/**
 * "New Business Process" shell — Figma 8229:130462.
 * 72px dark header (logo, title, language, close) + step rail on the left + 600px content column.
 */

import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import logoUrl from '../assets/nations-dental-logo.svg'
import './NewBusiness.css'

export const NB_STEPS = [
  { title: 'Verify Your Information', items: ['Business Information'] },
  { title: 'Add Your Locations', items: ['Billing Locations', 'Service Locations'] },
  { title: 'Add Your Providers', items: ['Providers Information'] },
  { title: 'Add Your Bank Account', items: ['Bank Accounts'] },
  { title: 'Review And Submit', items: ['Review And Submit'] },
]

interface Props {
  /** Active sub-step label, e.g. "Business Information". */
  active: string
  title: string
  description?: ReactNode
  /** Shows a back arrow before the title. */
  onBack?: () => void
  /** Hides the step rail and title (used by the final confirmation screen). */
  plain?: boolean
  children: ReactNode
}

export function NewBusinessLayout({ active, title, description, onBack, plain, children }: Props) {
  const navigate = useNavigate()
  const flat = NB_STEPS.flatMap((s) => s.items)
  const activeIndex = flat.indexOf(active)
  const last = activeIndex === flat.length - 1

  return (
    <div className="nb">
      <header className="nb__header">
        <img src={logoUrl} alt="NationsDental" height={40} className="nb__logo" />
        <h1 className="nb__header-title">New Business Proccess</h1>
        <div className="nb__header-right">
          <span className="nb__lang">EN</span>
          <button type="button" className="nb__close" aria-label="Close" onClick={() => navigate('/businesses')}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
              <path d="M3 3l10 10M13 3L3 13" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </header>

      <div className="nb__body">
        {!plain && <nav className="nb__rail" aria-label="Progress">
          <ol>
            {NB_STEPS.map((group) => {
              const groupStart = flat.indexOf(group.items[0])
              const groupActive = group.items.includes(active)
              const groupDone = last || groupStart + group.items.length - 1 < activeIndex
              return (
                <li key={group.title} className="nb__group">
                  <div className={`nb__group-title${groupActive ? ' is-active' : ''}`}>
                    <span className={`nb__ring${groupActive ? ' is-active' : ''}${groupDone ? ' is-done' : ''}`} aria-hidden="true" />
                    {group.title}
                  </div>
                  <ul>
                    {group.items.map((item) => {
                      const done = last || flat.indexOf(item) < activeIndex
                      return (
                        <li key={item} className={item === active ? 'is-active' : undefined} aria-current={item === active ? 'step' : undefined}>
                          <span className={`nb__dot${done ? ' is-done' : ''}`} aria-hidden="true">
                            {done && <svg width="8" height="8" viewBox="0 0 8 8" fill="none" stroke="#fff" strokeWidth="1.4"><path d="M1.5 4.2l1.8 1.8L6.5 2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                          </span>
                          {item}
                        </li>
                      )
                    })}
                  </ul>
                </li>
              )
            })}
          </ol>
        </nav>}

        <main className="nb__content">
          {plain ? children : <>
          <h2 className="nb__title">
            {onBack && (
              <button type="button" className="nb__back" aria-label="Back" onClick={onBack}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true"><path d="M13 8H3M7.5 3.5L3 8l4.5 4.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </button>
            )}
            {title}
          </h2>
          {description && <p className="nb__desc">{description}</p>}
          {children}
          </>}
        </main>
      </div>
    </div>
  )
}
