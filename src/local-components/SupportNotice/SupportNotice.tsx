/**
 * "Need Help Sooner?" — the Call Center number, offered next to a dead end.
 *
 * Its own banner rather than a sentence inside the error above it: folding a
 * phone number into an error message reads as fine print, and this is the only
 * thing on the screen the provider can actually act on. The error is the problem;
 * this is what to do about it.
 *
 * Shared by all three locked states — one-time code, password, identity check —
 * so the number and the offer cannot drift apart between them.
 */

import { BannerAlert } from 'nb-flexpay-ui'
import { ZENDESK_SUPPORT_PHONE, ZENDESK_SUPPORT_TEL } from '../../support'

interface SupportNoticeProps {
  /** Overrides the offer when the screen needs to name what help means here. */
  text?: string
  className?: string
}

export function SupportNotice({ text, className = 'mb-4' }: SupportNoticeProps) {
  return (
    <BannerAlert
      show
      variant="neutral"
      title="Need Help Sooner?"
      text={
        <>
          Call us at{' '}
          <a href={ZENDESK_SUPPORT_TEL} style={{ color: 'inherit', fontWeight: 600 }}>
            {ZENDESK_SUPPORT_PHONE}
          </a>{' '}
          {text ?? 'and we can help you get back into your account.'}
        </>
      }
      hideCloseButton
      className={className}
    />
  )
}

SupportNotice.displayName = 'SupportNotice'
