/** New Business — step 3: Service Locations list (Figma 8229:130794 empty, 8229:130821 filled). */

import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Button } from 'nb-flexpay-ui'
import { NewBusinessLayout } from './NewBusinessLayout'
import { loadLocations, sampleLocations, saveLocations } from './serviceStore'

export function ServiceLocations() {
  const navigate = useNavigate()
  const location = useLocation()
  const [items, setItems] = useState(loadLocations)
  const [banner, setBanner] = useState((location.state as { removed?: boolean } | null)?.removed ?? false)
  const [error, setError] = useState(false)

  const upload = () => {
    const next = [...items, ...sampleLocations(15)]
    saveLocations(next)
    setItems(next)
    setBanner(false)
  }

  return (
    <NewBusinessLayout
      active="Service Locations"
      title="Service Locations"
      description="Add the locations where you provide care. You can upload a file or add them manually."
      onBack={() => navigate('/businesses/new/billing')}
    >
      {banner && (
        <div className="nb__banner" role="status">
          <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="8" fill="#1f8a4c" /><path d="M4.5 8.3l2.3 2.3 4.7-4.7" fill="none" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
          Service Location(s) removed successfully.
        </div>
      )}

      <div className="nb__list-bar">
        <h3>All Locations{items.length > 0 ? ` (${items.length})` : ''}</h3>
        <div className="nb__list-actions">
          <button type="button" className="nb__upload" onClick={upload}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true"><path d="M7 9V2M4 4.5L7 1.5l3 3M2 9v3h10V9" strokeLinecap="round" strokeLinejoin="round" /></svg>
            Upload
          </button>
          <button type="button" className="nb__add-btn" onClick={() => navigate('/businesses/new/service/add')}>
            <span aria-hidden="true">+</span> Add
          </button>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="nb__empty">
          <strong>No Service Locations Added</strong>
          <small>Add your first service location to get started.</small>
        </div>
      ) : (
        <ul className="nb__locs">
          {items.map((l, i) => (
            <li key={i}>
              <button type="button" onClick={() => navigate(`/businesses/new/service/add?i=${i}`)}>
                <span><strong>{l.dba}</strong><small>{l.address}</small></span>
                <span className="nb__chev" aria-hidden="true">›</span>
              </button>
            </li>
          ))}
        </ul>
      )}
      {error && <p className="nb__error">Add at least one service location.</p>}

      <div className="nb__submit">
        <Button type="button" variant="filled" size="medium" style={{ width: '100%' }}
          onClick={() => (items.length ? navigate('/businesses/new/providers') : setError(true))}>
          Continue
        </Button>
      </div>
    </NewBusinessLayout>
  )
}
