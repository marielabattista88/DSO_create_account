/**
 * Input masks in the array form nb-flexpay-ui's FieldMaskInput expects
 * (a RegExp per digit, literals inserted automatically).
 */

/** EIN — `XX-XXXXXXX`. */
export const EIN_MASK = [/\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/]

/** ITIN — `XXX-XX-XXXX`. A sole proprietorship files under an ITIN. */
export const ITIN_MASK = [/\d/, /\d/, /\d/, '-', /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]
