/** New Business — Add Provider form + "Select Service Locations" modal (Figma 8229:131348 / 8229:131441). */

import { useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Button, CustomFormProvider, FieldInput, FieldMaskInput, FieldSelect, useForm } from 'nb-flexpay-ui'
import { NewBusinessLayout } from './NewBusinessLayout'
import { loadProviders, saveProviders } from './providerStore'
import { loadLocations } from './serviceStore'
import { NO_FIELD_ERRORS } from '../email-policy'

const opts = (list: string[]) => list.map((v) => ({ value: v, label: v }))
const CREDENTIALS = opts(['DDS', 'DMD', 'RDH', 'MD', 'DO'])
const SPECIALTIES = opts(['General Dentistry', 'Orthodontics', 'Pediatric Dentistry', 'Periodontics', 'Endodontics', 'Oral Surgery'])
const NPI_MASK = Array(10).fill(/\d/)

type Values = Record<string, unknown>
const text = (v: unknown) => String(v ?? '').trim()
const optionValue = (o: unknown) => (o as { value?: string } | null)?.value ?? ''

interface Loc { id: string; name: string; address: string; business: string }

const DEMO: Loc[] = [
  ['14721 Biscayne Blvd, North Miami Beach, FL 33181', 'Sunshine Dental Group · TIN 12-3456789'],
  ['20801 Biscayne Blvd, Aventura, FL 33180', 'Sunshine Dental Group · TIN 12-3456789'],
  ['450 7th Ave, New York, NY 10123', 'Sunshine Dental Group · TIN 12-3456789'],
  ['2100 N Collins Blvd, Richardson, TX 75080', 'Sunshine Dental Group · TIN 12-3456789'],
  ['350 S Grand Ave, Los Angeles, CA 90071', 'Gulf Coast Family Dentistry · TIN 98-7654321'],
  ['8700 W Bryn Mawr Ave, Chicago, IL 60631', 'Gulf Coast Family Dentistry · TIN 98-7654321'],
].map(([address, business], i) => ({ id: `demo-${i}`, name: 'Bright Smile Dental', address, business }))

function useAvailableLocations(): Loc[] {
  return useMemo(() => {
    const own = loadLocations().map((l, i) => ({
      id: `own-${i}`, name: l.dba, address: l.address, business: 'Bright Smile Dental Group LLC · TIN 78-829845',
    }))
    return [...own, ...DEMO]
  }, [])
}

function validate(v: Values) {
  const errors: Record<string, { type: string; message: string }> = {}
  const fail = (n: string, m: string) => { errors[n] = { type: 'validate', message: m } }
  if (!text(v.firstName)) fail('firstName', 'Enter the first name.')
  if (!text(v.lastName)) fail('lastName', 'Enter the last name.')
  if (!/^\d{10}$/.test(text(v.npi).replace(/\D/g, ''))) fail('npi', 'Enter a valid 10-digit NPI.')
  if (!optionValue(v.credentials)) fail('credentials', 'Select the credentials.')
  if (!optionValue(v.specialty)) fail('specialty', 'Select the specialty.')
  return errors
}

function LocationsModal({ all, initial, onClose, onAdd }: {
  all: Loc[]; initial: string[]; onClose: () => void; onAdd: (ids: string[]) => void
}) {
  const [selected, setSelected] = useState<string[]>(initial)
  const [tab, setTab] = useState<'all' | 'selected'>('all')
  const [query, setQuery] = useState('')
  const [business, setBusiness] = useState('')

  const businesses = Array.from(new Set(all.map((l) => l.business)))
  const q = query.trim().toLowerCase()
  const visible = all.filter((l) =>
    (tab === 'all' || selected.includes(l.id)) &&
    (!business || l.business === business) &&
    (!q || `${l.name} ${l.address}`.toLowerCase().includes(q)))
  const groups = Array.from(new Set(visible.map((l) => l.business)))
  const toggle = (id: string) => setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]))
  const allVisibleSelected = visible.length > 0 && visible.every((l) => selected.includes(l.id))
  const selectAll = () =>
    setSelected((s) => (allVisibleSelected ? s.filter((id) => !visible.some((l) => l.id === id)) : Array.from(new Set([...s, ...visible.map((l) => l.id)]))))

  return (
    <div className="nb__overlay" role="presentation" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="nb__modal" role="dialog" aria-modal="true" aria-labelledby="nb-sl-title">
        <button type="button" className="nb__modal-x" aria-label="Close" onClick={onClose}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M2 2l10 10M12 2L2 12" /></svg>
        </button>
        <h2 id="nb-sl-title">Select Service Locations</h2>
        <p className="nb__modal-sub">Choose the locations where this provider delivers care.</p>

        <div className="nb__modal-filters">
          <label className="nb__search">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true"><circle cx="6" cy="6" r="4.5" /><path d="M9.5 9.5L13 13" strokeLinecap="round" /></svg>
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by Service Location" />
          </label>
          <select className="nb__bizselect" value={business} onChange={(e) => setBusiness(e.target.value)} aria-label="Select Business">
            <option value="">Select Business</option>
            {businesses.map((b) => <option key={b} value={b}>{b.split(' · ')[0]}</option>)}
          </select>
        </div>

        <div className="nb__modal-tabs">
          <div className="nb__pills">
            <button type="button" className={tab === 'all' ? 'is-on' : ''} onClick={() => setTab('all')}>All ({all.length})</button>
            <button type="button" className={tab === 'selected' ? 'is-on' : ''} onClick={() => setTab('selected')}>Selected ({selected.length})</button>
          </div>
          <button type="button" className="nb__link-btn" onClick={selectAll}>{allVisibleSelected ? 'Clear All' : 'Select All'}</button>
        </div>

        <div className="nb__modal-list">
          {visible.length === 0 && <p className="nb__modal-empty">No service locations found.</p>}
          {groups.map((g) => (
            <div key={g}>
              <div className="nb__modal-group">{g}</div>
              {visible.filter((l) => l.business === g).map((l) => (
                <label key={l.id} className="nb__modal-row">
                  <input type="checkbox" checked={selected.includes(l.id)} onChange={() => toggle(l.id)} />
                  <span><strong>{l.name}</strong><small>{l.address}</small></span>
                </label>
              ))}
            </div>
          ))}
        </div>

        <div className="nb__modal-actions">
          <button type="button" className="nb__btn-outline" onClick={onClose}>Cancel</button>
          <Button type="button" variant="filled" size="medium" style={{ flex: 1 }} onClick={() => onAdd(selected)}>Add</Button>
        </div>
      </div>
    </div>
  )
}

export function AddProvider() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const editing = params.get('i')
  const existing = editing !== null ? loadProviders()[Number(editing)] : undefined
  const available = useAvailableLocations()
  const [assigned, setAssigned] = useState<string[]>(existing?.locations ?? [])
  const [picking, setPicking] = useState(false)
  const [locError, setLocError] = useState(false)

  const methods = useForm<Values>({
    defaultValues: {
      firstName: existing?.firstName ?? '',
      lastName: existing?.lastName ?? '',
      npi: existing?.npi ?? '',
      credentials: CREDENTIALS.find((c) => c.value === existing?.credentials) ?? null,
      specialty: SPECIALTIES.find((c) => c.value === existing?.specialty) ?? null,
    },
    mode: 'onBlur',
    resolver: (values) => {
      const errors = validate(values)
      if (Object.keys(errors).length > 0) return { values: {}, errors }
      return { values, errors: NO_FIELD_ERRORS }
    },
  })

  const onSubmit = methods.handleSubmit((v) => {
    if (assigned.length === 0) { setLocError(true); return }
    const list = loadProviders()
    const item = {
      firstName: text(v.firstName),
      lastName: text(v.lastName),
      npi: text(v.npi).replace(/\D/g, ''),
      credentials: optionValue(v.credentials),
      specialty: optionValue(v.specialty),
      locations: assigned,
    }
    if (editing !== null && list[Number(editing)]) list[Number(editing)] = item
    else list.push(item)
    saveProviders(list)
    navigate('/businesses/new/providers')
  })

  const remove = () => {
    saveProviders(loadProviders().filter((_, i) => i !== Number(editing)))
    navigate('/businesses/new/providers')
  }

  const chosen = available.filter((l) => assigned.includes(l.id))

  return (
    <NewBusinessLayout active="Providers Information" title="Provider Information" onBack={() => navigate('/businesses/new/providers')}>
      <CustomFormProvider {...methods}>
        <form onSubmit={onSubmit} noValidate className="nb__sections">
          <section style={{ borderBottom: 0, paddingBottom: 0 }}>
            <div className="nb__stack">
              <FieldInput name="firstName" label="First Name" required placeholder="Christian Sais" />
              <FieldInput name="lastName" label="Last Name" required placeholder="Christian Sais" />
              <FieldMaskInput name="npi" label="NPI" required mask={NPI_MASK} guide={false} placeholder="627395405" />
              <FieldSelect name="credentials" label="Credentials*" required showIcon={false} options={CREDENTIALS} placeholder="Select" />
              <FieldSelect name="specialty" label="Speciality*" required showIcon={false} options={SPECIALTIES} placeholder="Select" />
            </div>
          </section>

          <section>
            <div className="nb__assign-head">
              <h3 className="nb__section-title" style={{ margin: 0 }}>Assign Service Location(s)</h3>
              <button type="button" className="nb__btn-outline nb__btn-outline--sm" onClick={() => setPicking(true)}>Add Service Location</button>
            </div>
            {chosen.length === 0 ? (
              <div className="nb__empty nb__empty--sm">
                <strong>No Service Locations Assigned</strong>
                <small>Select one or more service locations you already added.</small>
              </div>
            ) : (
              <ul className="nb__locs nb__locs--static">
                {chosen.map((l) => (
                  <li key={l.id}>
                    <div className="nb__assigned">
                      <span><strong>{l.name}</strong><small>{l.address}</small></span>
                      <button type="button" className="nb__link-btn" onClick={() => setAssigned((s) => s.filter((x) => x !== l.id))}>Remove</button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
            {locError && assigned.length === 0 && <p className="nb__error">Assign at least one service location.</p>}
          </section>

          <div className="nb__submit" style={{ marginTop: 0 }}>
            <Button type="submit" variant="filled" size="medium" style={{ width: '100%' }}>Save Provider</Button>
            {existing && <button type="button" className="nb__link-btn nb__remove" onClick={remove}>Remove provider</button>}
          </div>
        </form>
      </CustomFormProvider>

      {picking && (
        <LocationsModal all={available} initial={assigned} onClose={() => setPicking(false)}
          onAdd={(ids) => { setAssigned(ids); setLocError(false); setPicking(false) }} />
      )}
    </NewBusinessLayout>
  )
}
