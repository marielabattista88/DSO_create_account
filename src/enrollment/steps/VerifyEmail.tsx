/**
 * Step 2 — Check Your Inbox.
 *
 * The sixth digit submits; there is no Verify button. Prototype code: 123456.
 * Three wrong entries lock verification (see src/otp-policy.ts). The code
 * expires after five minutes and a new one is issued automatically; append
 * ?codeSeconds=5 to watch that without waiting.
 */

import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { BannerAlert, DigitInput } from 'nb-flexpay-ui'
import { AuthLayout } from '../components/AuthLayout'
import { CodeLockedNotice } from '../../local-components'
import {
  CODE_LENGTH,
  CODE_LIFETIME_SECONDS,
  MAX_CODE_ATTEMPTS,
  VALID_CODE,
  codeErrorMessage,
  formatTime,
  lockoutDuration,
} from '../../otp-policy'
import { useEnrollment } from '../data/store'

type Status = 'idle' | 'verified' | 'invalid' | 'locked'

const linkStyle: React.CSSProperties = {
  fontFamily: '"Proxima Nova", system-ui, sans-serif',
  fontWeight: 600,
  fontSize: 16,
  lineHeight: '20px',
  letterSpacing: '0.3px',
  color: '#00669E',
  textDecoration: 'underline',
  background: 'transparent',
  border: 0,
  cursor: 'pointer',
}

export function VerifyEmail() {
  const navigate = useNavigate()
  const { state } = useEnrollment()
  const [params] = useSearchParams()
  const lifetime = Number(params.get('codeSeconds')) || CODE_LIFETIME_SECONDS

  const [code, setCode] = useState('')
  const [touched, setTouched] = useState(false)
  const [status, setStatus] = useState<Status>('idle')
  const [attempts, setAttempts] = useState(0)
  const [secondsLeft, setSecondsLeft] = useState(lifetime)
  const [reissuedBecause, setReissuedBecause] = useState<'expired' | 'manual' | null>(null)
  // Remounts DigitInput on reissue: it keeps each box's value in its own state.
  const [codeVersion, setCodeVersion] = useState(0)
  const checkedRef = useRef('')

  useEffect(() => {
    if (!state.email) navigate('/create-account/email', { replace: true })
  }, [state.email, navigate])

  const reissueCode = useCallback(
    (reason: 'expired' | 'manual') => {
      checkedRef.current = ''
      setCode('')
      setTouched(false)
      setAttempts(0)
      setStatus('idle')
      setSecondsLeft(lifetime)
      setReissuedBecause(reason)
      setCodeVersion((v) => v + 1)
    },
    [lifetime],
  )

  // Stops on `locked`: expiry resets the attempt count, so a running timer would
  // lift the lock on its own.
  useEffect(() => {
    if (status === 'verified' || status === 'locked') return
    const timer = window.setTimeout(() => {
      if (secondsLeft <= 1) reissueCode('expired')
      else setSecondsLeft(secondsLeft - 1)
    }, 1000)
    return () => window.clearTimeout(timer)
  }, [secondsLeft, status, reissueCode])

  function handleChange(value: unknown) {
    const next = String(value ?? '')
    setCode(next)
    setReissuedBecause(null)

    if (next.length < CODE_LENGTH) {
      if (status === 'invalid') setStatus('idle')
      checkedRef.current = ''
      return
    }
    if (status === 'locked' || checkedRef.current === next) return

    checkedRef.current = next
    setTouched(true)

    if (next === VALID_CODE) {
      setStatus('verified')
      window.setTimeout(() => navigate('/create-account/password'), 900)
      return
    }

    const used = attempts + 1
    setAttempts(used)
    setStatus(used >= MAX_CODE_ATTEMPTS ? 'locked' : 'invalid')
  }

  const locked = status === 'locked'
  const hasBanner = locked || reissuedBecause !== null
  const errorMessage = status === 'invalid' || locked ? codeErrorMessage(status, attempts) : null

  return (
    <AuthLayout
      step={2}
      align="center"
      contentGap={hasBanner ? 16 : 48}
      title="Check Your Inbox"
      description={
        <>
          We’ve just emailed you a one-time passcode to (
          <a href={`mailto:${state.email}`} style={{ color: 'inherit', textDecoration: 'underline' }}>
            {state.email}
          </a>
          ). Please enter the passcode below:
        </>
      }
    >
      {reissuedBecause ? (
        <BannerAlert
          show
          variant="neutral"
          title="New Code Sent"
          text={
            reissuedBecause === 'expired'
              ? 'Your previous code expired. We sent you a new one.'
              : 'Check your inbox for your new code.'
          }
          hideCloseButton
          className="mb-4"
        />
      ) : null}

      {locked ? <CodeLockedNotice /> : null}

      <div className="flex flex-col items-center" style={{ gap: 16 }}>
        <div className="flex w-full flex-col items-center" style={{ gap: 4 }}>
          <DigitInput
            key={codeVersion}
            length={CODE_LENGTH}
            digitType="number"
            name="verification-code"
            value={code}
            touched={touched}
            status={status === 'verified' ? 'success' : errorMessage ? 'error' : 'typed'}
            error={errorMessage}
            disabled={locked || status === 'verified'}
            onChange={handleChange}
            aria-label="Verification Code"
          />

          {/* DigitInput's `error` only colours the boxes; the text is shown here. */}
          {errorMessage ? (
            <p style={{ fontSize: 14, color: '#C73740', margin: 0, textAlign: 'center' }} role="alert">
              {errorMessage}
            </p>
          ) : null}
        </div>

        <div className="flex flex-col items-center" style={{ gap: 32 }}>
          <div className="flex flex-col items-center" style={{ gap: 4 }}>
            <button
              type="button"
              disabled={locked}
              onClick={() => reissueCode('manual')}
              style={{
                ...linkStyle,
                height: 32,
                padding: '6px 16px',
                color: locked ? 'var(--nb-grey-500)' : linkStyle.color,
                cursor: locked ? 'default' : 'pointer',
              }}
            >
              Resend Code
            </button>

            <p
              style={{ fontSize: 14, lineHeight: '20px', color: '#000000', margin: 0, textAlign: 'center' }}
              aria-live="polite"
            >
              {status === 'verified'
                ? 'Taking you to the next step…'
                : locked
                  ? `You can try again in ${lockoutDuration()}.`
                  : `Your code will expire in ${formatTime(secondsLeft)}`}
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate('/create-account/email')}
            style={{ ...linkStyle, height: 36, padding: 8 }}
          >
            Change Email
          </button>
        </div>
      </div>
    </AuthLayout>
  )
}
