/**
 * Email address rules — the part the front end can decide on its own.
 *
 * Lives at the root next to `src/otp-policy.ts` because both enrollment and
 * sign-in ask for an address, and the two were drifting: enrollment carried its
 * own copy of the pattern and `auth/data/accounts.ts` carried another.
 *
 * Deliberately shape-checking, not RFC 5322. The only addresses rejected here are
 * the ones that cannot be right no matter which mail server we ask —
 * "mariela.com" (no @), "mariela@nationsbenefits" (no domain suffix),
 * "a@b..com" (empty label). Whether a well-formed address actually receives mail
 * is the verification code's job, not this file's, so anything arguable is
 * allowed through rather than blocked with a message we cannot stand behind.
 */

/**
 * local@label(.label)*.tld — the tld is alphabetic and at least two characters,
 * which is what rules out "mariela@com" without also rejecting real addresses.
 */
export const EMAIL_PATTERN = /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)*\.[A-Za-z]{2,}$/

/**
 * The message for an address we can already reject, or null when it is
 * well-formed. Empty and malformed are separate messages: "Enter a valid email
 * address" on an untouched field reads as an accusation about nothing.
 */
export function emailError(raw: unknown): string | null {
  const value = String(raw ?? '').trim()
  if (!value) return 'Enter your email address.'
  if (!EMAIL_PATTERN.test(value)) return 'Enter a valid email address.'
  return null
}

/**
 * The empty error bag a react-hook-form resolver returns when everything passed.
 *
 * Annotated here instead of written as a bare `{}` at each call site: the library
 * types a passing resolver's `errors` as `Record<string, never>`, and TypeScript
 * widens a `{}` returned alongside a failing `{ email: … }` branch into
 * `{ email?: undefined }` — which `Record<string, never>` rejects, because
 * `undefined` is not `never`. Naming the value pins the type and the resolver
 * type-checks.
 */
export const NO_FIELD_ERRORS: Record<string, never> = {}
