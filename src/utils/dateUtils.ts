/**
 * Format a date for display using the native Intl API.
 */
export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
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
