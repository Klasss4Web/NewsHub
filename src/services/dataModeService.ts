const STORAGE_KEY = 'news-aggregator-use-mock-data'

let currentUseMockData = (() => {
  if (import.meta.env.VITE_USE_MOCK_DATA === 'true') return true
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    return stored ? stored === 'true' : false
  } catch {
    return false
  }
})()

const listeners = new Set<() => void>()

export const getUseMockData = (): boolean => currentUseMockData

export const setUseMockData = (value: boolean): void => {
  if (currentUseMockData === value) return
  currentUseMockData = value
  try {
    window.localStorage.setItem(STORAGE_KEY, String(value))
  } catch {
    // ignore storage errors
  }
  listeners.forEach((listener) => listener())
}

export const subscribeToDataMode = (listener: () => void): (() => void) => {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}
