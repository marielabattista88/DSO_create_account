/**
 * Wires the shared TopNav and the Change Language modal to the enrollment store.
 */

import { useState } from 'react'
import { LanguageModal, TopNav } from '../../local-components'
import { useEnrollment } from '../data/store'
import { LANGUAGES } from '../data/options'

interface BrandHeaderProps {
  hideLogo?: boolean
  onSignOut?: () => void
}

export function BrandHeader({ hideLogo, onSignOut }: BrandHeaderProps) {
  const { state, patch } = useEnrollment()
  const [languageOpen, setLanguageOpen] = useState(false)
  const current = LANGUAGES.find((l) => l.value === state.language) ?? LANGUAGES[0]

  return (
    <>
      <TopNav
        language={current.value.slice(0, 2).toUpperCase()}
        onLanguageClick={() => setLanguageOpen(true)}
        hideLogo={hideLogo}
        onSignOut={onSignOut}
      />

      <LanguageModal
        isOpen={languageOpen}
        languages={LANGUAGES}
        selected={state.language}
        onSelect={(value) => {
          patch({ language: value })
          setLanguageOpen(false)
        }}
        onClose={() => setLanguageOpen(false)}
      />
    </>
  )
}
