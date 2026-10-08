/**
 * Final screen — Your Organization's Account Is Ready!
 *
 * No step rail: account creation is done. The only action is to go to the
 * portal, so there is a single button.
 */

import { useNavigate } from 'react-router-dom'
import { Button } from 'nb-flexpay-ui'
import { AuthLayout } from '../components/AuthLayout'
import { PrimaryAction } from '../components/PrimaryAction'
import { StatusAnimation } from '../../local-components'
import { MailIcon, PhoneIcon } from '../../local-components/ContactIcons'
import { useEnrollment } from '../data/store'

const NEXT_STEPS = [
  'Account created',
  'Review your organization and business details',
  'Add any missing businesses or locations',
  'Confirm providers and complete your enrollment',
]

const SUPPORT_EMAIL = 'dentalproviders@nationsbenefits.com'
const SUPPORT_PHONE = '844.313.2081'

const sectionTitle: React.CSSProperties = {
  margin: 0,
  fontSize: 16,
  fontWeight: 700,
  color: 'var(--nb-woodsmoke)',
}

const smallText: React.CSSProperties = { fontSize: 14, color: 'var(--nb-grey-800)', margin: 0 }

export function AccountReady() {
  const navigate = useNavigate()
  const { state } = useEnrollment()
  const { organization } = state
  const maskedTin = organization.tin ? `••-••••${organization.tin.replace(/\D/g, '').slice(-4)}` : ''

  return (
    <AuthLayout
      align="center"
      signedIn
      onSignOut={() => navigate('/create-account/email')}
      aboveTitle={<StatusAnimation status="success" size={72} />}
      title="Your Organization’s Account Is Ready!"
      belowTitle={
        organization.legalName ? (
          <span
            style={{
              fontSize: 14,
              color: 'var(--nb-grey-900)',
              background: 'var(--nb-sky-blue)',
              borderRadius: 6,
              padding: '6px 16px',
            }}
          >
            {organization.legalName}
            {maskedTin ? ` · TIN ${maskedTin}` : ''}
          </span>
        ) : null
      }
      description="Next, review and complete your organization and location information to finish your enrollment."
    >
      <div style={{ height: 8 }} />

      <section style={{ marginBottom: 16 }}>
        <h2 style={sectionTitle}>What’s next?</h2>
        <ul className="m-0 list-none p-0" style={{ marginTop: 4 }}>
          {NEXT_STEPS.map((item) => (
            <li key={item} style={smallText}>
              ✓ {item}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 style={sectionTitle}>Need Help?</h2>
        <p style={{ ...smallText, margin: '4px 0 8px' }}>
          Questions about your account or enrollment? Contact our Provider Services team:
        </p>
        <p style={{ ...smallText, display: 'flex', alignItems: 'center', gap: 8 }}>
          <MailIcon />
          <a href={`mailto:${SUPPORT_EMAIL}`} style={{ color: 'inherit' }}>
            {SUPPORT_EMAIL}
          </a>
        </p>
        <p style={{ ...smallText, display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
          <PhoneIcon />
          <a href={`tel:${SUPPORT_PHONE.replace(/\D/g, '')}`} style={{ color: 'inherit' }}>
            {SUPPORT_PHONE}
          </a>
        </p>
      </section>

      <PrimaryAction>
        <Button type="button" variant="filled" size="medium" style={{ width: '100%' }} onClick={() => navigate('/home')}>
          Go to NationsDental Portal
        </Button>
      </PrimaryAction>
    </AuthLayout>
  )
}
