/**
 * Anillo de estado: espera → éxito, o espera → error.
 *
 * Es la animación de CDH (`loader-success.json` / `loader-error.json`)
 * reproducida en SVG + CSS. Los tiempos, radios y colores salen de esos
 * archivos; están anotados en ./StatusAnimation.css junto al keyframe que los
 * usa.
 *
 * POR QUÉ NO SE REPRODUCEN LOS JSON DIRECTO. Hace falta un reproductor, y
 * `lottie-web` no está en el feed de Azure que usa el proyecto — el feed no
 * proxea npmjs, así que `npm install` falla con 404. Instalarlo desde el
 * registry público metería una URL de npmjs en el lockfile y saltearía el feed
 * de la organización, que no es una decisión para tomar de callado. Si alguien
 * agrega `lottie-web` al feed, este componente se reemplaza por el reproductor
 * y los JSON pasan a ser la única fuente.
 *
 * El anillo en espera se repite porque no sabemos cuánto va a tardar. Al
 * resolver arranca completo: si el estado cambia a mitad del barrido habría un
 * salto, y el colapso inmediato lo tapa. Lottie hace lo mismo.
 */

import './StatusAnimation.css'

export type StatusAnimationState = 'pending' | 'success' | 'error'

interface StatusAnimationProps {
  status: StatusAnimationState
  /** Lado en px. El dibujo es 100 × 100. */
  size?: number
  className?: string
}

/** Del JSON: el check va (39.33,50) → (46,56.67) → (60.67,42). */
const CHECK = '39.33,50 46,56.67 60.67,42'
/** Y las dos barras de la cruz, cada una cruzando el centro. */
const BARS = ['42,42 58,58', '58,42 42,58'] as const

export function StatusAnimation({ status, size = 96, className }: StatusAnimationProps) {
  return (
    <svg
      className={['ndp-status', className].filter(Boolean).join(' ')}
      data-status={status}
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      role="img"
      aria-label={
        status === 'pending' ? 'Working' : status === 'success' ? 'Done' : 'Something went wrong'
      }
    >
      <g className="ndp-status__shake">
        <g className="ndp-status__ctrl">
          {/* El disco de acento va detrás de todo: es el halo del final. */}
          <circle className="ndp-status__disc" cx="50" cy="50" r="40" />
          <circle className="ndp-status__track" cx="50" cy="50" r="34" strokeWidth="6" />
          <circle className="ndp-status__ring" cx="50" cy="50" r="34" strokeWidth="6" />

          {status === 'success' ? (
            <polyline
              className="ndp-status__check"
              points={CHECK}
              /* pathLength=1 deja el dash en unidades 0..1, así el trazo no
                 depende del largo real del recorrido. */
              pathLength={1}
              stroke="var(--nb-ghost-white)"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ) : null}

          {status === 'error'
            ? BARS.map((points) => (
                <polyline
                  key={points}
                  className="ndp-status__bar"
                  points={points}
                  stroke="var(--nb-ghost-white)"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              ))
            : null}
        </g>
      </g>
    </svg>
  )
}

StatusAnimation.displayName = 'StatusAnimation'
