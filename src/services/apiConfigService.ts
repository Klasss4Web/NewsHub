/**
 * Centralised API configuration.
 * Reads environment variables and exposes them in a type-safe way.
 */
export const API_BASE_URL =
  (import.meta.env.VITE_API_BASE_URL as string | undefined) || '/api'
