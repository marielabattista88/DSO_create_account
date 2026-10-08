/** My Businesses — Figma "Member Verification" (8169:133819). Sample data. */

import { useEffect, useMemo, useRef, useState } from 'react'
import { PortalNav } from './PortalNav'
import { AddBusinessButton, PageHeader } from './PageHeader'
import './MyBusinesses.css'

type Status = 'Active' | 'Rejected' | 'Under Review' | 'Inactive' | 'Partially Approved'

interface Business {
  legal: string
  dba: string
  tin: string
  npi: string
  status: Status
}

const TOTAL = 150
const STATUSES: Status[] = ['Active', 'Rejected', 'Under Review', 'Inactive', 'Partially Approved']
const BADGE: Record<Status, string> = {
  Active: 'active',
  Rejected: 'rejected',
  'Under Review': 'review',
  Inactive: 'inactive',
  'Partially Approved': 'partial',
}

const SAMPLE: Pick<Business, 'legal' | 'npi' | 'status'>[] = [
  { legal: 'Bright Smile Dental Group LLC', npi: '627395405', status: 'Active' },
  { legal: 'Bright Smile Dental Group SA', npi: 'N/A', status: 'Rejected' },
  { legal: 'Bright Smile Dental Group LLC', npi: '627395405', status: 'Under Review' },
  { legal: 'Bright Smile Dental Group LLC', npi: '627395405', status: 'Inactive' },
  { legal: 'Bright Smile Dental Group LLC', npi: '627395405', status: 'Partially Approved' },
  { legal: 'Bright Smile Dental Group LLC', npi: '627395405', status: 'Active' },
  { legal: 'Bright Smile Dental Group SA', npi: 'N/A', status: 'Active' },
  { legal: 'Bright Smile Dental Group LLC', npi: '627395405', status: 'Active' },
]

const ALL: Business[] = Array.from({ length: TOTAL }, (_, i) => {
  const s = SAMPLE[i % SAMPLE.length]
  return { ...s, dba: 'Bright Smile Dental Group LLC', tin: '14-873284894' }
})

const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
    <circle cx="7" cy="7" r="5" /><path d="M11 11l3.5 3.5" strokeLinecap="round" />
  </svg>
)
const ExternalIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true">
    <path d="M9 7v3H2V3h3M7 1.5h3.5V5M5.5 6.5l5-5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const ChevronDown = ({ open }: { open: boolean }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"
    style={{ flexShrink: 0, transform: open ? 'rotate(180deg)' : undefined, transition: 'transform 0.15s' }}>
    <path d="M3.5 6l4.5 4.5L12.5 6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

function StatusDropdown({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const close = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) setOpen(false) }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [open])

  return (
    <div className="biz__dd" ref={ref}>
      <button
        type="button"
        className={`biz__dd-trigger${value ? ' biz__dd-trigger--set' : ''}`}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={(e) => { if (e.key === 'Escape') setOpen(false) }}
      >
        <span>{value || 'Status'}</span>
        <ChevronDown open={open} />
      </button>
      {open && (
        <ul className="biz__dd-menu" role="listbox">
          {['', ...STATUSES].map((s) => (
            <li
              key={s || 'all'}
              role="option"
              aria-selected={s === value}
              className={s === value ? 'is-selected' : undefined}
              onClick={() => { onChange(s); setOpen(false) }}
            >
              {s || 'All statuses'}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

const ROW_HEIGHT = 58
// nav 72 + header 85 + paddings/search/thead/pager chrome ≈ 397px
const CHROME_HEIGHT = 397
const fitRows = () => Math.max(3, Math.floor((window.innerHeight - CHROME_HEIGHT) / ROW_HEIGHT))

function pageList(page: number, pages: number): (number | '…')[] {
  if (pages <= 5) return Array.from({ length: pages }, (_, i) => i + 1)
  const start = Math.min(Math.max(page - 1, 1), pages - 3)
  const mid = [start, start + 1, start + 2].filter((n) => n > 1 && n < pages)
  return [1, ...(start > 2 ? ['…' as const] : []), ...mid, ...(start + 2 < pages - 1 ? ['…' as const] : []), pages]
}

export function MyBusinesses() {
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('')
  const [rowsPerPage, setRowsPerPage] = useState(fitRows)
  const [autoRows, setAutoRows] = useState(true)
  const rowOptions = useMemo(() => [...new Set([fitRows(), 10, 20, 50])].sort((a, b) => a - b), [])

  useEffect(() => {
    if (!autoRows) return
    const onResize = () => setRowsPerPage(fitRows())
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [autoRows])
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return ALL.filter(
      (b) =>
        (!status || b.status === status) &&
        (!q || [b.legal, b.dba, b.tin, b.npi].some((v) => v.toLowerCase().includes(q))),
    )
  }, [query, status])

  const pages = Math.max(1, Math.ceil(filtered.length / rowsPerPage))
  const current = Math.min(page, pages)
  const rows = filtered.slice((current - 1) * rowsPerPage, current * rowsPerPage)
  const go = (n: number) => setPage(Math.min(Math.max(n, 1), pages))

  return (
    <div className="biz">
      <PortalNav />
      <PageHeader breadcrumb="My Businesses" title="My Businesses" action={<AddBusinessButton />} />
      <main className="biz__content">
        <section className="biz__card">
          <div className="biz__inner">
            <div className="biz__search">
              <div className="biz__field">
                <SearchIcon />
                <input
                  value={query}
                  onChange={(e) => { setQuery(e.target.value); setPage(1) }}
                  placeholder="Search by Legal Entity Name, DBA, TIN, EIN or ITIN, NPI"
                  aria-label="Search businesses"
                />
                {query && <button type="button" aria-label="Clear search" onClick={() => setQuery('')}>×</button>}
              </div>
              <StatusDropdown value={status} onChange={(v) => { setStatus(v); setPage(1) }} />
              <button type="button" className="biz__clear" disabled={!query && !status} onClick={() => { setQuery(''); setStatus(''); setPage(1) }}>
                Clear All
              </button>
            </div>

            <div className="biz__scroll">
            <table className="biz__table">
              <colgroup>
                <col style={{ width: '18%' }} /><col style={{ width: '18%' }} /><col style={{ width: '12.5%' }} />
                <col style={{ width: '12.5%' }} /><col style={{ width: '18%' }} /><col style={{ width: '21%' }} />
              </colgroup>
              <thead>
                <tr>
                  <th>Legal Entity Name</th>
                  <th>Doing Business As (DBA)</th>
                  <th className="biz__center">TIN/EIN &amp; ITIN</th>
                  <th className="biz__center">NPI</th>
                  <th className="biz__center">Status</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {rows.map((b, i) => (
                  <tr key={i}>
                    <td>{b.legal}</td>
                    <td>{b.dba}</td>
                    <td className="biz__center">{b.tin}</td>
                    <td className="biz__center">{b.npi}</td>
                    <td className="biz__center"><span className={`biz__badge biz__badge--${BADGE[b.status]}`}>{b.status}</span></td>
                    <td>
                      <div className="biz__actions">
                        <button type="button" className="biz__link">View Details <span aria-hidden="true">›</span></button>
                        <button type="button" className="biz__portal">Go to Potal <ExternalIcon /></button>
                      </div>
                    </td>
                  </tr>
                ))}
                {rows.length === 0 && <tr><td colSpan={6} className="biz__empty">No businesses found.</td></tr>}
              </tbody>
            </table>
            </div>
          </div>

          <div className="biz__pager">
            <label className="biz__rows">
              Row per page
              <select value={rowsPerPage} onChange={(e) => { setAutoRows(false); setRowsPerPage(Number(e.target.value)); setPage(1) }}>
                {(rowOptions.includes(rowsPerPage) ? rowOptions : [...rowOptions, rowsPerPage].sort((a, b) => a - b)).map((n) => <option key={n}>{n}</option>)}
              </select>
              of {filtered.length}
            </label>
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
    </div>
  )
}

export function UsersAndRoles() {
  return (
    <div className="biz">
      <PortalNav />
      <PageHeader breadcrumb="User & Roles" title="User & Roles" />
    </div>
  )
}
