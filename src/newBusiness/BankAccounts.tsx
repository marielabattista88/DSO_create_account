/** New Business — step 5: Bank Accounts (Figma 2257:83638). Only "Complete After Approval" is enabled for now. */

import { useNavigate } from 'react-router-dom'
import { Button } from 'nb-flexpay-ui'
import { NewBusinessLayout } from './NewBusinessLayout'

const OPTIONS = [
  { title: 'One Bank Account For All Service Locations', sub: 'Use the same bank account to receive payments for all your service locations.' },
  { title: 'Different Bank Accounts By Service Location', sub: 'Link multiple bank accounts and choose which service locations should use each account.' },
]

export function BankAccounts() {
  const navigate = useNavigate()

  return (
    <NewBusinessLayout
      active="Bank Accounts"
      title="Bank Accounts"
      description={
        <>
          Choose how you'd like to set up bank accounts for your service locations.<br />
          <span className="nb__learn">Learn How NationsBenefits Connects Your Bank Accounts</span>
        </>
      }
      onBack={() => navigate('/businesses/new/providers')}
    >
      <h3 className="nb__bank-q">How would you like structure payouts?</h3>
      <div className="nb__options">
        {OPTIONS.map((o) => (
          <div key={o.title} className="nb__opt is-disabled" aria-disabled="true">
            <div className="nb__opt-head">
              <span className="nb__radio" aria-hidden="true" />
              <span><span className="nb__opt-title">{o.title}</span><span className="nb__opt-sub">{o.sub}</span></span>
            </div>
          </div>
        ))}
      </div>

      <div className="nb__helper">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true"><circle cx="7" cy="7" r="6" /><path d="M7 6.2V10M7 4v.1" strokeLinecap="round" /></svg>
        <span>
          You can request a manual bank form. Your request will be reviewed, and if approved, you'll receive a link to complete your bank account information.<br />
          <u>Request Manual Form</u>
        </span>
      </div>

      <div className="nb__bank-actions">
        <Button type="button" variant="filled" size="medium" disabled style={{ width: '100%' }}>Continue</Button>
        <button type="button" className="nb__link-btn" onClick={() => navigate('/businesses/new/review')}>Complete After Approval</button>
      </div>
    </NewBusinessLayout>
  )
}
