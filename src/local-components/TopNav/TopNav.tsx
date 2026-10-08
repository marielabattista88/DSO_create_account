/**
 * Top navigation — Claims-Portals-HI-FI, node 7518:97663.
 *
 * Built to the node's own measurements rather than approximated:
 *   bar        Secondary/Night #002843 at 50% opacity, padding 16px 24px
 *              (the node is solid; the transparency is a deliberate change so
 *              the hero background reads through the bar)
 *   left/right two fixed 204px blocks, space-between
 *   logo       40 × 40
 *   language   24px icon box + 8px gap + "EN" in Buttons/Text1
 *              (Proxima Nova Semibold 18/20, 0.3px tracking, white)
 *   close      #073A5D pill, 32px tall, 4px side padding, 32px radius,
 *              24px icon box
 *
 * The globe and close glyphs are the SVGs exported from that node. They are used
 * instead of nb-flexpay-icons because that set has no close glyph at all and its
 * icons carry hardcoded fills that cannot be recoloured for a dark bar.
 *
 * Presentational on purpose: it takes the language and the handlers as props so
 * it stays free of any feature's store.
 *
 * La barra es sticky siempre — create account, sign in y onboarding — y por eso
 * el sticky vive acá y no en cada layout: los dos que la montan (AuthLayout y
 * EnrollmentLayout) la quieren igual, y así una pantalla nueva la hereda.
 *
 * Sticky obliga a resolver la transparencia. Quieta arriba del hero el 50% se ve
 * como se diseñó, pero apenas la tarjeta blanca pasa por debajo el navy se lava
 * a un gris azulado — el mismo problema que `solid` ya resolvía en las páginas
 * sin hero. Así que la barra se vuelve sólida con el scroll: al tope se ve
 * translúcida, en cuanto hay algo debajo se opaca.
 */

import { useEffect, useState } from 'react'
import { NationsDentalLogo } from '../NationsDentalLogo'
import closeIcon from './assets/close.svg'
import globeIcon from './assets/globe.svg'

/** Secondary/Night at 50% — the hero shows through the bar. */
export const TOP_NAV_BACKGROUND = 'rgba(0, 40, 67, 0.5)'

/** Secondary/Night at full strength, for pages with no hero behind the bar. */
export const TOP_NAV_SOLID = '#002843'

/** Scroll, en px, a partir del cual la barra translúcida se vuelve sólida. */
const SOLID_AFTER = 4

/**
 * Alto de la barra, en px: 16 + 40 + 16 del nodo (padding, alto del logo,
 * padding). Se exporta porque al ser sticky pasó a ser un dato que necesita
 * cualquier cosa que también quiera pegarse — el riel de progreso, por ejemplo,
 * tiene que saber dónde termina la barra para no quedar debajo.
 */
export const TOP_NAV_HEIGHT = 72

interface TopNavProps {
  /** Short code shown next to the globe, e.g. "EN". */
  language: string
  onLanguageClick?: () => void
  /** Omit to hide the close pill. */
  onClose?: () => void
  /** Accessible name for the close action. */
  closeLabel?: string
  /**
   * Opaque bar. The 50% default exists so the enrollment hero reads through it;
   * on a white page there is nothing to read through and the transparency just
   * washes the navy out to a muddy grey-blue.
   */
  solid?: boolean
  /** Hides the wordmark; the first step carries it inside the card instead. */
  hideLogo?: boolean
  /** Shows the outlined "Sign Out" button used once the account exists. */
  onSignOut?: () => void
}

/** Icon box: a 24px square with the glyph inset by the node's percentage. */
function IconBox({ src, inset, alt = '' }: { src: string; inset: number; alt?: string }) {
  return (
    <span style={{ position: 'relative', display: 'block', width: 24, height: 24, flexShrink: 0 }}>
      <img
        src={src}
        alt={alt}
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

export function TopNav({
  language,
  onLanguageClick,
  onClose,
  closeLabel = 'Close',
  solid = false,
  hideLogo = false,
  onSignOut,
}: TopNavProps) {
  /* Inicial perezoso y no un set dentro del efecto: al volver a una ruta con la
     página ya scrolleada no hay evento de scroll que dispare, y la barra
     arrancaría translúcida arriba del contenido. */
  const [scrolled, setScrolled] = useState(() => window.scrollY > SOLID_AFTER)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > SOLID_AFTER)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const opaque = solid || scrolled

  return (
    <header
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '16px 24px',
        background: opaque ? TOP_NAV_SOLID : TOP_NAV_BACKGROUND,
        transition: 'background 160ms ease',
        flexShrink: 0,
        position: 'sticky',
        top: 0,
        /* Arriba de la tarjeta y de su sombra, debajo de los modales, que la
           librería portea al body con el z-index de MUI. */
        zIndex: 20,
      }}
      data-node-id="7518:97663"
    >
      <div
        style={{
          flex: '1 0 0',
          minWidth: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Sin ancho fijo: el lockup a 40 de alto mide 260, y el 204 que había
            acá era de una maqueta con algo centrado que ya no existe. Con ancho
            automático el space-between sigue mandando el logo a la izquierda. */}
        <div style={{ display: 'flex', gap: 8, height: 40, alignItems: 'center' }}>
          {hideLogo ? null : <NationsDentalLogo surface="dark" height={20} />}
        </div>

        <div
          style={{
            display: 'flex',
            gap: 16,
            alignItems: 'center',
            justifyContent: 'flex-end',
          }}
        >
          <button
            type="button"
            onClick={onLanguageClick}
            aria-label={`Change language. Current language: ${language}`}
            style={{
              display: 'flex',
              gap: 8,
              alignItems: 'center',
              justifyContent: 'center',
              border: 0,
              padding: 0,
              background: 'transparent',
              cursor: onLanguageClick ? 'pointer' : 'default',
            }}
          >
            <IconBox src={globeIcon} inset={9.38} />
            <span
              style={{
                fontFamily: '"Proxima Nova", system-ui, sans-serif',
                fontWeight: 600,
                fontSize: 18,
                lineHeight: '20px',
                letterSpacing: '0.3px',
                color: '#FFFFFF',
                whiteSpace: 'nowrap',
              }}
            >
              {language}
            </span>
          </button>

          {onSignOut ? (
            <button
              type="button"
              onClick={onSignOut}
              style={{
                height: 32,
                padding: '0 16px',
                borderRadius: 8,
                border: '1px solid #FFFFFF',
                background: 'transparent',
                color: '#FFFFFF',
                fontFamily: '"Proxima Nova", system-ui, sans-serif',
                fontWeight: 600,
                fontSize: 14,
                cursor: 'pointer',
              }}
            >
              Sign Out
            </button>
          ) : null}

          {onClose ? (
            <button
              type="button"
              onClick={onClose}
              aria-label={closeLabel}
              style={{
                display: 'flex',
                height: 32,
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0 4px',
                borderRadius: 32,
                border: 0,
                background: '#073A5D',
                cursor: 'pointer',
              }}
            >
              <IconBox src={closeIcon} inset={21.25} />
            </button>
          ) : null}
        </div>
      </div>
    </header>
  )
}
