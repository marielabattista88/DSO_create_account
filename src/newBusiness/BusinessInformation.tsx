/** New Business — step 1: Business Information (Figma 8229:130462). */

import { useNavigate } from 'react-router-dom'
import { Button, CustomFormProvider, FieldInput, FieldMaskInput, FieldSelect, FieldToggle, useForm } from 'nb-flexpay-ui'
import { NewBusinessLayout } from './NewBusinessLayout'
import { US_STATES } from '../enrollment/data/options'
import { EIN_MASK, ITIN_MASK } from '../enrollment/data/masks'
import { NO_FIELD_ERRORS } from '../email-policy'

const EIN_PATTERN = /^\d{2}-\d{7}$/
const ITIN_PATTERN = /^\d{3}-\d{2}-\d{4}$/

interface Values {
  legalName: string
  dba: string
  soleProprietorship: boolean
  tin: string
  npi: string
  address1: string
  address2: string
  city: string
  addressState: { value: string; label: string } | null
  zip: string
}

const optionValue = (o: unknown) => (o as { value?: string } | null)?.value ?? ''

function validate(v: Values) {
  const errors: Record<string, { type: string; message: string }> = {}
  const fail = (name: string, message: string) => { errors[name] = { type: 'validate', message } }
  if (!String(v.legalName ?? '').trim()) fail('legalName', 'Enter the legal entity name.')
  if (!String(v.dba ?? '').trim()) fail('dba', 'Enter the doing business as name.')

  const sole = Boolean(v.soleProprietorship)
  const label = sole ? 'ITIN' : 'TIN/EIN'
  const tin = String(v.tin ?? '').trim()
  if (!tin) fail('tin', `Enter the ${label}.`)
  else if (!(sole ? ITIN_PATTERN : EIN_PATTERN).test(tin)) fail('tin', `Enter a valid ${label}.`)

  const npi = String(v.npi ?? '').trim()
  if (!npi) fail('npi', 'Enter the NPI.')
  else if (!/^\d{10}$/.test(npi)) fail('npi', 'NPI must have 10 digits.')

  if (!String(v.address1 ?? '').trim()) fail('address1', 'Enter the street address.')
  if (!String(v.city ?? '').trim()) fail('city', 'Enter the city.')
  if (!optionValue(v.addressState)) fail('addressState', 'Select the state.')
  const zip = String(v.zip ?? '').trim()
  if (!zip) fail('zip', 'Enter the ZIP code.')
  else if (!/^\d{5}$/.test(zip)) fail('zip', 'Enter a valid ZIP code.')
  return errors
}

export function BusinessInformation() {
  const navigate = useNavigate()
  const methods = useForm<Values>({
    defaultValues: {
      legalName: '', dba: '', soleProprietorship: false, tin: '', npi: '',
      address1: '', address2: '', city: '', addressState: null, zip: '',
    },
    mode: 'onBlur',
    resolver: (values) => {
      const errors = validate(values)
      if (Object.keys(errors).length > 0) return { values: {}, errors }
      return { values, errors: NO_FIELD_ERRORS }
    },
  })

  const sole = Boolean(methods.watch('soleProprietorship'))
  const taxIdLabel = sole ? 'ITIN' : 'TIN/EIN'

  const onSubmit = methods.handleSubmit((values) => {
    sessionStorage.setItem('newBusinessDraft', JSON.stringify(values))
    navigate('/businesses/new/billing')
  })

  return (
    <NewBusinessLayout
      active="Business Information"
      title="Business Information"
      description="Add your business information to begin enrollment."
    >
      <CustomFormProvider {...methods}>
        <form className="nb__form" onSubmit={onSubmit} noValidate>
          <FieldInput name="legalName" label="Legal Entity Name" required placeholder="e.g. Dunder Mifflin, Inc" />
          <FieldInput name="dba" label="Doing Business As (DBA)" required placeholder="e.g. Dunder Mifflin, Inc" />
          <FieldToggle name="soleProprietorship" label="Is This a Sole Proprietorship?" />

          <div className="nb__row nb__row--2">
            <FieldMaskInput
              key={taxIdLabel}
              name="tin"
              label={taxIdLabel}
              required
              mask={sole ? ITIN_MASK : EIN_MASK}
              placeholder={sole ? '555-55-5555' : '55-5555555'}
            />
            <FieldInput name="npi" label="NPI" required placeholder="1234567890" maxLength={10} />
          </div>

          <FieldInput name="address1" label="Address Line 1" required placeholder="e.g. 1725 Slough Avenue" />
          <FieldInput name="address2" label="Address Line 2" placeholder="Suite 1450" />

          <div className="nb__row nb__row--3">
            <FieldInput name="city" label="City" required placeholder="Miami" />
            <FieldSelect name="addressState" label="State*" required showIcon={false} options={US_STATES} />
            <FieldInput name="zip" label="ZIP Code" required placeholder="33131" maxLength={5} />
          </div>

          <div className="nb__submit">
            <Button type="submit" variant="filled" size="medium" style={{ width: '100%' }}>Continue</Button>
          </div>
        </form>
      </CustomFormProvider>
    </NewBusinessLayout>
  )
}
