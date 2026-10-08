/** New Business — step 6: Review and Submit (Figma 2257:90441). */

import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from 'nb-flexpay-ui'
import { NewBusinessLayout } from './NewBusinessLayout'
import { loadLocations } from './serviceStore'
import { loadProviders } from './providerStore'

const read = (key: string) => {
  try { return JSON.parse(sessionStorage.getItem(key) ?? '{}') } catch { return {} }
}
const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? '' : 's'}`

const icon = (d: ReactNode) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{d}</svg>
)
const ICONS = {
  business: icon(<><rect x="2" y="5" width="12" height="8" rx="1" /><path d="M6 5V3.5h4V5M2 8.5h12" /></>),
  billing: icon(<><path d="M8 14s4.5-3.6 4.5-7A4.5 4.5 0 0 0 3.5 7C3.5 10.4 8 14 8 14z" /><circle cx="8" cy="7" r="1.5" /></>),
  service: icon(<><path d="M2.5 6.5L3.5 3h9l1 3.5M3 6.5V13h10V6.5M6.5 13V9.5h3V13" /></>),
  providers: icon(<><circle cx="8" cy="5.5" r="2.5" /><path d="M3 13.5c.5-2.5 2.5-4 5-4s4.5 1.5 5 4" /></>),
  bank: icon(<><path d="M2 6l6-3.5L14 6M3 6.5v5M6 6.5v5M10 6.5v5M13 6.5v5M2 13.5h12" /></>),
}

interface Row { icon: ReactNode; title: string; sub: string; status: string; pending?: boolean; to: string }

export function ReviewSubmit() {
  const navigate = useNavigate()
  const draft = read('newBusinessDraft')
  const billing = read('newBusinessBilling')
  const locations = loadLocations()
  const providers = loadProviders()

  const rows: Row[] = [
    { icon: ICONS.business, title: 'Business information', sub: draft.legalName || '1 business', status: 'Completed', to: '/businesses/new' },
    { icon: ICONS.billing, title: 'Billing Location', sub: billing.address1 ? '1 billing location' : '1 billing location · existing', status: 'Completed', to: '/businesses/new/billing' },
    { icon: ICONS.service, title: 'Service Locations', sub: `${plural(locations.length, 'location')} assigned`, status: 'Completed', to: '/businesses/new/service' },
    { icon: ICONS.providers, title: 'Providers', sub: plural(providers.length, 'provider'), status: 'Completed', to: '/businesses/new/providers' },
    { icon: ICONS.bank, title: 'Bank Account', sub: 'To be completed after approval', status: 'Pending', pending: true, to: '/businesses/new/bank' },
  ]

  return (
    <NewBusinessLayout
      active="Review And Submit"
      title="Review and Submit"
      description="Make sure everything looks right before sending your enrollment."
    >
      <div className="nb__review">
        {rows.map((r) => (
          <div key={r.title} className="nb__review-row">
            <span className="nb__review-icon">{r.icon}</span>
            <span className="nb__review-text">
              <strong>{r.title}</strong>
              <small>{r.sub}</small>
              <em className={r.pending ? 'is-pending' : undefined}>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.1" aria-hidden="true"><circle cx="6" cy="6" r="5.3" />{!r.pending && <path d="M3.6 6.2l1.7 1.7 3.1-3.3" strokeLinecap="round" strokeLinejoin="round" />}</svg>
                {r.status}
              </em>
            </span>
            <button type="button" className="nb__link-btn" onClick={() => navigate(r.to)}>Edit</button>
          </div>
        ))}
      </div>

      <div className="nb__submit">
        <Button type="button" variant="filled" size="medium" style={{ width: '100%' }} onClick={() => navigate('/businesses/new/submitted')}>
          Confirm &amp; Submit Enrollment
        </Button>
      </div>
    </NewBusinessLayout>
  )
}
