/**
 * The section marker from the Figma reference (node 7470:244081, "Graph pie") —
 * a donut whose navy arc grows as the section is completed.
 *
 * Geometry is scaled from the 72px Figma export rather than guessed: outer
 * radius 36 with a 7.2 ring, i.e. a ring 10% of the diameter. At the 24px slot
 * the design places it in, that is a 2.4px ring on a 10.8px centreline radius.
 */

import { cn } from 'nb-flexpay-ui'
import type { ProgressRingProps } from './types'

/** Ring thickness as a share of the diameter — 7.2/72 in the Figma export. */
const RING_RATIO = 0.1
/** Stroke of the not-started outline, constant across sizes in the design. */
const IDLE_STROKE = 1.5
/**
 * Figma specifies 6-on/6-off dashes. Fitting twelve segments to the
 * circumference instead lands at ~5.9 and closes the pattern seamlessly, rather
 * than leaving a ragged joint where the last dash meets the first.
 */
const IDLE_SEGMENTS = 12

export function ProgressRing({ progress, idle, size = 24, className }: ProgressRingProps) {
  const value = Math.min(1, Math.max(0, progress))
  // An explicit `idle` wins; otherwise an empty ring is a section not started.
  const isIdle = idle ?? value === 0

  const centre = size / 2
  const stroke = size * RING_RATIO
  const radius = (size - stroke) / 2
  const length = 2 * Math.PI * radius

  const idleRadius = (size - IDLE_STROKE) / 2
  const idleSegment = (2 * Math.PI * idleRadius) / IDLE_SEGMENTS

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      fill="none"
      aria-hidden="true"
      className={cn('shrink-0', className)}
    >
      {isIdle ? (
        /* The outline's stroke sits inside the box; Figma lets it bleed 0.75px
           past the frame, which would clip against the viewBox here. */
        <circle
          cx={centre}
          cy={centre}
          r={idleRadius}
          stroke="var(--nb-grey-300)"
          strokeWidth={IDLE_STROKE}
          strokeLinecap="round"
          strokeDasharray={`${idleSegment} ${idleSegment}`}
        />
      ) : (
        <>
          <circle cx={centre} cy={centre} r={radius} stroke="var(--nb-grey-300)" strokeWidth={stroke} />
          {value > 0 ? (
            <circle
              cx={centre}
              cy={centre}
              r={radius}
              stroke="var(--nb-navy)"
              strokeWidth={stroke}
              strokeLinecap="round"
              strokeDasharray={length}
              strokeDashoffset={length * (1 - value)}
              /* Starts the arc at 12 o'clock and runs it clockwise. */
              transform={`rotate(-90 ${centre} ${centre})`}
              style={{ transition: 'stroke-dashoffset 400ms ease-out' }}
            />
          ) : null}
        </>
      )}
    </svg>
  )
}

ProgressRing.displayName = 'ProgressRing'
