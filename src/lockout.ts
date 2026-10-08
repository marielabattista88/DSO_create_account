/**
 * The attempt limit and the wait, shared by every gate that has one.
 *
 * Three gates count attempts — the one-time code, the sign-in password, and the
 * identity check in the password reset — and product has confirmed they all use
 * the same numbers: three tries, then an hour. Keeping the numbers here is what
 * stops "3 attempts" on one screen becoming "5 attempts" on another the next
 * time one of them is revisited.
 *
 * This module is only the policy and the phrasing. Where a lock is *kept* is
 * `auth/data/lockouts.ts`; the OTP screens hold theirs in component state.
 */

/** Failed attempts allowed before a gate locks. */
export const MAX_ATTEMPTS = 3

/** How long a lock lasts once those attempts are used up. */
export const LOCKOUT_MINUTES = 60

/**
 * "1 hour" / "45 minutes" — the full wait, phrased for the middle of a sentence.
 *
 * The default argument is what lets the OTP screens keep calling this with no
 * arguments at all.
 */
export function lockoutDuration(minutes: number = LOCKOUT_MINUTES): string {
  if (minutes % 60 === 0) {
    const hours = minutes / 60
    return hours === 1 ? '1 hour' : `${hours} hours`
  }
  return `${minutes} minutes`
}

/**
 * How much of the wait is left, phrased the same way.
 *
 * Rounds up, so a lock with 30 seconds on it says "1 minute" rather than
 * "0 minutes" — a countdown that reads zero while the door is still shut is the
 * thing that makes someone call support.
 */
export function remainingDuration(until: number, now: number = Date.now()): string {
  const minutesLeft = Math.ceil(Math.max(0, until - now) / 60_000)
  if (minutesLeft <= 1) return '1 minute'
  return lockoutDuration(minutesLeft)
}
