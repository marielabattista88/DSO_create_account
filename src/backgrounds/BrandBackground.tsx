/**
 * Brand background — the hero from Claims-Portals-HI-FI, node 7517:97620.
 *
 * This is the real exported asset, not a re-drawing. The node is a group of two
 * layers and both are reproduced here:
 *   1. the hero image (node 3758:43128)
 *   2. a rgba(0, 27, 46, 0.5) overlay on top, which is what gives the reference
 *      its subdued mood
 * plus the 2px #2D3648 bottom edge from the hero frame.
 *
 * The PNG is committed under ./assets because Figma's asset URLs expire after
 * about seven days. Source is 1264 × 829; it is scaled with object-fit: cover so
 * it fills any viewport without distorting.
 *
 * Note: this asset carries the reference's own coral hairlines. Earlier drafts
 * recoloured them to the logo's cyan, which required authoring the composition by
 * hand — that approximation was rejected in favour of the real thing. If the
 * accent colour needs to change, it has to change in Figma and be re-exported.
 */

import heroBkg from './assets/hero-bkg.png'
import { backgroundPalette as c } from './palette'

/**
 * Darkening pass, on top of the reference's own overlay.
 *
 * Raising the reference overlay's opacity does NOT darken meaningfully: its
 * colour (0, 27, 46) is nearly as dark as the hero itself, so going 0.5 → 0.6
 * measured only a 4.8% drop in mean luminance. A black layer at 0.2 multiplies
 * the composite by 0.8 instead, which is an actual 20% reduction.
 */
const DARKEN = 0.2

export interface BrandBackgroundProps {
  /** Set false to drop the muting overlay and show the hero at full contrast. */
  muted?: boolean
  /** Reference overlay opacity. Defaults to the reference's own 0.5. */
  overlayOpacity?: number
  /** Extra darkening on top, 0–1. Defaults to 0.2 (20% darker). */
  darken?: number
  className?: string
  style?: React.CSSProperties
}

export function BrandBackground({
  muted = true,
  overlayOpacity = 0.5,
  darken = DARKEN,
  className,
  style,
}: BrandBackgroundProps) {
  return (
    <div
      className={className}
      style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', ...style }}
      aria-hidden="true"
      data-node-id="7517:97620"
    >
      <img
        src={heroBkg}
        alt=""
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          maxWidth: 'none',
          pointerEvents: 'none',
        }}
      />

      {muted ? (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `rgba(0, 27, 46, ${overlayOpacity})`,
          }}
        />
      ) : null}

      {darken > 0 ? (
        <div style={{ position: 'absolute', inset: 0, background: `rgba(0, 0, 0, ${darken})` }} />
      ) : null}

      <div
        style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 2, background: c.edge }}
      />
    </div>
  )
}
