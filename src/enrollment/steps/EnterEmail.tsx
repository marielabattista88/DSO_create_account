/**
 * Step 1 — Let's Start by Entering an Email Address.
 *
 * Reached from "Begin Enrollment" in the invitation email. The address can come
 * prefilled in the link (?email=…), which saves the DSO from retyping it.
 */

import { useNavigate, useSearchParams } from 'react-router-dom'
import { Button, CustomFormProvider, FieldInput, useForm } from 'nb-flexpay-ui'
import { AuthLayout } from '../components/AuthLayout'
import { PrimaryAction } from '../components/PrimaryAction'
import { useEnrollment } from '../data/store'
import { NO_FIELD_ERRORS, emailError } from '../../email-policy'

interface EmailFormValues {
  firstName: string
  lastName: string
  email: string
}

export function EnterEmail() {
  const navigate = useNavigate()
  const { state, patch } = useEnrollment()
  const [params] = useSearchParams()

  const methods = useForm<EmailFormValues>({
    defaultValues: {
      firstName: state.firstName,
      lastName: state.lastName,
      email: state.email || params.get('email') || '',
    },
    mode: 'onBlur',
    // A resolver also runs on blur, so a bad address is called out when the
    // user leaves the field and not only after pressing Continue.
    resolver: (values) => {
      const errors: Record<string, { type: string; message: string }> = {}
      if (!String(values.firstName ?? '').trim())
        errors.firstName = { type: 'validate', message: 'Enter your first name.' }
      if (!String(values.lastName ?? '').trim())
        errors.lastName = { type: 'validate', message: 'Enter your last name.' }
      const message = emailError(values.email)
      if (message) errors.email = { type: 'validate', message }

      if (Object.keys(errors).length > 0) return { values: {}, errors }
      return { values, errors: NO_FIELD_ERRORS }
    },
  })

  const onSubmit = methods.handleSubmit((values) => {
    patch({
      firstName: String(values.firstName).trim(),
      lastName: String(values.lastName).trim(),
      email: String(values.email).trim(),
    })
    navigate('/create-account/verify-email')
  })

  return (
    <AuthLayout
      step={1}
      size="narrow"
      showLogoInCard
      title="Let’s Start by Entering an Email Address"
      description="We’ll use this email to set up your account and send you a verification code."
    >
      <CustomFormProvider {...methods}>
        <form onSubmit={onSubmit} noValidate>
          <div className="flex flex-col gap-4">
            <FieldInput name="firstName" label="First Name" required placeholder="John" autoComplete="given-name" />
            <FieldInput name="lastName" label="Last Name" required placeholder="Doe" autoComplete="family-name" />
            <FieldInput
              name="email"
              label="Email"
              required
              type="email"
              autoComplete="email"
              placeholder="you@yourpractice.com"
            />
          </div>

          <PrimaryAction>
            <Button type="submit" variant="filled" size="medium" style={{ width: '100%' }}>
              Continue
            </Button>
          </PrimaryAction>
        </form>
      </CustomFormProvider>

      <p style={{ fontSize: 14, color: 'var(--nb-grey-700)', margin: '24px 0 0', textAlign: 'center' }}>
        Already have an account?{' '}
        <button
          type="button"
          className="cursor-pointer border-0 bg-transparent p-0"
          style={{ fontSize: 14, fontWeight: 600, color: 'var(--nb-navy)' }}
        >
          Sign In
        </button>
      </p>
    </AuthLayout>
  )
}
