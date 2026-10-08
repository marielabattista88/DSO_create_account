/** Session-scoped list of providers for the new-business prototype. */

export interface Provider {
  firstName: string
  lastName: string
  npi: string
  credentials: string
  specialty: string
  locations: string[]
}

const KEY = 'newBusinessProviders'

export const loadProviders = (): Provider[] => {
  try { return JSON.parse(sessionStorage.getItem(KEY) ?? '[]') } catch { return [] }
}
export const saveProviders = (list: Provider[]) => sessionStorage.setItem(KEY, JSON.stringify(list))

const FIRST = ['Christian', 'Maria', 'Daniel', 'Laura', 'Andrew']
const LAST = ['Sais', 'Lopez', 'Moore', 'Reyes', 'Bennett']

export const sampleProviders = (count: number): Provider[] =>
  Array.from({ length: count }, (_, i) => ({
    firstName: FIRST[i % FIRST.length],
    lastName: LAST[i % LAST.length],
    npi: String(1234567890 - i * 1111),
    credentials: 'DDS',
    specialty: 'General Dentistry',
    locations: [],
  }))
