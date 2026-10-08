/**
 * The invitation email the DSO receives, shown inside a minimal mail-client
 * frame. "Begin Enrollment" is the entry point to the create-account flow.
 *
 * [DSO Name], [First Name] and [Last Name] stay as the placeholders from the
 * design: they are merge fields filled in by the sending system.
 */

import { Link } from 'react-router-dom'
import { NationsBenefitsLogo, NationsDentalLogo } from '../local-components'
import { MailIcon, PhoneIcon } from '../local-components/ContactIcons'
import './InvitationEmail.css'

const BENEFITS = [
  'Faster payment: spend less time waiting for claims processing and payments like fee for service, no clearinghouse required',
  'Real-time adjudication: know whether procedures are approved before the patient leaves the chair',
  'Online eligibility verification: no need to make calls',
  'Payment clarity at the point of care: show the patient what they owe that day',
  'Treatment history on file: your providers can build the treatment plan while the patient is with them',
  'Multi-location management: manage all of your practices and providers from a single organization registration',
]

const SUPPORT_EMAIL = 'dentalproviders@nationsbenefits.com'
const SUPPORT_PHONE = '1-844-313-2081'

export function InvitationEmail() {
  return (
    <div className="mail-client">
      <header className="mail-client__header">
        <h1 className="mail-client__subject">Register [DSO Name] for NationsDental Today</h1>
        <p className="mail-client__meta">
          <strong>NationsBenefits</strong> [email@email.com]
        </p>
        <p className="mail-client__meta">To: [First Name] [Last Name] [email@email.com]</p>
      </header>

      <div className="mail-client__canvas">
        <article className="email">
          <div className="email__brand">
            <NationsDentalLogo surface="light" height={18} />
          </div>

          <div className="email__card">
            <div className="email__banner">
              <div>
                <p className="email__banner-eyebrow">NationsDental</p>
                <h2 className="email__banner-title">Begin Your DSO Registration Today</h2>
              </div>
              <span className="email__banner-mark" aria-hidden="true">
                n
              </span>
            </div>

            <div className="email__body">
              <p>Dear [DSO Name],</p>

              <p>
                We’d like to introduce your organization to NationsDental. NationsBenefits is the
                largest supplemental benefits provider for Medicare Advantage plans in the country.
              </p>

              <p>
                Beginning January 1, more than 500,000 members will have dental coverage administered
                through NationsDental and may include patients at your affiliated practices.
              </p>

              <p>
                To support your organization, we’ve built the secure NationsDental portal. It’s
                designed to take the guesswork out of treating members and to simplify management
                across all of your locations, enabling:
              </p>

              <ul>
                {BENEFITS.map((benefit) => (
                  <li key={benefit}>{benefit}</li>
                ))}
              </ul>

              <p>
                In partnership with Careington, Dental Benefit Providers, and Guardian, we’ve
                pre-filled your organization and location information in your dedicated provider
                portal, from your credentialing file. You or your designated administrator just
                needs to confirm that the details for each location are correct and follow the
                prompts. It only takes a few minutes.
              </p>

              <p className="email__cta-note">
                You can click the link below to get started with your registration today.
              </p>

              <Link to="/create-account/email" className="email__cta">
                Begin Enrollment
              </Link>

              <p>
                Once you have registered, NationsDental will continue to send training materials as
                we get closer to going live on January 1. For your security, please use the{' '}
                <a className="email__link" href="#/create-account/email">
                  NationsDental Portal
                </a>{' '}
                to verify your practice info. We will never ask for your banking or other sensitive
                information via email or phone.
              </p>

              <h3 className="email__help-title">Need Help?</h3>
              <p style={{ marginBottom: 12 }}>
                Have questions or want us to walk your team through the process? Contact our Provider
                Services team:
              </p>
              <a className="email__contact" href={`mailto:${SUPPORT_EMAIL}`}>
                <MailIcon />
                {SUPPORT_EMAIL}
              </a>
              <a className="email__contact" href={`tel:${SUPPORT_PHONE.replace(/\D/g, '')}`}>
                <PhoneIcon />
                {SUPPORT_PHONE}
              </a>
              <p className="email__hours" style={{ marginTop: 12, marginBottom: 8 }}>
                Monday–Friday, 8:30 AM - 5:00 PM local time.
              </p>
              <p>We look forward to partnering with your practice.</p>

              <p className="email__signoff">
                Sincerely,
                <br />
                NationsBenefits Dental Team, NationsDental
              </p>
            </div>
          </div>

          <footer className="email__legal">
            <p>
              You are receiving this message because you requested more information from
              NationsBenefits. This message is intended for the above mentioned recipient. If you do
              not wish to receive future emails from NationsBenefits, click this{' '}
              <a href="#unsubscribe">link</a> to unsubscribe.
            </p>

            <div className="email__footer-logo">
              <NationsBenefitsLogo variant="dark" height={18} />
            </div>

            <p className="email__legal--address">1700 N University Dr., Plantation, FL 33322</p>
            <p className="email__legal--address">
              ©2024 NationsBenefits, LLC. All rights reserved. NationsBenefits is a registered
              trademark of NationsBenefits, LLC. Other marks are the property of their respective
              owners.
            </p>
          </footer>
        </article>
      </div>
    </div>
  )
}
