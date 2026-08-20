/**
 * Create a URL-friendly slug from an arbitrary string.
 */
export const slugify = (value: string): string => {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/**
 * Truncate text to a maximum length with an ellipsis.
 */
export const truncate = (value: string, maxLength = 120): string => {
  if (value.length <= maxLength) return value
  return `${value.slice(0, maxLength).trim()}...`
}

/**
 * Generate a deterministic colour class for a source/category badge.
 */
export const getColourClass = (value: string): string => {
  const colours = [
    'bg-blue-100 text-blue-800',
    'bg-green-100 text-green-800',
    'bg-purple-100 text-purple-800',
    'bg-orange-100 text-orange-800',
    'bg-pink-100 text-pink-800',
    'bg-teal-100 text-teal-800',
  ]
  let hash = 0
  for (let i = 0; i < value.length; i++) {
    hash = value.charCodeAt(i) + ((hash << 5) - hash)
  }
  const index = Math.abs(hash) % colours.length
  return colours[index]
}
