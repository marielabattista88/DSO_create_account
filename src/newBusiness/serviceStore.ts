/** Session-scoped list of service locations for the new-business prototype. */

export interface ServiceLocation {
  dba: string
  address: string
  languages: string
}

const KEY = 'newBusinessServiceLocations'

export const loadLocations = (): ServiceLocation[] => {
  try { return JSON.parse(sessionStorage.getItem(KEY) ?? '[]') } catch { return [] }
}
export const saveLocations = (list: ServiceLocation[]) => sessionStorage.setItem(KEY, JSON.stringify(list))

export const sampleLocations = (count: number): ServiceLocation[] =>
  Array.from({ length: count }, () => ({
    dba: 'Bright Smile Dental NY - 1235894',
    address: '14721 Biscayne Blvd, North Miami Beach, FL 33181',
    languages: 'English',
  }))
