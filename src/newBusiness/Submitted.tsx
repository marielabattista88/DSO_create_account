/** New Business — enrollment submitted confirmation (Figma 8229:239071). */

import { useNavigate } from 'react-router-dom'
import { Button } from 'nb-flexpay-ui'
import { NewBusinessLayout } from './NewBusinessLayout'

const NEXT = ['Application Received', 'Credentialing Review Initiated', 'Additional Information Requested (if needed)', 'Enrollment Status Communicated']
const DRAFT_KEYS = ['newBusinessDraft', 'newBusinessBilling', 'newBusinessServiceLocations', 'newBusinessProviders']

export function Submitted() {
  const navigate = useNavigate()

  const goToPortal = () => {
    let draft: Record<string, string> = {}
    try { draft = JSON.parse(sessionStorage.getItem('newBusinessDraft') ?? '{}') } catch { /* no draft */ }
    const list = JSON.parse(sessionStorage.getItem('submittedBusinesses') ?? '[]')
    list.unshift({
      legal: draft.legalName || 'Bright Smile Dental Group LLC',
      dba: draft.dba || draft.legalName || 'Bright Smile Dental Group LLC',
      tin: draft.tin || '14-873284894',
      npi: draft.npi || 'N/A',
      status: 'Under Review',
    })
    sessionStorage.setItem('submittedBusinesses', JSON.stringify(list))
    DRAFT_KEYS.forEach((k) => sessionStorage.removeItem(k))
    navigate('/businesses', { state: { submitted: true } })
  }

  return (
    <NewBusinessLayout plain active="Review And Submit" title="">
      <div className="nb__done">
        <div className="nb__done-badge">
          <span><svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="#fff" strokeWidth="2" aria-hidden="true"><path d="M4 9.5l3.2 3.2L14 5.8" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
        </div>
        <h2>Your Enrollment was Submitted Successfully!</h2>
        <p>Your application is in - we'll take it from here.<br />Expect to hear from us within <strong>3-5 business days.</strong></p>
        <hr />
        <div className="nb__done-info">
          <h3>What's next?</h3>
          <ul>
            {NEXT.map((n) => <li key={n}>✓ {n}</li>)}
            <li className="sub">• If we require any additional information, our team will reach out.</li>
          </ul>
          <h3>Need Help?</h3>
          <div>If you have any questions about the status of your application, please contact:</div>
          <a href="mailto:network@nationshearing.com">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1" aria-hidden="true"><rect x="1" y="2.5" width="10" height="7" rx="1" /><path d="M1.5 3l4.5 3.5L10.5 3" /></svg>
            network@nationshearing.com
          </a>
        </div>
        <div className="nb__submit">
          <Button type="button" variant="filled" size="medium" style={{ width: '100%' }} onClick={goToPortal}>Go to Portal</Button>
        </div>
      </div>
    </NewBusinessLayout>
  )
}
