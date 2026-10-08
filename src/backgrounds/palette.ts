/**
 * Brand background palette.
 *
 * Derived from the Claims portal logo's own SVG layers rather than picked by eye:
 *   mark.svg    → #00CBFF / #00CAFF  (bright cyan, the mark's glow)
 *   stroke.svg  → #2DD3FF → #0C384F  (cyan-to-deep-navy gradient on the rim)
 *   base.svg    → #CECECE
 *
 * The reference hero (Claims-Portals-HI-FI, node 3758:43128) uses a coral/orange
 * hairline accent. That accent is replaced here by the logo's cyan so the
 * background and the logo read as one system.
 */

export const backgroundPalette = {
  /** Deepest tone — from the logo rim gradient's dark stop. */
  deep: '#0C384F',
  /** Brand navy, Primary/Navy in the Figma library. */
  navy: '#00669E',
  /** Darkest fill, for the recessed shapes. */
  abyss: '#062A3D',
  /** Mid teal used for the large translucent shapes. */
  teal: '#0E5A7A',
  /** Hairline accent — replaces the reference's orange. */
  accent: '#2DD3FF',
  /** Brightest cyan, from the mark. */
  accentBright: '#00CBFF',
  /**
   * Muting overlay, taken verbatim from the reference composition
   * (Claims-Portals-HI-FI node 7517:97619): rgba(0, 27, 46, 0.5) laid over the
   * hero. It is what turns the bright hero into the subdued version.
   */
  overlay: 'rgba(0, 27, 46, 0.5)',
  /** Bottom hairline on the hero, WF Base/800 in the reference. */
  edge: '#2D3648',
} as const

export type BackgroundPalette = typeof backgroundPalette
