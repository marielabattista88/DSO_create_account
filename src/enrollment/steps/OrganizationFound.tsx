/**
 * Step 5 — We Found Your Organization's Record.
 *
 * Prototype: the record shown is what the DSO typed in step 4. The real flow
 * will show the record matched by TIN in the credentialing file.
 */

import { useNavigate } from 'react-router-dom'
import { Button } from 'nb-flexpay-ui'
import dentalIcon from '../assets/dental.svg'
import { AuthLayout } from '../components/AuthLayout'
import { PrimaryAction } from '../components/PrimaryAction'
import { useEnrollment } from '../data/store'

export function OrganizationFound() {
  const navigate = useNavigate()
  const { state } = useEnrollment()
  const { organization } = state

  return (
    <AuthLayout
      step={5}
      signedIn
      onSignOut={() => navigate('/create-account/email')}
      title="We Found Your Organization’s Record!"
      description={
        <>
          We found a record associated with this TIN.{' '}
          <strong>Make sure it’s correct before continuing.</strong> You’ll be able to edit your
          organization’s information if needed, but the TIN cannot be changed once submitted.
        </>
      }
    >
      <div
        className="flex items-center"
        style={{
          gap: 16,
          padding: 16,
          border: '1px solid var(--nb-grey-200)',
          borderRadius: 'var(--nb-radius)',
          background: 'var(--nb-ghost-white)',
        }}
      >
        <img src={dentalIcon} alt="" width={32} height={32} />
        <div className="flex min-w-0 flex-col" style={{ gap: 2 }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--nb-navy)' }}>Business</span>
          <span style={{ fontSize: 16, fontWeight: 600, color: 'var(--nb-woodsmoke)' }}>
            {organization.legalName}
          </span>
          <span
            style={{
              alignSelf: 'flex-start',
              fontSize: 12,
              fontWeight: 600,
              color: 'var(--nb-navy)',
              background: 'var(--nb-neutral-subtle)',
              borderRadius: 4,
              padding: '2px 8px',
            }}
          >
            TIN {organization.tin}
          </span>
        </div>
      </div>

      <PrimaryAction>
        <Button
          type="button"
          variant="filled"
          size="medium"
          style={{ width: '100%' }}
          onClick={() => navigate('/create-account/ready')}
        >
          Continue
        </Button>
      </PrimaryAction>

      <p style={{ margin: '24px 0 0', textAlign: 'center' }}>
        <button
          type="button"
          onClick={() => navigate('/create-account/organization')}
          className="cursor-pointer border-0 bg-transparent p-0"
          style={{ fontSize: 14, fontWeight: 600, color: 'var(--nb-navy)', textDecoration: 'underline' }}
        >
          Not your organization? Click here to return to Step 4.
        </button>
      </p>
    </AuthLayout>
  )
}
