/**
 * One-time passcode policy — the single source of truth for both OTP screens.
 *
 * There are two of them (Phase 1's Verify Your Email and auth's shared sign-in /
 * password-reset code screen) and they are deliberate twins: a provider who
 * created their account last month should recognise the screen. Keeping the rules
 * here is what stops them drifting apart the next time one of these numbers
 * changes. It lives at the top of `src` rather than under `auth/` or
 * `enrollment/` because both feature areas own it equally.
 *
 * The rules:
 *   - a code is valid for 5 minutes; on expiry a fresh one is sent automatically
 *   - 3 incorrect entries lock verification for that email
 *   - while locked, nothing helps: not a new code, not a retry. The user waits an
 *     hour or calls support
 *
 * Prototype only: 123456 verifies, anything else fails. The lockout is held in
 * component state, so a reload clears it — there is no server to remember it.
 * Append ?codeSeconds=5 to either screen to watch the expiry without waiting.
 *
 * The attempt limit and the hour are not OTP-specific — the sign-in password and
 * the reset identity check use the same two numbers — so they live in
 * `src/lockout.ts` and are re-exported here under their OTP names.
 */

import { MAX_ATTEMPTS, lockoutDuration } from './lockout'

export { LOCKOUT_MINUTES, lockoutDuration } from './lockout'

export const VALID_CODE = '123456'
export const CODE_LENGTH = 6

/** 5 minutes. */
export const CODE_LIFETIME_SECONDS = 300

/** Incorrect entries allowed before verification locks. */
export const MAX_CODE_ATTEMPTS = MAX_ATTEMPTS

/** mm:ss with a leading zero on the minutes, as in the reference ("00:12"). */
export function formatTime(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

/** The message under the code boxes. Sentences, and never blames the user. */
export function codeErrorMessage(status: 'invalid' | 'locked', attemptsUsed: number): string {
  if (status === 'locked') {
    return `Too many incorrect attempts. You can try again in ${lockoutDuration()}.`
  }
  const left = MAX_CODE_ATTEMPTS - attemptsUsed
  return `That code is incorrect. ${left} ${left === 1 ? 'attempt' : 'attempts'} left.`
}
