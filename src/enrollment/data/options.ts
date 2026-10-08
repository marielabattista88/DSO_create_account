/**
 * Option lists for every dropdown in the flow.
 *
 * Lists marked PRODUCT QUESTION are placeholders chosen so the prototype is
 * navigable — they are not confirmed business rules.
 */

export interface Option {
  value: string
  label: string
  /** Rendered under the label by the Select's option renderer. */
  subLabel?: string
}

/**
 * Portal languages, in the order given by the design.
 *
 * Each option shows the language in its own script with the English name
 * underneath, so a speaker can find their language without reading English.
 */
export const LANGUAGES: Option[] = [
  { value: 'en', label: 'English', subLabel: 'English' },
  { value: 'es', label: 'Español', subLabel: 'Spanish' },
  { value: 'ru', label: 'Русский', subLabel: 'Russian' },
  { value: 'zh-Hans', label: '中国人 (Simplified)', subLabel: 'Chinese (Mandarin)' },
  // The design labels this row's sublabel "Chinese (Simplified)", which duplicates
  // the row above and contradicts "(Traditional)". Corrected here — see the note
  // in the handoff; revert if the design is intentional.
  { value: 'zh-Hant', label: '中國人 (Traditional)', subLabel: 'Chinese (Traditional)' },
  { value: 'ja', label: '日本語', subLabel: 'Japanese' },
  { value: 'vi', label: 'Tiếng Việt', subLabel: 'Vietnamese' },
  { value: 'ko', label: '한국어', subLabel: 'Korean' },
  { value: 'fil', label: 'Filipino', subLabel: 'Filipino' },
]

export const PROVIDER_TYPES: Option[] = [
  { value: 'organization', label: 'Dental Service Organization' },
  { value: 'individual', label: 'Individual Provider' },
]

/** PRODUCT QUESTION: confirm the entity types accepted for Dental. */
export const BUSINESS_TYPES: Option[] = [
  { value: 'llc', label: 'Limited Liability Company (LLC)' },
  { value: 's-corp', label: 'S Corporation' },
  { value: 'c-corp', label: 'C Corporation' },
  { value: 'partnership', label: 'Partnership' },
  { value: 'sole-proprietor', label: 'Sole Proprietor' },
  { value: 'non-profit', label: 'Non-Profit Organization' },
]

/** PRODUCT QUESTION: confirm the operating models relevant to Dental. */
export const OPERATING_MODELS: Option[] = [
  { value: 'single', label: 'Single Practice Location' },
  { value: 'multi', label: 'Multiple Practice Locations' },
  { value: 'dso', label: 'Dental Service Organization' },
  { value: 'mobile', label: 'Mobile Dental Services' },
]

/** PRODUCT QUESTION: confirm the Dental practitioner classifications. */
export const CLASSIFICATIONS: Option[] = [
  { value: 'general-dentist', label: 'General Dentist' },
  { value: 'orthodontist', label: 'Orthodontist' },
  { value: 'periodontist', label: 'Periodontist' },
  { value: 'endodontist', label: 'Endodontist' },
  { value: 'oral-surgeon', label: 'Oral Surgeon' },
  { value: 'prosthodontist', label: 'Prosthodontist' },
  { value: 'pediatric-dentist', label: 'Pediatric Dentist' },
  { value: 'dental-hygienist', label: 'Dental Hygienist' },
]

/** PRODUCT QUESTION: confirm final roles and their permissions. */
export const STAFF_ROLES: Option[] = [
  { value: 'org-admin', label: 'Organization Administrator' },
  { value: 'location-admin', label: 'Location Administrator' },
  { value: 'billing', label: 'Billing' },
  { value: 'office-manager', label: 'Office Manager' },
  { value: 'staff', label: 'Staff Member' },
  { value: 'other', label: 'Other' },
]

/** PRODUCT QUESTION: confirm final access levels and what each one grants. */
export const ACCESS_LEVELS: Option[] = [
  { value: 'full', label: 'Full Access' },
  { value: 'organization', label: 'Organization Access' },
  { value: 'billing', label: 'Billing Access' },
  { value: 'location', label: 'Location Access' },
  { value: 'view-only', label: 'View Only' },
]

/** Access levels that restrict a staff member to specific Service Locations. */
export const LOCATION_SCOPED_ACCESS = ['location', 'view-only']

export const CONTACT_ROLES: Option[] = [
  { value: 'owner', label: 'Owner' },
  { value: 'practice-manager', label: 'Practice Manager' },
  { value: 'office-manager', label: 'Office Manager' },
  { value: 'billing-manager', label: 'Billing Manager' },
  { value: 'credentialing', label: 'Credentialing Contact' },
  { value: 'other', label: 'Other' },
]

export const SPOKEN_LANGUAGES: Option[] = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Spanish' },
  { value: 'zh', label: 'Chinese' },
  { value: 'tl', label: 'Tagalog' },
  { value: 'vi', label: 'Vietnamese' },
  { value: 'fr', label: 'French' },
  { value: 'ar', label: 'Arabic' },
  { value: 'ru', label: 'Russian' },
  { value: 'pt', label: 'Portuguese' },
  { value: 'ko', label: 'Korean' },
]

export const TIME_ZONES: Option[] = [
  { value: 'et', label: 'Eastern Time (ET)' },
  { value: 'ct', label: 'Central Time (CT)' },
  { value: 'mt', label: 'Mountain Time (MT)' },
  { value: 'pt', label: 'Pacific Time (PT)' },
  { value: 'akt', label: 'Alaska Time (AKT)' },
  { value: 'hat', label: 'Hawaii-Aleutian Time (HAT)' },
]

export const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

/**
 * PRODUCT QUESTION: confirm the accessibility and services list for Dental.
 * "Pediatric Services" is included because it is a Dental-relevant service;
 * the hearing-specific options from the reference designs were dropped.
 */
export const ACCESSIBILITY_OPTIONS: Option[] = [
  { value: 'ada', label: 'ADA Compliant' },
  { value: 'transit', label: 'Public Transportation Nearby' },
  { value: 'special-needs', label: 'Disability Or Special Needs Accessible' },
  { value: 'pediatric', label: 'Pediatric Services Available' },
]

export const US_STATES: Option[] = [
  'AL','AK','AZ','AR','CA','CO','CT','DE','DC','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME',
  'MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI',
  'SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY',
].map((s) => ({ value: s, label: s }))

/**
 * PRODUCT QUESTION: the reference designs include a "Brands You Work With"
 * section (manufacturers, ship-to account). That is hearing-aid specific.
 * Confirm whether Dental needs any equivalent before this is built.
 */
export const BRANDS_SECTION_APPLIES_TO_DENTAL = false
