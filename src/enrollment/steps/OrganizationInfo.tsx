/**
 * Step 4 — Tell Us About Your Organization.
 *
 * The sole-proprietorship toggle decides which tax ID is asked for: an EIN is
 * XX-XXXXXXX, an ITIN is XXX-XX-XXXX. Every required field is checked in one
 * pass so Continue on an empty form reports everything at once.
 */

import { useNavigate } from 'react-router-dom'
import {
  Button,
  CustomFormProvider,
  FieldInput,
  FieldMaskInput,
  FieldSelect,
  useForm,
} from 'nb-flexpay-ui'
import { AuthLayout } from '../components/AuthLayout'
import { PrimaryAction } from '../components/PrimaryAction'
import { useEnrollment } from '../data/store'
import { US_STATES } from '../data/options'
import { EIN_MASK, ITIN_MASK } from '../data/masks'
import { NO_FIELD_ERRORS } from '../../email-policy'

const EIN_PATTERN = /^\d{2}-\d{7}$/
const ITIN_PATTERN = /^\d{3}-\d{2}-\d{4}$/
const ZIP_PATTERN = /^\d{5}$/

interface OrganizationFormValues {
  legalName: string
  dba: string
  tin: string
  soleProprietorship: boolean
  address1: string
  address2: string
  city: string
  addressState: { value: string; label: string } | null
  zip: string
}

const optionValue = (option: unknown) => (option as { value?: string } | null)?.value ?? ''

function organizationErrors(values: OrganizationFormValues) {
  const errors: Record<string, { type: string; message: string }> = {}
  const fail = (name: string, message: string) => {
    errors[name] = { type: 'validate', message }
  }

  if (!String(values.legalName ?? '').trim()) fail('legalName', 'Enter your legal entity name.')
  if (!String(values.dba ?? '').trim()) fail('dba', 'Enter your doing business as name.')

  const sole = Boolean(values.soleProprietorship)
  const taxIdName = sole ? 'ITIN' : 'TIN/EIN'
  const tin = String(values.tin ?? '').trim()
  if (!tin) fail('tin', `Enter your ${taxIdName}.`)
  else if (!(sole ? ITIN_PATTERN : EIN_PATTERN).test(tin)) fail('tin', `Enter a valid ${taxIdName}.`)

  if (!String(values.address1 ?? '').trim()) fail('address1', 'Enter your street address.')
  if (!String(values.city ?? '').trim()) fail('city', 'Enter your city.')
  if (!optionValue(values.addressState)) fail('addressState', 'Select your state.')

  const zip = String(values.zip ?? '').trim()
  if (!zip) fail('zip', 'Enter your ZIP code.')
  else if (!ZIP_PATTERN.test(zip)) fail('zip', 'Enter a valid ZIP code.')

  return errors
}

export function OrganizationInfo() {
  const navigate = useNavigate()
  const { state, patch } = useEnrollment()
  const org = state.organization

  const methods = useForm<OrganizationFormValues>({
    defaultValues: {
      legalName: org.legalName,
      dba: org.dba,
      tin: org.tin,
      soleProprietorship: org.soleProprietorship,
      address1: org.address1,
      address2: org.address2,
      city: org.city,
      // FieldSelect keeps the whole option object in form state, not the value.
      addressState: US_STATES.find((s) => s.value === org.state) ?? null,
      zip: org.zip,
    },
    mode: 'onBlur',
    resolver: (values) => {
      const errors = organizationErrors(values)
      if (Object.keys(errors).length > 0) return { values: {}, errors }
      return { values, errors: NO_FIELD_ERRORS }
    },
  })

  const sole = Boolean(methods.watch('soleProprietorship'))
  const taxIdLabel = sole ? 'ITIN' : 'TIN/EIN'

  const onSubmit = methods.handleSubmit((values) => {
    patch({
      organization: {
        legalName: String(values.legalName).trim(),
        dba: String(values.dba).trim(),
        tin: String(values.tin).trim(),
        soleProprietorship: Boolean(values.soleProprietorship),
        address1: String(values.address1).trim(),
        address2: String(values.address2 ?? '').trim(),
        city: String(values.city).trim(),
        state: optionValue(values.addressState),
        zip: String(values.zip).trim(),
      },
    })
    navigate('/create-account/organization-found')
  })

  return (
    <AuthLayout
      step={4}
      signedIn
      onSignOut={() => navigate('/create-account/email')}
      title="Tell Us About Your Organization"
      description="Add a few details about your dental support organization (DSO) so we can set up your account."
    >
      <CustomFormProvider {...methods}>
        <form onSubmit={onSubmit} noValidate>
          <div className="flex flex-col gap-4">
            <FieldInput name="legalName" label="Legal Entity Name" required placeholder="e.g Dunder Mifflin, Inc" />
            <FieldInput name="dba" label="Doing Business As (DBA)" required />
            <FieldMaskInput
              key={taxIdLabel}
              name="tin"
              label={taxIdLabel}
              required
              mask={sole ? ITIN_MASK : EIN_MASK}
              placeholder={sole ? '555-55-5555' : '55-55555555'}
            />

            <FieldInput name="address1" label="Registered address Line 1" required placeholder="e.g 1725 Slough Avenue" />
            <FieldInput name="address2" label="Registered address Line 2" placeholder="e.g. Suite 1450" />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="min-w-0">
                <FieldInput name="city" label="City" required placeholder="Miami" />
              </div>
              <div className="min-w-0">
                <FieldSelect name="addressState" label="State*" required showIcon={false} options={US_STATES} />
              </div>
              <div className="min-w-0">
                <FieldInput name="zip" label="ZIP Code" required placeholder="33131" maxLength={5} />
              </div>
            </div>
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
