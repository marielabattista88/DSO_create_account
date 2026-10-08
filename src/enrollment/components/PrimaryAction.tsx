/**
 * Separation between a screen's content and its primary action.
 *
 * 40px en la fase 1 y en las pantallas de cuenta. Vive en un componente para
 * que el valor esté en un solo lugar en vez de re-decidirse por pantalla, y
 * para que una pantalla nueva lo herede en vez de tener que acordarse.
 *
 * La fase 2 no usa esto: sus pasos separan 48, y el número lo pone
 * EnrollmentLayout, que es el único que los envuelve.
 *
 * The action must sit OUTSIDE any gapped flex container: a flex `gap` and this
 * margin are additive, so a button left inside a `gap-4` column would end up at
 * 56px, not 40px.
 */

import type { ReactNode } from 'react'

export const PRIMARY_ACTION_GAP = 40

export function PrimaryAction({ children }: { children: ReactNode }) {
  return <div style={{ marginTop: PRIMARY_ACTION_GAP }}>{children}</div>
}
