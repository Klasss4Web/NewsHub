/**
 * Format a date for display using the native Intl API.
 *
 * Article dates are displayed in UTC so they align with the dates used in
 * API queries. Without this, users in timezones ahead of UTC would see
 * articles dated one day later than the date they filtered by.
 */
export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(date)
}

/**
 * Format a date as YYYY-MM-DD for API query parameters.
 */
export const formatApiDate = (date: Date): string => {
  return date.toISOString().split('T')[0]
}

/**
 * Parse an ISO date string safely.
 */
export const parseDate = (value: string | null | undefined): Date | null => {
  if (!value) return null
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : date
}
