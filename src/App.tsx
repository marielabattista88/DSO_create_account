import { HashRouter, Navigate, Route, Routes } from 'react-router-dom'
import { EnrollmentProvider } from './enrollment/data/store'
import { InvitationEmail } from './email/InvitationEmail'
import { EnterEmail } from './enrollment/steps/EnterEmail'
import { VerifyEmail } from './enrollment/steps/VerifyEmail'
import { CreatePassword } from './enrollment/steps/CreatePassword'
import { OrganizationInfo } from './enrollment/steps/OrganizationInfo'
import { OrganizationFound } from './enrollment/steps/OrganizationFound'
import { BillingLocations } from './enrollment/steps/BillingLocations'
import { Dashboard } from './portal/Dashboard'
import { MyBusinesses } from './portal/MyBusinesses'
import { UsersAndRoles } from './portal/UsersAndRoles'
import { UserDetails } from './portal/UserDetails'
import { AccountReady } from './enrollment/steps/AccountReady'

export default function App() {
  return (
    <EnrollmentProvider>
      <HashRouter>
        <Routes>
          {/* The flow starts in the DSO's inbox. */}
          <Route path="/" element={<InvitationEmail />} />

          <Route path="/create-account/email" element={<EnterEmail />} />
          <Route path="/create-account/verify-email" element={<VerifyEmail />} />
          <Route path="/create-account/password" element={<CreatePassword />} />
          <Route path="/create-account/organization" element={<OrganizationInfo />} />
          <Route path="/create-account/organization-found" element={<OrganizationFound />} />
          <Route path="/create-account/billing" element={<BillingLocations />} />
          <Route path="/create-account/ready" element={<AccountReady />} />
          <Route path="/home" element={<Dashboard />} />
          <Route path="/businesses" element={<MyBusinesses />} />
          <Route path="/users" element={<UsersAndRoles />} />
          <Route path="/users/:id" element={<UserDetails />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </HashRouter>
    </EnrollmentProvider>
  )
}
