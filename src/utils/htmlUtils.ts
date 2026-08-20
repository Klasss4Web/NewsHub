/**
 * Strip HTML tags from a string and decode common HTML entities.
 */
export const stripHtml = (html: string | null | undefined): string | null => {
  if (!html) return null

  const decoded = html
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')

  return decoded.replace(/<[^>]+>/g, '').trim() || null
}
