/**
 * Change Language modal — Claims-Portals-HI-FI, node 3758:42767.
 *
 * Built to the node's measurements:
 *   panel   white, radius 16, shadow 0 8px 7px rgba(45,45,46,0.12),
 *           padding 16px 16px 24px, gap 8
 *   globe   32px, glyph inset 9.38%
 *   title   Headings/H2 — Proxima Nova Bold 24, #222B2F, centred
 *   text    Body/Body1 — Regular 16/20, Grey700 #72777A, centred
 *   gap     40 between the title block and the list
 *   row     360 wide, padding 16/14, gap 8; radio 24 (glyph inset 8.33%);
 *           label Sub6 Medium 16/20 #222B2F; helper Caption1 12/16 Nevada #646F7D
 *   scroll  4px rail, track Grey100 #EEF0F1, thumb Navy #00669E, radius 8
 *
 * The panel is capped at 80% of the viewport height. It grows with its content
 * up to that point; past it the language list — not the panel — is what
 * scrolls, so the title and the close button stay put.
 *
 * DESIGN QUESTION: the node ships two different unselected radios — #222B2F on
 * rows 1–5 and #00669E on rows 6–9. That reads as an editing artefact rather than
 * intent, so a single treatment is used here (#222B2F, the majority and the
 * conventional neutral against the #09437D selected state). Confirm with design.
 */

import { useEffect, useRef } from 'react'
// The modal ships its own dark glyphs (close #002843, globe #222B2F). The
// TopNav's are white for the navy bar and would be invisible here.
import closeIcon from './assets/close.svg'
import globeIcon from './assets/globe.svg'
import radioSelected from './assets/radio-selected.svg'
import radioUnselected from './assets/radio-unselected.svg'

export interface LanguageOption {
  value: string
  label: string
  /** English name, shown under the native label. */
  subLabel?: string
}

interface LanguageModalProps {
  isOpen: boolean
  languages: LanguageOption[]
  selected: string
  onSelect: (value: string) => void
  onClose: () => void
}

/** The panel grows with its content up to this share of the viewport. */
const MAX_VIEWPORT_HEIGHT = '80vh'

export function LanguageModal({
  isOpen,
  languages,
  selected,
  onSelect,
  onClose,
}: LanguageModalProps) {
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    // Move focus into the dialog so the keyboard path starts inside it.
    panelRef.current?.focus()
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        background: 'rgba(0, 27, 46, 0.45)',
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="language-modal-title"
        tabIndex={-1}
        data-node-id="3758:42767"
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          alignItems: 'center',
          width: 'min(428px, 100%)',
          maxHeight: MAX_VIEWPORT_HEIGHT,
          padding: '16px 16px 24px',
          background: '#FFFFFF',
          borderRadius: 16,
          boxShadow: '0px 8px 7px rgba(45, 45, 46, 0.12)',
          outline: 'none',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%', flexShrink: 0 }}>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: 4,
              borderRadius: 32,
              border: 0,
              background: 'transparent',
              cursor: 'pointer',
            }}
          >
            <Glyph src={closeIcon} box={24} inset={21.25} />
          </button>
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
            alignItems: 'center',
            width: '100%',
            flex: '1 1 auto',
            minHeight: 0,
          }}
        >
          <div style={{ flexShrink: 0 }}>
            <Glyph src={globeIcon} box={32} inset={9.38} />
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 40,
              alignItems: 'center',
              width: '100%',
              flex: '1 1 auto',
              minHeight: 0,
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: '100%', flexShrink: 0 }}>
              <h2
                id="language-modal-title"
                style={{
                  margin: 0,
                  fontFamily: '"Proxima Nova", system-ui, sans-serif',
                  fontWeight: 700,
                  fontSize: 24,
                  letterSpacing: '0.3px',
                  color: '#222B2F',
                  textAlign: 'center',
                }}
              >
                Change Language
              </h2>
              <p
                style={{
                  margin: 0,
                  fontFamily: '"Proxima Nova", system-ui, sans-serif',
                  fontSize: 16,
                  lineHeight: '20px',
                  letterSpacing: '0.2px',
                  color: '#72777A',
                  textAlign: 'center',
                }}
              >
                Translate the Web by selecting one of the supported languages below.
              </p>
            </div>

            <div
              role="radiogroup"
              aria-labelledby="language-modal-title"
              className="ndp-language-list"
              style={{ width: '100%', flex: '1 1 auto', minHeight: 0, overflowY: 'auto' }}
            >
              {languages.map((language) => {
                const isSelected = language.value === selected
                return (
                  <button
                    key={language.value}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    onClick={() => onSelect(language.value)}
                    style={{
                      display: 'flex',
                      gap: 8,
                      alignItems: 'center',
                      width: '100%',
                      padding: '14px 16px',
                      background: '#FFFFFF',
                      border: 0,
                      cursor: 'pointer',
                      textAlign: 'left',
                    }}
                  >
                    <Glyph
                      src={isSelected ? radioSelected : radioUnselected}
                      box={24}
                      inset={8.33}
                    />
                    <span style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                      <span
                        style={{
                          fontFamily: '"Proxima Nova", system-ui, sans-serif',
                          fontWeight: 500,
                          fontSize: 16,
                          lineHeight: '20px',
                          letterSpacing: '0.3px',
                          color: '#222B2F',
                        }}
                      >
                        {language.label}
                      </span>
                      {language.subLabel ? (
                        <span
                          style={{
                            fontFamily: '"Proxima Nova", system-ui, sans-serif',
                            fontSize: 12,
                            lineHeight: '16px',
                            letterSpacing: '0.3px',
                            color: '#646F7D',
                          }}
                        >
                          {language.subLabel}
                        </span>
                      ) : null}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/** A square icon box with the glyph inset by the node's percentage. */
function Glyph({ src, box, inset }: { src: string; box: number; inset: number }) {
  return (
    <span
      style={{ position: 'relative', display: 'block', width: box, height: box, flexShrink: 0 }}
    >
      <img
        src={src}
        alt=""
        style={{
          position: 'absolute',
          top: `${inset}%`,
          right: `${inset}%`,
          bottom: `${inset}%`,
          left: `${inset}%`,
          display: 'block',
          width: `${100 - inset * 2}%`,
          height: `${100 - inset * 2}%`,
          maxWidth: 'none',
        }}
      />
    </span>
  )
}
