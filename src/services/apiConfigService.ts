import { getUseMockData } from './dataModeService'

/**
 * Centralised API configuration.
 * Reads environment variables and exposes them in a type-safe way.
 */
export const API_KEYS = {
  newsapi: import.meta.env.VITE_NEWSAPI_KEY as string | undefined,
  guardian: import.meta.env.VITE_GUARDIAN_KEY as string | undefined,
  nytimes: import.meta.env.VITE_NYTIMES_KEY as string | undefined,
}

/**
 * Returns true if the app should use mock data instead of real APIs.
 * This can be toggled at runtime via the UI.
 */
export const useMockData = (): boolean => getUseMockData()

export const API_ENDPOINTS = {
  newsapi: 'https://newsapi.org/v2/everything',
  guardian: 'https://content.guardianapis.com/search',
  nytimes: 'https://api.nytimes.com/svc/search/v2/articlesearch.json',
}
