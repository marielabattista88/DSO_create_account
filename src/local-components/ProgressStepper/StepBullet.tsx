/**
 * The nested-step marker from the Figma reference — a 14px radio that becomes a
 * filled disc with a check once the step is resolved.
 *
 * Why this does not use `<Icon name="check_circle" type="filled" fill={…} />`:
 * the icon component tints by regex-replacing every `fill` attribute in the SVG
 * with the value you pass. `check_circle_fill` is two-tone (a coloured disc plus
 * a white check), so tinting it paints the check the same colour as the disc and
 * it vanishes. The check path below is that icon's own geometry, drawn over a
 * disc we colour ourselves — the glyph the design system intends, in navy.
 */

import { cn } from 'nb-flexpay-ui'
import type { ProgressStepStatus, StepBulletProps } from './types'

/** `check_circle_fill`'s check, in its native 24-unit box. */
const CHECK_PATH =
  'M16.0186 8.35157C16.3766 8.00685 16.9463 8.01797 17.291 8.37599C17.6357 8.73398 17.6254 9.30367 17.2676 9.64845L10.5918 16.0772C10.2433 16.4127 9.69131 16.4126 9.34277 16.0772L6.37598 13.2197C6.01798 12.875 6.00692 12.3053 6.35156 11.9473C6.69625 11.5893 7.26597 11.5784 7.62402 11.9229L9.9668 14.1787L16.0186 8.35157Z'

/** The glyph is drawn in a 14-unit box, so the check scales down to fit it. */
const BOX = 14
const CHECK_SCALE = BOX / 24

/**
 * Navy para el paso donde está el usuario, grey500 para todo lo demás.
 *
 * `blocked` se dibuja igual que `pending` a propósito. Antes iba un tono más
 * claro para leerse como no disponible, y el resultado era que media barra
 * quedaba lavada — contra Figma (nodos 7470:244099 / 244100 / 244106) hay TRES
 * estados de tarea, no cinco. Que un paso no sea alcanzable sigue siendo cierto
 * y sigue deshabilitando el botón; simplemente no se pinta distinto.
 */
function outlineFor(status: ProgressStepStatus): string {
  if (status === 'current') return 'var(--nb-navy)'
  return 'var(--nb-grey-500)'
}

export function StepBullet({ status, size = 16, className }: StepBulletProps) {
  // Figma pads the glyph by 1px inside its box on every side.
  const glyph = size - 2
  const resolved = status === 'completed' || status === 'skipped'

  return (
    <span
      aria-hidden="true"
      className={cn('flex shrink-0 items-center justify-center', className)}
      style={{ width: size, height: size }}
    >
      <svg width={glyph} height={glyph} viewBox={`0 0 ${BOX} ${BOX}`} fill="none">
        {resolved ? (
          <>
            <circle
              cx={BOX / 2}
              cy={BOX / 2}
              r={BOX / 2}
              /* A skipped step is resolved but not achieved, so it greys out. */
              fill={status === 'skipped' ? 'var(--nb-grey-500)' : 'var(--nb-navy)'}
            />
            {/* Ghost white, no blanco puro: es lo que especifica el nodo. */}
            <path
              d={CHECK_PATH}
              fill="var(--nb-ghost-white)"
              transform={`scale(${CHECK_SCALE})`}
            />
          </>
        ) : (
          <circle cx={BOX / 2} cy={BOX / 2} r={BOX / 2 - 0.5} stroke={outlineFor(status)} />
        )}
      </svg>
    </span>
  )
}

StepBullet.displayName = 'StepBullet'
