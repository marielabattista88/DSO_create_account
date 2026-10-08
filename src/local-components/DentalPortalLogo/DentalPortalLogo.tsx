/**
 * Dental Portal — el logo del portal.
 *
 *   DentalPortalLogo   el lockup: la palabra montada sobre el diente. `height`
 *                      en px. Figma "Dental Logo 2", nodo 76:2816.
 *   DentalPortalPlate  el diente sobre la placa night, tipo app icon (76:2806).
 *
 * La placa NO lleva prop `surface`, y no es un olvido: se trae su propio fondo
 * oscuro, así que funciona igual sobre blanco que sobre navy. Pedirle una
 * variante sería pedirle elegir entre dos fondos cuando ya tiene uno.
 *
 * OJO CON EL NOMBRE DE LA VARIANTE. Acá el prop es `surface` y no `variant`, y
 * es a propósito. Nombra la SUPERFICIE donde se apoya el logo: `surface="light"`
 * es la versión navy, para fondo claro. NationsBenefitsLogo, en esta misma
 * carpeta, usa `variant` con el criterio INVERSO — ahí variant="light" es el arte
 * claro, para fondo oscuro. Un mismo nombre con dos sentidos opuestos en la misma
 * carpeta es una trampa garantizada, así que este componente usa otro nombre.
 *
 * POR QUÉ LOS SVG SON COMPUESTOS Y NO EL EXPORT DIRECTO. Figma devuelve este
 * logo partido en tres piezas, y una de ellas con `rotate(2.27deg)`,
 * `skewX(0.02deg)` y anchos en `hypot()` sobre container queries. Reproducir eso
 * en CSS es frágil y se rompe en cuanto alguien toca el tamaño. Así que las tres
 * piezas se compusieron una sola vez en un SVG plano, con los mismos números que
 * Figma reporta, y se verificó contra su render. El componente es un solo <img>:
 * no hay geometría que pueda derivar.
 *
 * Para regenerar, los números son estos — todos porcentajes de Figma, sobre una
 * caja de 90.666 x 32:
 *   contenedor del diente  left 0, top 0, right 66.73 %, aspecto 108/114
 *   contorno principal     inset 10.64 % / 24.72 % / 5.32 % / 5.62 % del contenedor
 *   acento                 inset 4.6 % / 3.93 % / 66.3 % / 55.62 %, centrado ahí
 *                          y rotado 2.27° — ese inset es la caja YA rotada
 *   palabra                inset 31.46 % / 0 / 38.71 % / 13.77 % de la caja externa
 *   orden de pintado       acento, contorno, palabra encima
 */

import logo2Light from './assets/logo2-light.svg'
import logo2Dark from './assets/logo2-dark.svg'
import plate from './assets/plate.svg'

/** Sobre qué fondo se apoya el logo. */
type Surface = 'light' | 'dark'

const LOCKUP = { light: logo2Light, dark: logo2Dark }

/** 90.666 / 32, del nodo 76:2816. */
const LOCKUP_ASPECT = 2.83331

interface LogoProps {
  surface?: Surface
  /** Alto en px. El ancho sale de la proporción. Nativo a 32 en Figma. */
  height?: number
  className?: string
}

export function DentalPortalLogo({ surface = 'light', height = 32, className }: LogoProps) {
  return (
    <img
      className={className}
      src={LOCKUP[surface]}
      alt="Dental Portal"
      width={height * LOCKUP_ASPECT}
      height={height}
      style={{ display: 'block', flexShrink: 0 }}
      data-node-id="76:2816"
    />
  )
}

interface PlateProps {
  /** Lado de la placa en px. Nativa a 40 en Figma. */
  size?: number
  className?: string
}

/**
 * El diente sobre la placa night — nodo 76:2806.
 *
 * Un solo asset y no placa + diente por separado: el SVG trae el degradado
 * radial del resplandor y el lineal del borde, y reconstruirlos con tokens
 * daría una aproximación, no la marca.
 */
export function DentalPortalPlate({ size = 40, className }: PlateProps) {
  return (
    <img
      className={className}
      src={plate}
      alt="Dental Portal"
      width={size}
      height={size}
      style={{ display: 'block', flexShrink: 0 }}
      data-node-id="76:2806"
    />
  )
}

DentalPortalLogo.displayName = 'DentalPortalLogo'
DentalPortalPlate.displayName = 'DentalPortalPlate'
