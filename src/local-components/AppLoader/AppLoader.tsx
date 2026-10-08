/**
 * Loader — Design System — Web, node 12594:33393.
 *
 * "Loading" (Headings/H2 — Proxima Nova Bold 24, black, 0.3px tracking) beside a
 * three-dot spinner in Primary/Navy. Two layouts from the node:
 *   horizontal  gap 32, items-end
 *   vertical    column, gap 16, centred
 *
 * Why this is built here rather than imported:
 *   · nb-flexpay-ui has no CircularSpinner at all, and its own `Loader` is a
 *     different component — a spinning SVG on a fixed, full-viewport overlay.
 *   · The node's CircularSpinner lives in nb-adaptive-design-system, whose
 *     component depends on that library's `spinner-bounce` keyframes and
 *     `bg-primary` theme class. Neither is loaded here, so importing it would
 *     render three unstyled spans.
 *   · The dots are an animation; the three exported SVGs are one frame of it, so
 *     they cannot carry the motion either.
 *
 * The keyframes live in src/index.css as `ndp-dot-bounce`.
 */

const DOT_DELAYS = ['0s', '0.2s', '0.4s']

interface AppLoaderProps {
  /** Node variants: side by side, or stacked and centred. */
  layout?: 'horizontal' | 'vertical'
  /** Set false to show the spinner without the word. */
  showLabel?: boolean
  label?: string
}

export function AppLoader({
  layout = 'vertical',
  showLabel = true,
  label = 'Loading',
}: AppLoaderProps) {
  const horizontal = layout === 'horizontal'

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={label}
      style={{
        display: 'flex',
        flexDirection: horizontal ? 'row' : 'column',
        alignItems: horizontal ? 'flex-end' : 'center',
        justifyContent: 'center',
        gap: horizontal ? 32 : 16,
      }}
      data-node-id="12594:33393"
    >
      {showLabel ? (
        <p
          style={{
            fontFamily: '"Proxima Nova", system-ui, sans-serif',
            fontWeight: 700,
            fontSize: 24,
            letterSpacing: '0.3px',
            color: '#000000',
            margin: 0,
            whiteSpace: 'nowrap',
          }}
        >
          {label}
        </p>
      ) : null}

      <div aria-hidden="true" style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
        {DOT_DELAYS.map((delay) => (
          <span
            key={delay}
            style={{
              width: 12,
              height: 12,
              borderRadius: '50%',
              background: '#00669E',
              animation: 'ndp-dot-bounce 0.9s ease-in-out infinite',
              animationDelay: delay,
            }}
          />
        ))}
      </div>
    </div>
  )
}
