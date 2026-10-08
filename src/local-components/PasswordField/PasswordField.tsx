/**
 * The password inputs and the live requirement checklist.
 *
 * The policy they enforce lives in policy.tsx — see the note there on the split.
 */

import { FieldInput } from 'nb-flexpay-ui'
import checkSuccess from '../../enrollment/assets/check-success.svg'
import checkError from '../../enrollment/assets/check-error.svg'
import { PASSWORD_EYE, PASSWORD_RULES } from './policy'

/**
 * A FieldInput preconfigured for passwords.
 *
 * hideClearButton because the clear "×" only appears once there is a value, and
 * it shoves the eye leftwards as you type.
 *
 * `labelAction` puts a control on the label's own row — where Forgot Password
 * lives in most apps. Below the field it costs a whole row of its own and lands
 * between the input and the primary button, which is the worst place for a
 * tertiary action: it is the last thing read before the thing you came to click.
 *
 * With an action, the label is rendered here rather than passed to FieldInput,
 * because FieldInput's label is a single string. That also fixes an omission:
 * the library renders its label as a <span> with no htmlFor, so it is not
 * actually associated with the input. The Input atom sets id={name}, so the
 * <label htmlFor> below is a real one.
 */
export function PasswordInput({
  name,
  label,
  autoComplete = 'new-password',
  labelAction,
}: {
  name: string
  label: string
  autoComplete?: string
  labelAction?: React.ReactNode
}) {
  const field = (
    <FieldInput
      name={name}
      label={labelAction ? undefined : label}
      required
      type="text"
      autoComplete={autoComplete}
      hideClearButton
      hiddenCustomButton={PASSWORD_EYE}
    />
  )

  if (!labelAction) return field

  return (
    <div className="w-full">
      {/* body-2 and mb-1 are what FieldInput's own label uses, so this row is
          indistinguishable from the Email field's label above it. */}
      <div className="mb-1 flex items-center justify-between gap-4">
        <label htmlFor={name} className="body-2 text-primary-woods-smoke">
          {label}*
        </label>
        {labelAction}
      </div>
      {field}
    </div>
  )
}

/**
 * Grey until the field has content: an untouched form should not open with five
 * red crosses. Once there is something to judge, met is green and unmet is red.
 */
function RuleIcon({ state }: { state: 'idle' | 'met' | 'unmet' }) {
  if (state === 'idle') {
    /* nb-flexpay-icons has no empty-circle glyph, and the nearest candidates
       (check_circle, pending) both assert an outcome this state does not have.
       A bordered box is the honest stand-in — and it is not an icon import. */
    return (
      <span
        aria-hidden
        className="shrink-0"
        style={{
          width: 16,
          height: 16,
          borderRadius: '50%',
          border: '1.5px solid var(--nb-grey-500)',
        }}
      />
    )
  }
  return (
    <span
      aria-hidden
      className="flex shrink-0 items-center justify-center"
      style={{ width: 16, height: 16 }}
    >
      <img
        src={state === 'met' ? checkSuccess : checkError}
        alt=""
        style={{ width: 14.33, height: 14.33 }}
      />
    </span>
  )
}

/** The live checklist. Requirements are shown before the user types rather than
    surfaced as errors afterwards, and each one resolves as it is satisfied. */
export function PasswordRuleList({ password }: { password: string }) {
  return (
    <ul className="m-0 flex list-none flex-col gap-2 p-0">
      {PASSWORD_RULES.map((rule) => {
        const state = !password ? 'idle' : rule.test(password) ? 'met' : 'unmet'
        return (
          <li
            key={rule.id}
            className="flex items-center gap-1"
            style={{ fontSize: 14, lineHeight: '18px', color: 'var(--nb-woodsmoke)' }}
          >
            <RuleIcon state={state} />
            <span>{rule.label}</span>
          </li>
        )
      })}
    </ul>
  )
}
