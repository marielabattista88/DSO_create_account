/**
 * NationsDental wordmark — "nations" on a solid plate, "dental" beside it.
 *
 * Drawn in CSS because the Figma asset could not be exported through the MCP.
 * Swap for the real SVG when it is available.
 *
 * `surface` names the background the logo sits on: "light" is the navy version
 * for white surfaces.
 */

interface NationsDentalLogoProps {
  surface?: 'light' | 'dark'
  /** Height of the plate, in px. */
  height?: number
}

export function NationsDentalLogo({ surface = 'light', height = 20 }: NationsDentalLogoProps) {
  const onDark = surface === 'dark'
  const ink = onDark ? '#FFFFFF' : '#00497A'
  const plate = onDark ? '#FFFFFF' : '#00497A'
  const plateText = onDark ? '#002843' : '#FFFFFF'

  return (
    <span
      role="img"
      aria-label="NationsDental"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: height * 0.12,
        fontFamily: '"Proxima Nova", system-ui, sans-serif',
        fontSize: height * 0.72,
        lineHeight: 1,
        letterSpacing: '-0.01em',
        userSelect: 'none',
      }}
    >
      <span
        style={{
          background: plate,
          color: plateText,
          fontWeight: 600,
          height,
          display: 'inline-flex',
          alignItems: 'center',
          padding: `0 ${height * 0.18}px`,
        }}
      >
        nations
      </span>
      <span style={{ color: ink, fontWeight: 300 }}>dental</span>
    </span>
  )
}
