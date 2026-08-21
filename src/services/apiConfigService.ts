/**
 * Centralised API configuration.
 * Reads environment variables and exposes them in a type-safe way.
 */
export const API_KEYS = {
  newsapi: import.meta.env.VITE_NEWSAPI_KEY as string | undefined,
  guardian: import.meta.env.VITE_GUARDIAN_KEY as string | undefined,
  nytimes: import.meta.env.VITE_NYTIMES_KEY as string | undefined,
}

export const API_ENDPOINTS = {
  newsapi: 'https://newsapi.org/v2/everything',
  guardian: 'https://content.guardianapis.com/search',
  nytimes: 'https://api.nytimes.com/svc/search/v2/articlesearch.json',
}
