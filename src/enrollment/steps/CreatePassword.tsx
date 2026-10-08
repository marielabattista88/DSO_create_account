/**
 * Step 3 — Create Your Password.
 *
 * The policy, the live checklist and the show/hide eye come from
 * local-components/PasswordField. The checklist sits between the two fields so
 * it reads as feedback on what was just typed.
 */

import { useNavigate } from 'react-router-dom'
import { Button, CustomFormProvider, useForm } from 'nb-flexpay-ui'
import { PasswordInput, PasswordRuleList, passwordMeetsPolicy } from '../../local-components'
import { AuthLayout } from '../components/AuthLayout'
import { PrimaryAction } from '../components/PrimaryAction'

export function CreatePassword() {
  const navigate = useNavigate()
  const methods = useForm({ defaultValues: { password: '', confirmPassword: '' }, mode: 'onBlur' })
  // watch() is the only way to see the value as it is typed: FieldInput spreads
  // register(name) after the caller's props, so a passed onChange never fires.
  const password = String(methods.watch('password') ?? '')

  const onSubmit = methods.handleSubmit((values) => {
    const value = String(values.password ?? '')
    const confirm = String(values.confirmPassword ?? '')

    if (!passwordMeetsPolicy(value)) {
      methods.setError('password', { message: 'Your password does not meet all requirements.' })
      return
    }
    if (value !== confirm) {
      methods.setError('confirmPassword', { message: 'Passwords must match.' })
      return
    }

    navigate('/create-account/organization')
  })

  return (
    <AuthLayout
      step={3}
      title="Create Your Password"
      description="Set a password to secure the email address associated with your account."
    >
      <CustomFormProvider {...methods}>
        <form onSubmit={onSubmit} noValidate>
          <div className="flex flex-col gap-4">
            <PasswordInput name="password" label="New Password" />
            <PasswordRuleList password={password} />
            <PasswordInput name="confirmPassword" label="Confirm Password" />
          </div>

          <PrimaryAction>
            <Button type="submit" variant="filled" size="medium" style={{ width: '100%' }}>
              Create Password
            </Button>
          </PrimaryAction>
        </form>
      </CustomFormProvider>
    </AuthLayout>
  )
}
