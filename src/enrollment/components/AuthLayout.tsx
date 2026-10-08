/**
 * Create-account shell: night background, optional top nav, white card with the
 * "Step N of 6" rail on the counted steps.
 */

import type { ReactNode } from 'react'
import { BrandHeader } from './BrandHeader'
import { NationsDentalLogo } from '../../local-components'
import { BrandBackground, backgroundPalette } from '../../backgrounds'

export const TOTAL_STEPS = 6

interface AuthLayoutProps {
  /** 1–6 on the counted steps; omit on the final screen. */
  step?: number
  title: string
  description?: ReactNode
  children: ReactNode
  /** Card width: narrow for step 1, default for the rest. */
  size?: 'narrow' | 'default'
  align?: 'left' | 'center'
  /** Wordmark above the title (step 1 only — the others have it in the nav). */
  showLogoInCard?: boolean
  /** Content above the title, e.g. a status icon. */
  aboveTitle?: ReactNode
  /** Control aligned to the right of the title, e.g. a toggle. */
  titleAside?: ReactNode
  /** Content directly under the title, before the description. */
  belowTitle?: ReactNode
  /** Show the nav's "Sign Out" button (steps 4+ have an authenticated user). */
  signedIn?: boolean
  onSignOut?: () => void
  contentGap?: number
}

export function AuthLayout({
  step,
  title,
  description,
  children,
  size = 'default',
  align = 'left',
  showLogoInCard = false,
  aboveTitle,
  titleAside,
  belowTitle,
  signedIn = false,
  onSignOut,
  contentGap = 24,
}: AuthLayoutProps) {
  return (
    <div className="relative flex min-h-screen flex-col" style={{ background: backgroundPalette.deep }}>
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <BrandBackground />
      </div>

      <div className="relative flex flex-1 flex-col">
        <BrandHeader hideLogo={showLogoInCard} onSignOut={signedIn ? onSignOut : undefined} />

        <main className="flex flex-1 items-start justify-center px-4 pt-6 pb-16 sm:items-center sm:pt-0">
          <div
            className="w-full bg-white"
            style={{
              maxWidth: size === 'narrow' ? 520 : 680,
              borderRadius: 'var(--nb-radius-card)',
              boxShadow: 'var(--nb-shadow-large)',
              padding: 32,
            }}
          >
            {step ? (
              <div style={{ marginBottom: 32 }}>
                <p style={{ color: 'var(--nb-grey-700)', fontSize: 12, margin: '0 0 10px' }}>
                  Step {step} of {TOTAL_STEPS}
                </p>
                <ol
                  className="m-0 flex list-none gap-1.5 p-0"
                  aria-label={`Step ${step} of ${TOTAL_STEPS}`}
                >
                  {Array.from({ length: TOTAL_STEPS }, (_, index) => (
                    <li
                      key={index}
                      style={{
                        flex: 1,
                        height: 4,
                        borderRadius: 2,
                        background: index < step ? 'var(--nb-navy)' : 'var(--nb-grey-300)',
                      }}
                    />
                  ))}
                </ol>
              </div>
            ) : null}

            {showLogoInCard ? (
              <div className="flex" style={{ marginBottom: 16 }}>
                <NationsDentalLogo surface="light" height={22} />
              </div>
            ) : null}

            {aboveTitle ? (
              <div
                className="flex"
                style={{ justifyContent: align === 'center' ? 'center' : 'flex-start', marginBottom: 16 }}
              >
                {aboveTitle}
              </div>
            ) : null}

            <div className="flex items-center gap-4" style={{ justifyContent: align === 'center' ? 'center' : 'space-between' }}>
              <h1 className="heading-1" style={{ color: 'var(--nb-woodsmoke)', margin: 0, textAlign: align }}>
                {title}
              </h1>
              {titleAside}
            </div>

            {belowTitle ? (
              <div className="flex" style={{ justifyContent: align === 'center' ? 'center' : 'flex-start', marginTop: 12 }}>
                {belowTitle}
              </div>
            ) : null}

            {description ? (
              <p
                className="body-1"
                style={{ color: 'var(--nb-grey-700)', margin: '8px 0 0', textAlign: align }}
              >
                {description}
              </p>
            ) : null}

            <div style={{ marginTop: contentGap }}>{children}</div>
          </div>
        </main>
      </div>
    </div>
  )
}
