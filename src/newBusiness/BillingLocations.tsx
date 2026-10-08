/** New Business — step 2: Billing Locations (Figma 8229:130750 / 130766 / 132385 / 132402). */

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, CustomFormProvider, FieldInput, FieldMaskInput, FieldSelect, useForm } from 'nb-flexpay-ui'
import { NewBusinessLayout } from './NewBusinessLayout'
import { US_STATES } from '../enrollment/data/options'
import { NO_FIELD_ERRORS } from '../email-policy'

const ROLES = ['Owner', 'Administrator', 'Office Manager', 'Billing Manager', 'Other'].map((r) => ({ value: r, label: r }))
const PHONE_MASK = ['(', /\d/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]
const PHONE_PATTERN = /^\(\d{3}\) \d{3}-\d{4}$/
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const EXISTING = [
  { address: '1234 Main Street, Austin, TX 78701, USA', businesses: 'Business #1 · Business #3', contact: 'Susan Doe', details: 'susan@gmail.com · (123) 131-1389' },
  { address: '4567 Oak Avenue, Tampa, FL 33602, USA', businesses: 'Business #2', contact: 'Susan Doe', details: 'susan@gmail.com · (123) 131-1389' },
]

type Values = Record<string, unknown>
type Mode = 'new' | 'existing'
const text = (v: unknown) => String(v ?? '').trim()
const optionValue = (o: unknown) => (o as { value?: string } | null)?.value ?? ''

function contactErrors(values: Values, prefix: string, count: number, fail: (n: string, m: string) => void) {
  for (let i = 1; i <= count; i++) {
    if (!text(values[`${prefix}Name${i}`])) fail(`${prefix}Name${i}`, 'Enter the contact name.')
    if (!optionValue(values[`${prefix}Role${i}`])) fail(`${prefix}Role${i}`, 'Select a role.')
    const email = text(values[`${prefix}Email${i}`])
    if (!email) fail(`${prefix}Email${i}`, 'Enter the contact email address.')
    else if (!EMAIL_PATTERN.test(email)) fail(`${prefix}Email${i}`, 'Enter a valid email address.')
    const phone = text(values[`${prefix}Phone${i}`])
    if (!phone) fail(`${prefix}Phone${i}`, 'Enter the phone number.')
    else if (!PHONE_PATTERN.test(phone)) fail(`${prefix}Phone${i}`, 'Enter a valid phone number.')
  }
}

function validate(values: Values) {
  const errors: Record<string, { type: string; message: string }> = {}
  const fail = (name: string, message: string) => { errors[name] = { type: 'validate', message } }
  const mode = values.mode as Mode | ''

  if (mode === 'new') {
    contactErrors(values, 'n', Number(values.nCount) || 1, fail)
    if (!text(values.address1)) fail('address1', 'Enter the street address.')
    if (!text(values.city)) fail('city', 'Enter the city.')
    if (!optionValue(values.addressState)) fail('addressState', 'Select the state.')
    const zip = text(values.zip)
    if (!zip) fail('zip', 'Enter the ZIP code.')
    else if (!/^\d{5}$/.test(zip)) fail('zip', 'Enter a valid ZIP code.')
  }
  if (mode === 'existing' && !values[`same${values.loc}`]) {
    contactErrors(values, 'e', Number(values.eCount) || 1, fail)
  }
  return errors
}

function ContactFields({ prefix, count, onAdd }: { prefix: string; count: number; onAdd: () => void }) {
  return (
    <>
      {Array.from({ length: count }, (_, k) => {
        const i = k + 1
        return (
          <div key={i} className="nb__loc-form" style={{ padding: 0 }}>
            <div className="nb__row nb__row--2">
              <FieldInput name={`${prefix}Name${i}`} label="Contact Name" required placeholder="Michael Scott" />
              <FieldSelect name={`${prefix}Role${i}`} label="Role*" required showIcon={false} options={ROLES} />
            </div>
            <FieldInput name={`${prefix}Email${i}`} label="Contact Email Address" required placeholder="dundermifflin@nationsbenefits.com" />
            <FieldMaskInput name={`${prefix}Phone${i}`} label="Phone Number" required mask={PHONE_MASK} placeholder="(123) 123-4567" />
          </div>
        )
      })}
      <button type="button" className="nb__add" onClick={onAdd}><span aria-hidden="true">+</span> Add another Contact</button>
    </>
  )
}

export function BillingLocations() {
  const navigate = useNavigate()
  const [showError, setShowError] = useState(false)

  const methods = useForm<Values>({
    defaultValues: {
      mode: '', loc: 0, nCount: 1, eCount: 1, same0: true, same1: true,
      address1: '', address2: '', city: '', addressState: null, zip: '',
    },
    mode: 'onBlur',
    resolver: (values) => {
      const errors = validate(values)
      if (Object.keys(errors).length > 0) return { values: {}, errors }
      return { values, errors: NO_FIELD_ERRORS }
    },
  })

  const mode = methods.watch('mode') as Mode | ''
  const loc = Number(methods.watch('loc'))
  const nCount = Number(methods.watch('nCount'))
  const eCount = Number(methods.watch('eCount'))
  const same = [Boolean(methods.watch('same0')), Boolean(methods.watch('same1'))]

  const pick = (m: Mode) => { methods.setValue('mode', m); setShowError(false) }

  const onSubmit = methods.handleSubmit((values) => {
    if (!values.mode) { setShowError(true); return }
    sessionStorage.setItem('newBusinessBilling', JSON.stringify(values))
    navigate('/businesses/new/service')
  }, () => {})

  const submit = (e: React.FormEvent) => {
    if (!mode) { e.preventDefault(); setShowError(true); return }
    onSubmit(e)
  }

  return (
    <NewBusinessLayout
      active="Billing Locations"
      title="Billing Locations"
      description="Assign a billing location to each of your businesses. You can reuse the same location for multiple businesses."
      onBack={() => navigate('/businesses/new')}
    >
      <CustomFormProvider {...methods}>
        <form onSubmit={submit} noValidate>
          <p className="nb__question">How would you like to set up this billing location?</p>

          <div className="nb__options">
            <div className={`nb__opt${mode === 'new' ? ' is-on' : ''}`}>
              <button type="button" className="nb__opt-head" aria-pressed={mode === 'new'} onClick={() => pick('new')}>
                <span className="nb__radio" aria-hidden="true" />
                <span><span className="nb__opt-title">Add a different billing location</span><span className="nb__opt-sub">Enter a new billing address for this business</span></span>
              </button>
              {mode === 'new' && (
                <div className="nb__opt-body">
                  <ContactFields prefix="n" count={nCount} onAdd={() => methods.setValue('nCount', nCount + 1)} />
                  <div className="nb__divider" />
                  <FieldInput name="address1" label="Address Line 1" required placeholder="e.g. 1725 Slough Avenue" />
                  <FieldInput name="address2" label="Address Line 2" placeholder="e.g. Suite 200" />
                  <div className="nb__row nb__row--3">
                    <FieldInput name="city" label="City" required placeholder="Miami" />
                    <FieldSelect name="addressState" label="State*" required showIcon={false} options={US_STATES} />
                    <FieldInput name="zip" label="ZIP Code" required placeholder="33133" maxLength={5} />
                  </div>
                </div>
              )}
            </div>

            <div className={`nb__opt${mode === 'existing' ? ' is-on' : ''}`}>
              <button type="button" className="nb__opt-head" aria-pressed={mode === 'existing'} onClick={() => pick('existing')}>
                <span className="nb__radio" aria-hidden="true" />
                <span><span className="nb__opt-title">Use an existing billing location</span><span className="nb__opt-sub">Reuse a billing location you've already entered</span></span>
              </button>
              {mode === 'existing' && (
                <div className="nb__opt-body">
                  <div className="nb__list-head"><span>Select Billing Location</span><span>{EXISTING.length} Locations</span></div>
                  {EXISTING.map((l, i) => (
                    <div key={l.address} className={`nb__loc${loc === i ? ' is-on' : ''}`} onClick={() => methods.setValue('loc', i)}>
                      <div className="nb__loc-top">
                        <div><strong>{l.address}</strong><small>{l.businesses}</small></div>
                        {loc === i && (
                          <span className="nb__tick" aria-label="Selected">
                            <svg width="8" height="8" viewBox="0 0 8 8" fill="none" stroke="#fff" strokeWidth="1.4"><path d="M1.5 4.2l1.8 1.8L6.5 2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                          </span>
                        )}
                      </div>
                      <div className="nb__loc-contact">
                        {same[i] && <div><strong>{l.contact}</strong><small>{l.details}</small></div>}
                        <label className="nb__same" style={{ marginLeft: 'auto' }} onClick={(e) => e.stopPropagation()}>
                          <button
                            type="button"
                            role="switch"
                            aria-checked={same[i]}
                            className={`nb__switch${same[i] ? ' is-on' : ''}`}
                            onClick={() => { methods.setValue(`same${i}`, !same[i]); methods.setValue('loc', i) }}
                          />
                          Same Contact
                        </label>
                      </div>
                      {loc === i && !same[i] && (
                        <div className="nb__loc-form" onClick={(e) => e.stopPropagation()}>
                          <ContactFields prefix="e" count={eCount} onAdd={() => methods.setValue('eCount', eCount + 1)} />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          {showError && <p className="nb__error">Select how you would like to set up this billing location.</p>}

          <div className="nb__submit">
            <Button type="submit" variant="filled" size="medium" style={{ width: '100%' }}>Continue</Button>
          </div>
        </form>
      </CustomFormProvider>
    </NewBusinessLayout>
  )
}
