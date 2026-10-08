/** New Business — Add Service Location form (Figma 8912:244471). */

import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Button, CustomFormProvider, FieldInput, FieldMaskInput, FieldSelect, useForm } from 'nb-flexpay-ui'
import { NewBusinessLayout } from './NewBusinessLayout'
import { loadLocations, saveLocations } from './serviceStore'
import { LANGUAGES, US_STATES } from '../enrollment/data/options'
import { NO_FIELD_ERRORS } from '../email-policy'

const ROLES = ['Owner', 'Administrator', 'Office Manager', 'Billing Manager', 'Other'].map((r) => ({ value: r, label: r }))
const PHONE_MASK = ['(', /\d/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]
const PHONE_PATTERN = /^\(\d{3}\) \d{3}-\d{4}$/
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
const ZONES = ['Eastern (ET)', 'Central (CT)', 'Mountain (MT)', 'Pacific (PT)']
const TIMES = Array.from({ length: 48 }, (_, i) => {
  const h = Math.floor(i / 2)
  return `${String(h % 12 || 12).padStart(2, '0')}:${i % 2 ? '30' : '00'}${h < 12 ? 'AM' : 'PM'}`
})
const ACCESS = ['Access to Public Transportation', 'Handicap Accessible', 'Hearing Impaired', 'Mental/Physical Impairment Services']

type Values = Record<string, unknown>
const text = (v: unknown) => String(v ?? '').trim()
const optionValue = (o: unknown) => (o as { value?: string } | null)?.value ?? ''

function validate(v: Values, contacts: number) {
  const errors: Record<string, { type: string; message: string }> = {}
  const fail = (n: string, m: string) => { errors[n] = { type: 'validate', message: m } }
  if (!text(v.dba)) fail('dba', 'Enter the doing business as name.')
  if (!optionValue(v.languages)) fail('languages', 'Select a language.')
  if (!text(v.address1)) fail('address1', 'Enter the street address.')
  if (!optionValue(v.addressState)) fail('addressState', 'Select the state.')
  if (!text(v.city)) fail('city', 'Enter the city.')
  if (!/^\d{5}$/.test(text(v.zip))) fail('zip', 'Enter a valid ZIP code.')
  for (let i = 1; i <= contacts; i++) {
    if (!text(v[`name${i}`])) fail(`name${i}`, 'Enter the contact name.')
    if (!optionValue(v[`role${i}`])) fail(`role${i}`, 'Select a role.')
    if (!EMAIL_PATTERN.test(text(v[`email${i}`]))) fail(`email${i}`, 'Enter a valid email address.')
    if (!PHONE_PATTERN.test(text(v[`phone${i}`]))) fail(`phone${i}`, 'Enter a valid phone number.')
  }
  return errors
}

export function AddServiceLocation() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const editing = params.get('i')
  const existing = editing !== null ? loadLocations()[Number(editing)] : undefined

  const [contacts, setContacts] = useState(1)
  const [sameAsBilling, setSameAsBilling] = useState(false)
  const [zone, setZone] = useState('')
  const [hours, setHours] = useState(DAYS.map(() => ({ from: '', to: '', closed: false })))
  const [access, setAccess] = useState<string[]>([])

  const methods = useForm<Values>({
    defaultValues: { dba: existing?.dba ?? '', languages: null, address1: '', address2: '', addressState: null, city: '', zip: '' },
    mode: 'onBlur',
    resolver: (values) => {
      const errors = validate(values, contacts)
      if (Object.keys(errors).length > 0) return { values: {}, errors }
      return { values, errors: NO_FIELD_ERRORS }
    },
  })

  const setDay = (i: number, patch: Partial<(typeof hours)[number]>) =>
    setHours((h) => h.map((d, k) => (k === i ? { ...d, ...patch } : d)))
  const applyToAll = () => setHours((h) => h.map(() => ({ ...h[0] })))

  const toggleSame = () => {
    const next = !sameAsBilling
    setSameAsBilling(next)
    if (next) {
      const billing = JSON.parse(sessionStorage.getItem('newBusinessBilling') ?? '{}')
      const fill = billing.address1
        ? { address1: billing.address1, address2: billing.address2 ?? '', city: billing.city ?? '', addressState: billing.addressState ?? null, zip: billing.zip ?? '' }
        : { address1: '1234 Main Street', address2: 'Suite 200', city: 'Austin', addressState: US_STATES.find((s) => s.value === 'TX') ?? null, zip: '78701' }
      Object.entries(fill).forEach(([k, v]) => methods.setValue(k, v))
    }
  }

  const onSubmit = methods.handleSubmit((v) => {
    const list = loadLocations()
    const item = {
      dba: text(v.dba),
      address: `${text(v.address1)}, ${text(v.city)}, ${optionValue(v.addressState)} ${text(v.zip)}`,
      languages: (v.languages as { label?: string } | null)?.label ?? '',
    }
    if (editing !== null && list[Number(editing)]) list[Number(editing)] = item
    else list.push(item)
    saveLocations(list)
    navigate('/businesses/new/service')
  })

  const remove = () => {
    const list = loadLocations().filter((_, i) => i !== Number(editing))
    saveLocations(list)
    navigate('/businesses/new/service', { state: { removed: true } })
  }

  return (
    <NewBusinessLayout active="Service Locations" title="Service Location" onBack={() => navigate('/businesses/new/service')}>
      <CustomFormProvider {...methods}>
        <form onSubmit={onSubmit} noValidate className="nb__sections">
          <section>
            <h3 className="nb__section-title">General Information</h3>
            <p className="nb__linked">Service location will be linked to:<br /><strong>Bright Smile Dental Group LLC · 78-829845</strong></p>
            <div className="nb__stack">
              <FieldInput name="dba" label="Doing Business As (DBA)" required />
              <FieldSelect name="languages" label="Languages*" required showIcon={false} options={LANGUAGES} />
            </div>
          </section>

          <section>
            <h3 className="nb__section-title">Address Information</h3>
            <label className="nb__same nb__same--form">
              <button type="button" role="switch" aria-checked={sameAsBilling} className={`nb__switch${sameAsBilling ? ' is-on' : ''}`} onClick={toggleSame} />
              Use the same address as my billing address
            </label>
            <div className="nb__stack">
              <FieldInput name="address1" label="Address Line 1" required placeholder="e.g. 1725 Slough Avenue" />
              <FieldInput name="address2" label="Address Line 2" placeholder="e.g. Suite 200" />
              <div className="nb__row nb__row--3">
                <FieldInput name="city" label="City" required placeholder="Type" />
                <FieldSelect name="addressState" label="State*" required showIcon={false} options={US_STATES} />
                <FieldInput name="zip" label="ZIP Code" required placeholder="Type" maxLength={5} />
              </div>
            </div>
          </section>

          <section>
            <h3 className="nb__section-title">Location Contact</h3>
            <div className="nb__stack">
              {Array.from({ length: contacts }, (_, k) => {
                const i = k + 1
                return (
                  <div key={i} className="nb__stack">
                    <div className="nb__row nb__row--2">
                      <FieldInput name={`name${i}`} label="Contact Name" required placeholder="Michael Scott" />
                      <FieldSelect name={`role${i}`} label="Role*" required showIcon={false} options={ROLES} />
                    </div>
                    <div className="nb__row nb__row--2">
                      <FieldInput name={`email${i}`} label="Contact Email Address" required placeholder="dundermifflin@nationsbenefits.com" />
                      <FieldMaskInput name={`phone${i}`} label="Phone Number" required mask={PHONE_MASK} placeholder="(123) 123-4567" />
                    </div>
                  </div>
                )
              })}
              <button type="button" className="nb__add" onClick={() => setContacts((c) => c + 1)}><span aria-hidden="true">+</span> Add another Contact</button>
            </div>
          </section>

          <section>
            <h3 className="nb__section-title">Hours of Operation</h3>
            <div className="nb__zone">
              <label>Time Zone
                <select value={zone} onChange={(e) => setZone(e.target.value)}><option value="" /> {ZONES.map((z) => <option key={z}>{z}</option>)}</select>
              </label>
              <button type="button" className="nb__link-btn" onClick={applyToAll}>Apply to All</button>
            </div>
            <div className="nb__hours">
              {DAYS.map((d, i) => (
                <div key={d} className="nb__day">
                  <span>{d}</span>
                  <select aria-label={`${d} opens`} disabled={hours[i].closed} value={hours[i].from} onChange={(e) => setDay(i, { from: e.target.value })}>
                    <option value="">00:00AM</option>{TIMES.map((t) => <option key={t}>{t}</option>)}
                  </select>
                  <select aria-label={`${d} closes`} disabled={hours[i].closed} value={hours[i].to} onChange={(e) => setDay(i, { to: e.target.value })}>
                    <option value="">00:00AM</option>{TIMES.map((t) => <option key={t}>{t}</option>)}
                  </select>
                  <label className="nb__check"><input type="checkbox" checked={hours[i].closed} onChange={(e) => setDay(i, { closed: e.target.checked })} /> Closed</label>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h3 className="nb__section-title">Accessibility &amp; Services</h3>
            <div className="nb__stack" style={{ gap: 12 }}>
              {ACCESS.map((a) => (
                <label key={a} className="nb__check">
                  <input type="checkbox" checked={access.includes(a)} onChange={() => setAccess((s) => (s.includes(a) ? s.filter((x) => x !== a) : [...s, a]))} /> {a}
                </label>
              ))}
            </div>
          </section>

          <div className="nb__submit" style={{ marginTop: 0 }}>
            <Button type="submit" variant="filled" size="medium" style={{ width: '100%' }}>Save Location</Button>
            {existing && <button type="button" className="nb__link-btn nb__remove" onClick={remove}>Remove location</button>}
          </div>
        </form>
      </CustomFormProvider>
    </NewBusinessLayout>
  )
}
