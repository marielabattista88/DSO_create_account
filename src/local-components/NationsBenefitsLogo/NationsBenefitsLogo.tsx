/**
 * NationsBenefits horizontal wordmark — Design System — Web.
 *
 *   variant="light"  node 15735:6686 — for dark surfaces. "nations" sits navy on
 *                    a ghost-white plate, "benefits" is grey200.
 *   variant="dark"   node 15735:6707 — for light surfaces. Navy plate with white
 *                    "nations", "benefits" in #808285.
 *
 * Picking the wrong one costs half the logo: on the navy hero the dark variant's
 * navy plate disappears, and on white the light variant's grey "benefits" all but
 * vanishes. Verified by rendering both over navy, white and woodsmoke.
 *
 * The two variants are exported differently in Figma: light is one flattened SVG,
 * dark is seventeen per-glyph layers positioned by percentage inset. Both are the
 * exact bytes exported from Figma, committed under ./assets because Figma's asset
 * URLs expire after about seven days.
 */

import light from './assets/light.svg'
import d01 from './assets/dark/01.svg'
import d02 from './assets/dark/02.svg'
import d03 from './assets/dark/03.svg'
import d04 from './assets/dark/04.svg'
import d05 from './assets/dark/05.svg'
import d06 from './assets/dark/06.svg'
import d07 from './assets/dark/07.svg'
import d08 from './assets/dark/08.svg'
import d09 from './assets/dark/09.svg'
import d10 from './assets/dark/10.svg'
import d11 from './assets/dark/11.svg'
import d12 from './assets/dark/12.svg'
import d13 from './assets/dark/13.svg'
import d14 from './assets/dark/14.svg'
import d15 from './assets/dark/15.svg'
import d16 from './assets/dark/16.svg'
import d17 from './assets/dark/17.svg'

/** Intrinsic aspect of the Figma node: 213 × 32. */
const ASPECT = 213 / 32

/** [top, right, bottom, left] as percentages, straight from node 15735:6707. */
const DARK_LAYERS: Array<{ src: string; inset: [number, number, number, number] }> = [
  { src: d01, inset: [14.52, 39.14, 20.37, 53.8] },
  { src: d02, inset: [33.13, 31.98, 20.35, 61.5] },
  { src: d03, inset: [33.13, 24.78, 20.49, 68.75] },
  { src: d04, inset: [33.13, 17.52, 20.27, 75.95] },
  { src: d05, inset: [14.29, 11.11, 20.61, 82.62] },
  { src: d06, inset: [33.58, 11.18, 20.61, 87.68] },
  { src: d07, inset: [19.32, 5.9, 20.61, 89.65] },
  { src: d08, inset: [33.26, 0.02, 20.24, 94.42] },
  { src: d09, inset: [0.0, 48.6, -0.12, 0.0] },
  { src: d10, inset: [32.67, 74.4, 20.73, 24.6] },
  { src: d11, inset: [16.51, 74.17, 74.12, 24.4] },
  { src: d12, inset: [17.92, 76.89, 20.72, 18.62] },
  { src: d13, inset: [32.29, 82.44, 20.37, 10.38] },
  { src: d14, inset: [32.19, 90.99, 20.6, 2.44] },
  { src: d15, inset: [32.32, 51.16, 20.01, 43.24] },
  { src: d16, inset: [32.19, 57.78, 20.72, 35.64] },
  { src: d17, inset: [32.29, 65.73, 20.23, 27.09] },
]

interface NationsBenefitsLogoProps {
  /** Match this to the surface: dark surfaces take "light" and vice versa. */
  variant?: 'light' | 'dark'
  /** Rendered height in px; width follows the source aspect ratio. */
  height?: number
  className?: string
}

export function NationsBenefitsLogo({
  variant = 'light',
  height = 20,
  className,
}: NationsBenefitsLogoProps) {
  const width = height * ASPECT

  if (variant === 'light') {
    return (
      <img
        src={light}
        alt="NationsBenefits"
        className={className}
        style={{ display: 'block', width, height, flexShrink: 0 }}
        data-node-id="15735:6686"
      />
    )
  }

  return (
    <div
      className={className}
      style={{ position: 'relative', width, height, flexShrink: 0 }}
      role="img"
      aria-label="NationsBenefits"
      data-node-id="15735:6707"
    >
      {DARK_LAYERS.map(({ src, inset: [t, r, b, l] }, index) => (
        <div
          key={index}
          style={{ position: 'absolute', top: `${t}%`, right: `${r}%`, bottom: `${b}%`, left: `${l}%` }}
        >
          <img
            alt=""
            src={src}
            style={{ position: 'absolute', inset: 0, display: 'block', width: '100%', height: '100%', maxWidth: 'none' }}
          />
        </div>
      ))}
    </div>
  )
}
