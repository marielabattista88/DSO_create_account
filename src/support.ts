/**
 * The Call Center number, in one place.
 *
 * Three separate dead ends offer it — a locked one-time code, a locked password,
 * a locked identity check — and a support number that disagrees with itself
 * across three screens is worse than no number at all.
 *
 * TODO: replace with the real Zendesk support line before this ships.
 *
 * Deliberately an obviously-fake number. The portal's writing rules forbid
 * showing an invented support contact, so this must not be mistaken for a live
 * one — a plausible-looking placeholder is the thing that actually gets shipped
 * by accident.
 */

export const ZENDESK_SUPPORT_PHONE = '(000) 000-0000'

/** `tel:` needs the digits only. */
export const ZENDESK_SUPPORT_TEL = `tel:${ZENDESK_SUPPORT_PHONE.replace(/\D/g, '')}`
