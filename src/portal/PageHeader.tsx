/**
 * Page header — Figma "Dental Header" (8181:236002), 1440 × 85.
 * Breadcrumb (24) over the section title (34), optional action on the right (40).
 */

import type { ReactNode } from 'react'
import './PageHeader.css'

interface PageHeaderProps {
  breadcrumb: string
  title: string
  action?: ReactNode
}

export function PageHeader({ breadcrumb, title, action }: PageHeaderProps) {
  return (
    <div className="phdr">
      <div className="phdr__text">
        <span className="phdr__crumb">{breadcrumb}</span>
        <h1 className="phdr__title">{title}</h1>
      </div>
      {action}
    </div>
  )
}

export function AddBusinessButton() {
  return (
    <button type="button" className="phdr__btn">
      <span aria-hidden="true" style={{ fontSize: 20, lineHeight: 1 }}>+</span>
      Add Business
    </button>
  )
}

export function AddUserButton({ onClick }: { onClick?: () => void }) {
  return (
    <button type="button" className="phdr__btn" onClick={onClick}>
      <span aria-hidden="true" style={{ fontSize: 20, lineHeight: 1 }}>+</span>
      Add User
    </button>
  )
}
