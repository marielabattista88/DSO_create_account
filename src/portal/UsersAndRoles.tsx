/**
 * User & Roles — layout from Figma 8912:242170, roles defined for the prototype:
 *  - DSO Admin: access to every business and can assign roles.
 *  - DSO Manager: manages only the businesses assigned to them and cannot assign roles.
 */

import { useMemo, useState } from 'react'
import { PortalNav } from './PortalNav'
import { AddUserButton, PageHeader } from './PageHeader'
import { StatusDropdown, pageList } from './MyBusinesses'
import './MyBusinesses.css'
import './UsersAndRoles.css'

type Role = 'DSO Admin' | 'DSO Manager'

interface User {
  name: string
  role: Role
  email: string
  phone: string
  created: string
  active: boolean
  businesses: string[]
}

const ROLES: Role[] = ['DSO Admin', 'DSO Manager']
const ROLE_INFO: Record<Role, string> = {
  'DSO Admin': 'Access to all businesses. Can add users and assign roles.',
  'DSO Manager': 'Manages only the assigned businesses. Cannot assign roles.',
}
const BUSINESSES = [
  'Bright Smile Dental Group LLC',
  'Bright Smile Dental Group SA',
  'Sunrise Family Dentistry',
  'Lakeside Orthodontics',
  'Downtown Dental Care',
  'Maple Grove Dental',
]

const NAMES = ['Michael Scott', 'Susan Doe', 'Laura Pérez', 'Daniel Kim', 'Olivia Brown', 'Carlos Ruiz', 'Emma Wilson', 'Noah Davis', 'Sofia Martin', 'Liam Johnson', 'Ava Garcia', 'Lucas Moore']
const SEED: User[] = NAMES.map((name, i) => ({
  name,
  role: i % 3 === 0 ? 'DSO Admin' : 'DSO Manager',
  email: `${name.split(' ')[0].toLowerCase()}@gmail.com`,
  phone: '(123) 435-7835',
  created: 'Jun 6, 2026',
  active: i % 5 !== 3,
  businesses: i % 3 === 0 ? BUSINESSES : BUSINESSES.slice(i % 3, (i % 3) + 1 + (i % 2)),
}))

const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
    <circle cx="7" cy="7" r="5" /><path d="M11 11l3.5 3.5" strokeLinecap="round" />
  </svg>
)

const access = (u: User) =>
  u.role === 'DSO Admin' ? 'All businesses' : `${u.businesses.length} business${u.businesses.length === 1 ? '' : 'es'}`

function AddUserModal({ onClose, onSave }: { onClose: () => void; onSave: (u: User) => void }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState<Role>('DSO Manager')
  const [selected, setSelected] = useState<string[]>([])

  const needsBusinesses = role === 'DSO Manager'
  const valid = name.trim() && /\S+@\S+\.\S+/.test(email) && (!needsBusinesses || selected.length > 0)
  const toggle = (b: string) => setSelected((s) => (s.includes(b) ? s.filter((x) => x !== b) : [...s, b]))

  return (
    <div className="ur__overlay" onMouseDown={onClose}>
      <div className="ur__modal" role="dialog" aria-modal="true" aria-label="Add User" onMouseDown={(e) => e.stopPropagation()}>
        <h2 className="ur__modal-title">Add User</h2>

        <label className="ur__label">Full name
          <input className="ur__input" value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <label className="ur__label">Email
          <input className="ur__input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>

        <fieldset className="ur__fieldset">
          <legend className="ur__label">Role</legend>
          {ROLES.map((r) => (
            <label key={r} className={`ur__role${role === r ? ' is-on' : ''}`}>
              <input type="radio" name="role" checked={role === r} onChange={() => setRole(r)} />
              <span><strong>{r}</strong><small>{ROLE_INFO[r]}</small></span>
            </label>
          ))}
        </fieldset>

        {needsBusinesses && (
          <fieldset className="ur__fieldset">
            <legend className="ur__label">Assigned businesses</legend>
            <div className="ur__checks">
              {BUSINESSES.map((b) => (
                <label key={b}><input type="checkbox" checked={selected.includes(b)} onChange={() => toggle(b)} /> {b}</label>
              ))}
            </div>
          </fieldset>
        )}

        <div className="ur__modal-actions">
          <button type="button" className="ur__cancel" onClick={onClose}>Cancel</button>
          <button
            type="button"
            className="phdr__btn"
            disabled={!valid}
            onClick={() =>
              onSave({
                name: name.trim(), role, email: email.trim(), phone: '(123) 435-7835',
                created: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                active: true, businesses: role === 'DSO Admin' ? BUSINESSES : selected,
              })
            }
          >
            Send invitation
          </button>
        </div>
      </div>
    </div>
  )
}

export function UsersAndRoles() {
  const [users, setUsers] = useState(SEED)
  const [query, setQuery] = useState('')
  const [role, setRole] = useState('')
  const [page, setPage] = useState(1)
  const [adding, setAdding] = useState(false)
  const perPage = 10

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return users.filter((u) => (!role || u.role === role) && (!q || [u.name, u.email].some((v) => v.toLowerCase().includes(q))))
  }, [users, query, role])

  const pages = Math.max(1, Math.ceil(filtered.length / perPage))
  const current = Math.min(page, pages)
  const rows = filtered.slice((current - 1) * perPage, current * perPage)
  const go = (n: number) => setPage(Math.min(Math.max(n, 1), pages))

  return (
    <div className="biz">
      <PortalNav />
      <PageHeader breadcrumb="User & Roles" title="User & Roles" action={<AddUserButton onClick={() => setAdding(true)} />} />
      <main className="biz__content">
        <section className="biz__card">
          <div className="biz__inner">
            <div className="biz__search">
              <div className="biz__field">
                <SearchIcon />
                <input
                  value={query}
                  onChange={(e) => { setQuery(e.target.value); setPage(1) }}
                  placeholder="Search by name or email"
                  aria-label="Search users"
                />
                {query && <button type="button" aria-label="Clear search" onClick={() => setQuery('')}>×</button>}
              </div>
              <StatusDropdown value={role} onChange={(v) => { setRole(v); setPage(1) }} options={ROLES} label="Role" allLabel="All roles" />
              <button type="button" className="biz__clear" disabled={!query && !role} onClick={() => { setQuery(''); setRole(''); setPage(1) }}>
                Clear All
              </button>
            </div>

            <div className="biz__scroll">
              <table className="biz__table">
                <colgroup>
                  <col style={{ width: '16%' }} /><col style={{ width: '16%' }} /><col style={{ width: '17%' }} />
                  <col style={{ width: '13%' }} /><col style={{ width: '12%' }} /><col style={{ width: '14%' }} /><col style={{ width: '12%' }} />
                </colgroup>
                <thead>
                  <tr>
                    <th>User Name</th>
                    <th className="biz__center">Role</th>
                    <th>Email</th>
                    <th>Phone Number</th>
                    <th>Access</th>
                    <th className="biz__center">Status</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {rows.map((u) => (
                    <tr key={u.email + u.name}>
                      <td>{u.name}</td>
                      <td className="biz__center"><span className={`ur__role-badge ur__role-badge--${u.role === 'DSO Admin' ? 'admin' : 'manager'}`}>{u.role}</span></td>
                      <td>{u.email}</td>
                      <td>{u.phone}</td>
                      <td>{access(u)}</td>
                      <td className="biz__center"><span className={`biz__badge biz__badge--${u.active ? 'active' : 'inactive'}`}>{u.active ? 'Active' : 'Inactive'}</span></td>
                      <td>
                        <div className="biz__actions">
                          <button type="button" className="biz__link">View Details <span aria-hidden="true">›</span></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {rows.length === 0 && <tr><td colSpan={7} className="biz__empty">No users found.</td></tr>}
                </tbody>
              </table>
            </div>
          </div>

          <div className="biz__pager">
            <span className="biz__rows">{filtered.length} users</span>
            <div className="biz__pages">
              <button type="button" className="biz__page" disabled={current === 1} onClick={() => go(1)} aria-label="First page">«</button>
              <button type="button" className="biz__page" disabled={current === 1} onClick={() => go(current - 1)} aria-label="Previous page">‹</button>
              {pageList(current, pages).map((n, i) =>
                n === '…' ? <span key={`e${i}`} className="biz__page" style={{ display: 'grid', placeItems: 'center', border: 0 }}>…</span> : (
                  <button key={n} type="button" className={`biz__page${n === current ? ' biz__page--on' : ''}`} onClick={() => go(n)}>{n}</button>
                ),
              )}
              <button type="button" className="biz__page" disabled={current === pages} onClick={() => go(current + 1)} aria-label="Next page">›</button>
              <button type="button" className="biz__page" disabled={current === pages} onClick={() => go(pages)} aria-label="Last page">»</button>
            </div>
          </div>
        </section>
      </main>
      {adding && <AddUserModal onClose={() => setAdding(false)} onSave={(u) => { setUsers((l) => [u, ...l]); setAdding(false); setPage(1) }} />}
    </div>
  )
}
