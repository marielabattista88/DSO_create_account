/**
 * In-memory state for the DSO create-account flow. Nothing persists: a reload
 * starts the flow over, which is what you want when demoing a prototype.
 */

import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import type { ReactNode } from 'react'

export interface Organization {
  legalName: string
  dba: string
  tin: string
  soleProprietorship: boolean
  address1: string
  address2: string
  city: string
  state: string
  zip: string
}

export interface EnrollmentState {
  firstName: string
  lastName: string
  email: string
  /** Language code, e.g. "en". */
  language: string
  organization: Organization
}

const INITIAL: EnrollmentState = {
  firstName: '',
  lastName: '',
  email: '',
  language: 'en',
  organization: {
    legalName: '',
    dba: '',
    tin: '',
    soleProprietorship: false,
    address1: '',
    address2: '',
    city: '',
    state: '',
    zip: '',
  },
}

interface EnrollmentContextValue {
  state: EnrollmentState
  patch: (changes: Partial<EnrollmentState>) => void
}

const EnrollmentContext = createContext<EnrollmentContextValue | null>(null)

export function EnrollmentProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<EnrollmentState>(INITIAL)
  const patch = useCallback(
    (changes: Partial<EnrollmentState>) => setState((current) => ({ ...current, ...changes })),
    [],
  )
  const value = useMemo(() => ({ state, patch }), [state, patch])
  return <EnrollmentContext.Provider value={value}>{children}</EnrollmentContext.Provider>
}

export function useEnrollment(): EnrollmentContextValue {
  const context = useContext(EnrollmentContext)
  if (!context) throw new Error('useEnrollment must be used inside EnrollmentProvider')
  return context
}
