/**
 * Two-level progress stepper — sections, each with a partial progress ring, over
 * a list of nested steps.
 *
 * Implements the Figma reference at node 7489:214473. `nb-flexpay-ui` ships
 * three steppers and none of them is this shape: `Stepper` is a flat numbered
 * list, `StepsProgress` is a compact dot bar, and `StepProgressAccordion` is a
 * collapsible table. So this is built on top of the library — its `cn`, its
 * `Icon`, and the project's Figma tokens — rather than around it.
 *
 * Purely presentational: callers pass each step's status and handle activation,
 * which keeps it usable by any flow rather than only by enrollment.
 *
 * Spacing and type are lifted from the Figma frame, not approximated:
 * 8px between sections, 13px marker-to-text, 4px top / 8px bottom on the text
 * column, 12px between title and steps and between steps, 4px bullet-to-label.
 */

import { cn } from 'nb-flexpay-ui'
import { ProgressRing } from './ProgressRing'
import { StepBullet } from './StepBullet'
import type { ProgressStepperProps, ProgressStepperSection } from './types'

/** Diameter of the section ring, and therefore the marker column's width. */
const MARKER_SIZE = 24

/** Share of a section's steps that count as resolved. */
function derivedProgress(section: ProgressStepperSection): number {
  if (typeof section.progress === 'number') return section.progress
  if (section.steps.length === 0) return 0
  const resolved = section.steps.filter(
    (step) => step.status === 'completed' || step.status === 'skipped',
  ).length
  return resolved / section.steps.length
}

export function ProgressStepper({
  sections,
  label = 'Progress',
  className,
  onStepSelect,
  ref,
}: ProgressStepperProps) {
  return (
    <nav ref={ref} aria-label={label} className={className}>
      <ol className="m-0 flex list-none flex-col gap-2 p-0">
        {sections.map((section, sectionIndex) => {
          const progress = derivedProgress(section)
          const isCurrent = section.steps.some((step) => step.status === 'current')
          const isLast = sectionIndex === sections.length - 1

          return (
            <li key={section.id}>
              <div className="flex items-start" style={{ gap: 13 }}>
                <div
                  className="flex flex-col items-center self-stretch"
                  style={{ width: MARKER_SIZE }}
                >
                  {/* Standing in a section counts as entering it, so its ring
                      switches to the solid track even before anything is done. */}
                  <ProgressRing
                    progress={progress}
                    idle={progress === 0 && !isCurrent}
                    size={MARKER_SIZE}
                  />

                  {isLast ? null : (
                    /* A repeating gradient rather than `border-left: dashed`: CSS
                       derives the dash size and gap from the border width, so at
                       1.5px it renders as a hairline with no way to tune it.
                       This is Figma's exact 4-on/4-off. */
                    <span
                      aria-hidden="true"
                      className="flex-1"
                      style={{
                        width: 1.5,
                        minHeight: 12,
                        backgroundImage:
                          'repeating-linear-gradient(to bottom, var(--nb-grey-300) 0 4px, transparent 4px 8px)',
                      }}
                    />
                  )}
                </div>

                <div
                  className="flex flex-1 flex-col"
                  style={{ gap: 12, paddingTop: 4, paddingBottom: 8 }}
                >
                  {/* body-2 en vez de los valores a mano: es el mismo 16 /
                      semibold / .3px que pide Figma, definido en un solo lugar. */}
                  <p className="body-2 m-0" style={{ color: 'var(--nb-woodsmoke)' }}>
                    {section.title}
                  </p>

                  <ul className="m-0 flex list-none flex-col p-0" style={{ gap: 12 }}>
                    {section.steps.map((step) => {
                      const activatable =
                        Boolean(onStepSelect) && step.status !== 'current' && step.status !== 'blocked'

                      return (
                        <li key={step.id}>
                          <button
                            type="button"
                            disabled={!activatable}
                            aria-current={step.status === 'current' ? 'step' : undefined}
                            onClick={activatable ? () => onStepSelect?.(step, section) : undefined}
                            className={cn(
                              'flex w-full items-center border-0 bg-transparent p-0 text-left',
                              activatable ? 'cursor-pointer' : 'cursor-default',
                            )}
                            style={{ gap: 4 }}
                          >
                            <StepBullet status={step.status} />
                            {/* body-5 para el paso actual, body-4 para el resto:
                                los dos estilos que nombra el diseño, en navy y
                                grey900. Los no alcanzables usan el mismo gris que
                                los pendientes — ver la nota en StepBullet. */}
                            <span
                              className={step.status === 'current' ? 'body-5' : 'body-4'}
                              style={{
                                color:
                                  step.status === 'current'
                                    ? 'var(--nb-navy)'
                                    : 'var(--nb-grey-900)',
                              }}
                            >
                              {step.title}
                              {step.note ? ` — ${step.note}` : ''}
                            </span>
                          </button>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              </div>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

ProgressStepper.displayName = 'ProgressStepper'
