/** User details — layout from Figma 6461:214808, adapted to the DSO Admin / DSO Manager roles. */

import { useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { PortalNav } from './PortalNav'
import { PageHeader } from './PageHeader'
import { BUSINESSES, ROLE_INFO, SEED, extraUsers, type Role, type User } from './UsersAndRoles'
import './MyBusinesses.css'
import './UsersAndRoles.css'
import './UserDetails.css'

const CAPABILITIES: { name: string; admin: string; manager: string | null }[] = [
  { name: 'View businesses', admin: 'All businesses', manager: 'Assigned businesses' },
  { name: 'Business details & enrollment status', admin: 'All businesses', manager: 'Assigned businesses' },
  { name: 'Add / edit businesses', admin: 'All businesses', manager: 'Assigned businesses' },
  { name: 'Go to Business Portal', admin: 'All businesses', manager: 'Assigned businesses' },
  { name: 'View users & roles', admin: 'All users', manager: null },
  { name: 'Add users', admin: 'Yes', manager: null },
  { name: 'Assign roles', admin: 'Yes', manager: null },
  { name: 'Assign businesses to users', admin: 'Yes', manager: null },
]

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="ud__field"><span className="ud__label">{label}</span><span className="ud__value">{children}</span></div>
)

const Check = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="#1f8a4c" strokeWidth="1.5" aria-hidden="true"><path d="M2 6.5l2.5 2.5L10 3.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
)

function Card({ title, action, children }: { title: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="ud__card">
      <header className="ud__card-head"><h2>{title}</h2>{action}</header>
      {children}
    </section>
  )
}

export function UserDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [tab, setTab] = useState<'general' | 'history'>('general')
  const user: User | undefined = [...extraUsers, ...SEED].find((u) => String(u.id) === id)
  if (!user) return <Navigate to="/users" replace />

  const [first, ...rest] = user.name.split(' ')
  const isAdmin = user.role === 'DSO Admin'
  const businesses = isAdmin ? BUSINESSES : user.businesses
  const role: Role = user.role
  const edit = <button type="button" className="biz__link ud__edit">Edit</button>

  return (
    <div className="biz">
      <PortalNav />
      <PageHeader
        breadcrumb="User & Roles"
        title={
          <span className="ud__title">
            {user.name}
            <span className={`ur__role-badge ur__role-badge--${isAdmin ? 'admin' : 'manager'}`}>{role}</span>
          </span>
        }
      />
      <main className="ud__main">
        <div className="ud__tabs" role="tablist">
          <button type="button" role="tab" aria-selected={tab === 'general'} className={tab === 'general' ? 'is-on' : ''} onClick={() => setTab('general')}>General Info</button>
          <button type="button" role="tab" aria-selected={tab === 'history'} className={tab === 'history' ? 'is-on' : ''} onClick={() => setTab('history')}>History Log</button>
        </div>

        {tab === 'history' ? (
          <Card title="History Log"><p className="ud__empty">No activity recorded yet.</p></Card>
        ) : (
          <>
            <Card title="User Information" action={edit}>
              <div className="ud__grid">
                <Field label="First Name">{first}</Field>
                <Field label="Email">{user.email}</Field>
                <Field label="Last Name">{rest.join(' ')}</Field>
                <Field label="Phone Number">{user.phone}</Field>
                <Field label="Status"><span className={`biz__badge biz__badge--${user.active ? 'active' : 'inactive'}`}>{user.active ? 'Active' : 'Inactive'}</span></Field>
              </div>
            </Card>

            <Card title="Role" action={edit}>
              <div className="ud__grid">
                <div className="ud__full"><Field label="Role">{role}</Field></div>
                <div className="ud__full"><Field label="Access">{ROLE_INFO[role]}</Field></div>
                <Field label="Created At">{user.created}</Field>
                <Field label="Created By">Susan Doe</Field>
              </div>
            </Card>

            <Card title="Business access" action={<span className="ud__hint">{isAdmin ? 'Set by Role' : 'Assigned'}</span>}>
              {isAdmin ? (
                <div className="ud__access">
                  <div><strong>All businesses in the organization</strong><small>DSO Admins can access every current and future business. No assignment needed.</small></div>
                  <div className="ud__count"><b>{BUSINESSES.length}</b>Businesses</div>
                </div>
              ) : (
                <ul className="ud__biz-list">
                  {businesses.map((b) => <li key={b}>{b}</li>)}
                </ul>
              )}
            </Card>

            <Card title="Permission Details">
              <table className="ud__perm">
                <thead><tr><th>Capability</th><th>{role}</th></tr></thead>
                <tbody>
                  {CAPABILITIES.map((c) => {
                    const v = isAdmin ? c.admin : c.manager
                    return (
                      <tr key={c.name}>
                        <td>{c.name}</td>
                        <td>{v ? <span className="ud__yes"><Check />{v}</span> : <span className="ud__no">— No access</span>}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </Card>

            <div className="ud__footer">
              <button type="button" className="ud__remove" onClick={() => navigate('/users')}>Remove User</button>
              <Link to="/users" className="biz__link">Back to User & Roles</Link>
            </div>
          </>
        )}
      </main>
    </div>
  )
}
