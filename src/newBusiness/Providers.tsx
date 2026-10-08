/** New Business — step 4: Providers Information list (Figma 8229:130854). */

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from 'nb-flexpay-ui'
import { NewBusinessLayout } from './NewBusinessLayout'
import { loadProviders, sampleProviders, saveProviders } from './providerStore'

export function Providers() {
  const navigate = useNavigate()
  const [items, setItems] = useState(loadProviders)
  const [error, setError] = useState(false)

  const upload = () => {
    const next = [...items, ...sampleProviders(5)]
    saveProviders(next)
    setItems(next)
    setError(false)
  }

  return (
    <NewBusinessLayout
      active="Providers Information"
      title="Providers Information"
      description="Add the providers associated with your organization. You can upload a file or add them manually."
      onBack={() => navigate('/businesses/new/service')}
    >
      <div className="nb__list-bar">
        <h3>All Providers{items.length > 0 ? ` (${items.length})` : ''}</h3>
        <div className="nb__list-actions">
          <button type="button" className="nb__upload" onClick={upload}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true"><path d="M7 9V2M4 4.5L7 1.5l3 3M2 9v3h10V9" strokeLinecap="round" strokeLinejoin="round" /></svg>
            Upload
          </button>
          <button type="button" className="nb__add-btn" onClick={() => navigate('/businesses/new/providers/add')}>
            <span aria-hidden="true">+</span> Add
          </button>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="nb__empty">
          <strong>No Providers Information Added</strong>
          <small>Add your first provider to get started.</small>
        </div>
      ) : (
        <ul className="nb__locs">
          {items.map((p, i) => (
            <li key={i}>
              <button type="button" onClick={() => navigate(`/businesses/new/providers/add?i=${i}`)}>
                <span>
                  <strong>{p.firstName} {p.lastName}</strong>
                  <small>NPI {p.npi} · {p.credentials} · {p.specialty}</small>
                </span>
                <span className="nb__chev" aria-hidden="true">›</span>
              </button>
            </li>
          ))}
        </ul>
      )}
      {error && <p className="nb__error">Add at least one provider.</p>}

      <div className="nb__submit">
        <Button type="button" variant="filled" size="medium" style={{ width: '100%' }}
          onClick={() => (items.length ? navigate('/businesses/new/bank') : setError(true))}>
          Continue
        </Button>
      </div>
    </NewBusinessLayout>
  )
}
