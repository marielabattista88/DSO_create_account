/**
 * Step 6 — Billing Location.
 *
 * Billing address first, then the billing contact. "Same Registered address"
 * copies the address typed in step 4 into the fields (they stay editable).
 */

import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Button,
  CustomFormProvider,
  FieldInput,
  FieldMaskInput,
  FieldSelect,
  FieldToggle,
  useForm,
} from 'nb-flexpay-ui'
import { AuthLayout } from '../components/AuthLayout'
import { PrimaryAction } from '../components/PrimaryAction'
import { useEnrollment } from '../data/store'
import { US_STATES } from '../data/options'
import { NO_FIELD_ERRORS } from '../../email-policy'

const ROLES = ['Owner', 'Administrator', 'Office Manager', 'Billing Manager', 'Other'].map((r) => ({
  value: r,
  label: r,
}))

const PHONE_MASK = [
  '(', /\d/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/,
]
const PHONE_PATTERN = /^\(\d{3}\) \d{3}-\d{4}$/
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const ZIP_PATTERN = /^\d{5}$/

type Values = Record<string, unknown>

const text = (v: unknown) => String(v ?? '').trim()
const optionValue = (option: unknown) => (option as { value?: string } | null)?.value ?? ''

function billingErrors(values: Values) {
  const errors: Record<string, { type: string; message: string }> = {}
  const fail = (name: string, message: string) => {
    errors[name] = { type: 'validate', message }
  }

  if (!text(values.address1)) fail('address1', 'Enter your street address.')
  if (!text(values.city)) fail('city', 'Enter your city.')
  if (!optionValue(values.addressState)) fail('addressState', 'Select your state.')

  const zip = text(values.zip)
  if (!zip) fail('zip', 'Enter your ZIP code.')
  else if (!ZIP_PATTERN.test(zip)) fail('zip', 'Enter a valid ZIP code.')

  if (!text(values.contactName)) fail('contactName', 'Enter the contact name.')
  if (!optionValue(values.contactRole)) fail('contactRole', 'Select a role.')

  const email = text(values.contactEmail)
  if (!email) fail('contactEmail', 'Enter the contact email address.')
  else if (!EMAIL_PATTERN.test(email)) fail('contactEmail', 'Enter a valid email address.')

  const phone = text(values.contactPhone)
  if (!phone) fail('contactPhone', 'Enter the phone number.')
  else if (!PHONE_PATTERN.test(phone)) fail('contactPhone', 'Enter a valid phone number.')

  return errors
}

export function BillingLocations() {
  const navigate = useNavigate()
  const { state } = useEnrollment()
  const org = state.organization

  const methods = useForm<Values>({
    defaultValues: {
      sameAddress: false,
      address1: '',
      address2: '',
      city: '',
      addressState: null,
      zip: '',
    },
    mode: 'onBlur',
    resolver: (values) => {
      const errors = billingErrors(values)
      if (Object.keys(errors).length > 0) return { values: {}, errors }
      return { values, errors: NO_FIELD_ERRORS }
    },
  })

  const same = Boolean(methods.watch('sameAddress'))
  const firstRender = useRef(true)

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
      return
    }
    const next = same
      ? {
          address1: org.address1,
          address2: org.address2,
          city: org.city,
          addressState: US_STATES.find((s) => s.value === org.state) ?? null,
          zip: org.zip,
        }
      : { address1: '', address2: '', city: '', addressState: null, zip: '' }
    Object.entries(next).forEach(([name, value]) => methods.setValue(name, value))
  }, [same]) // eslint-disable-line react-hooks/exhaustive-deps

  const onSubmit = methods.handleSubmit(() => navigate('/create-account/ready'))

  return (
    <AuthLayout
      step={6}
      signedIn
      onSignOut={() => navigate('/create-account/email')}
      title="Billing Location"
      titleAside={
        <CustomFormProvider {...methods}>
          <FieldToggle name="sameAddress" label="Same Registered address" />
        </CustomFormProvider>
      }
    >
      <CustomFormProvider {...methods}>
        <form onSubmit={onSubmit} noValidate>
          <div className="flex flex-col gap-4">
            <FieldInput name="address1" label="Address Line 1" required placeholder="e.g Suite 200" />
            <FieldInput name="address2" label="Address Line 2" placeholder="e.g Suite 200" />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="min-w-0">
                <FieldInput name="city" label="City" required placeholder="Miami" />
              </div>
              <div className="min-w-0">
                <FieldSelect name="addressState" label="State*" required showIcon={false} options={US_STATES} />
              </div>
              <div className="min-w-0">
                <FieldInput name="zip" label="ZIP Code" required placeholder="333133" maxLength={5} />
              </div>
            </div>

            <hr style={{ border: 0, borderTop: '1px solid var(--nb-grey-200)', margin: '8px 0' }} />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="min-w-0">
                <FieldInput name="contactName" label="Contact Name" required placeholder="Michael Scott" />
              </div>
              <div className="min-w-0">
                <FieldSelect name="contactRole" label="Role*" required showIcon={false} options={ROLES} />
              </div>
            </div>
            <FieldInput
              name="contactEmail"
              label="Contact Email Address"
              required
              placeholder="dundermifflin@nationsbenefits.com"
            />
            <FieldMaskInput
              name="contactPhone"
              label="Phone Number"
              required
              mask={PHONE_MASK}
              placeholder="(123) 123-4567"
            />
          </div>

          <PrimaryAction>
            <Button type="submit" variant="filled" size="medium" style={{ width: '100%' }}>
              Continue
            </Button>
          </PrimaryAction>
        </form>
      </CustomFormProvider>
    </AuthLayout>
  )
}
