import { PortalNav } from './PortalNav'
import { AddBusinessButton, PageHeader } from './PageHeader'

interface PortalPageProps {
  title: string
  withAddBusiness?: boolean
}

/** Empty portal page: just the menu and the page header. */
export function PortalPage({ title, withAddBusiness = false }: PortalPageProps) {
  return (
    <div style={{ minHeight: '100vh', background: '#eef3f8' }}>
      <PortalNav />
      <PageHeader breadcrumb={title} title={title} action={withAddBusiness ? <AddBusinessButton /> : undefined} />
    </div>
  )
}

export const Businesses = () => <PortalPage title="My Businesses" withAddBusiness />
export const UsersAndRoles = () => <PortalPage title="User & Roles" />
