/**
 * The password policy, in one place.
 *
 * Three screens now ask for a password — Create Your Password during enrollment,
 * Sign In, and Create Your New Password at the end of a reset — and a policy
 * that exists in three copies is a policy that will disagree with itself. The
 * rules, the live checklist and the show/hide eye all live here.
 *
 * Extracted from CreatePassword, where the behaviour and its reasoning were
 * worked out; the comments below come with it.
 *
 * Split from PasswordField.tsx only to satisfy react-refresh/only-export-components:
 * a file that exports both components and constants breaks fast refresh.
 */

import { Icon } from 'nb-flexpay-icons/component'

export interface PasswordRule {
  id: string
  label: string
  test: (value: string) => boolean
}

/** PRODUCT QUESTION: confirm the password policy against the portal standard. */
export const PASSWORD_RULES: PasswordRule[] = [
  { id: 'length', label: 'At least 8 characters', test: (v) => v.length >= 8 },
  { id: 'upper', label: 'At least one uppercase letter (A–Z)', test: (v) => /[A-Z]/.test(v) },
  { id: 'lower', label: 'At least one lowercase letter (a–z)', test: (v) => /[a-z]/.test(v) },
  { id: 'number', label: 'At least one number (0–9)', test: (v) => /\d/.test(v) },
  {
    id: 'symbol',
    label: 'At least one special character (e.g. ! @ # $ % ^ & *)',
    test: (v) => /[^A-Za-z0-9]/.test(v),
  },
]

export function passwordMeetsPolicy(value: string): boolean {
  return PASSWORD_RULES.every((rule) => rule.test(value))
}

/**
 * The library's own eye, wired through FieldInput's `hiddenCustomButton`.
 *
 * The Input keeps the masked/unmasked state internally and starts masked, so
 * `active` is what shows while the value is hidden and `inactive` once it is
 * revealed. That also means the field's `type` must be `text`: with
 * `type="password"` the Input never unmasks, because it computes the effective
 * type as `hidden ? 'password' : type`.
 *
 * Each glyph is wrapped rather than passed bare. The library renders this slot
 * as `<button class="nb-pos-lib-btn--icon focus:outline-hidden">` with no
 * alignment of its own, and nb-flexpay-icons' Icon is an inline-block div — so
 * it sits on the button's text baseline and reserves descender space under
 * itself. The button ends up taller than the glyph and the glyph rides high in
 * it. A flex wrapper kills the line box, the button shrinks to the icon, and
 * the input row's own `items-center` does the centring from there.
 *
 * Fixing it here rather than in CSS: the same class is on the clear button,
 * which the library already gives `flex items-center justify-center`. Only this
 * slot is missing them, so only this slot is patched.
 */
/* A plain builder, not a component: this file exports constants, and adding a
   component to it breaks fast refresh for everything importing from here. */
const eyeGlyph = (name: 'eye' | 'eye_off') => (
  <span className="flex items-center justify-center">
    <Icon category="uiHelpersInterface" name={name} width={16} height={16} />
  </span>
)

export const PASSWORD_EYE = {
  active: eyeGlyph('eye_off'),
  inactive: eyeGlyph('eye'),
}
