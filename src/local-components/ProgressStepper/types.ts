import type { Ref } from 'react'

/**
 * Status of a single nested step.
 *
 * `skipped` and `blocked` are the two states the Figma reference does not draw.
 * `skipped` is a resolved step the user chose to pass on — it still fills the
 * section ring. `blocked` is a step that is not reachable yet, drawn a shade
 * lighter so it reads as unavailable rather than merely unvisited.
 */
export type ProgressStepStatus = 'completed' | 'current' | 'pending' | 'skipped' | 'blocked'

export interface ProgressStep {
  id: string
  title: string
  status: ProgressStepStatus
  /**
   * Qualifier appended to the title inside the same text run, e.g. `Optional`
   * renders as "Verify Your Identity — Optional". Figma keeps it typographically
   * identical to the title rather than promoting it to a Tag.
   */
  note?: string
}

export interface ProgressStepperSection {
  id: string
  title: string
  steps: ProgressStep[]
  /**
   * How full the section's ring is, 0–1. Defaults to the share of its steps
   * that are `completed` or `skipped`, which is what you want in almost every
   * case; pass it explicitly only when progress is not step-derived.
   */
  progress?: number
}

export interface ProgressStepperProps {
  sections: ProgressStepperSection[]
  /** Accessible name for the `nav` landmark. */
  label?: string
  className?: string
  /**
   * Called when a step is activated. Steps with status `current` or `blocked`
   * are not activatable, so this never fires for them.
   */
  onStepSelect?: (step: ProgressStep, section: ProgressStepperSection) => void
  ref?: Ref<HTMLElement>
}

export interface ProgressRingProps {
  /** 0–1. Values outside the range are clamped. */
  progress: number
  /**
   * Renders the dashed not-started outline instead of the track-plus-arc ring.
   * Defaults to `true` when `progress` is 0.
   */
  idle?: boolean
  /** Outer diameter in px. Ring thickness and radii scale with it. */
  size?: number
  className?: string
}

export interface StepBulletProps {
  status: ProgressStepStatus
  /** Outer box in px. The glyph inside is drawn at `size - 2`. */
  size?: number
  className?: string
}
