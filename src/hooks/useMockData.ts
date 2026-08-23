import { useState, useEffect, useCallback } from 'react'
import {
  getUseMockData,
  setUseMockData,
  subscribeToDataMode,
} from '@/services/dataModeService'

/**
 * Hook to read and toggle mock-data mode at runtime.
 * The value is persisted to localStorage and synced across components.
 */
export function useMockData(): [boolean, (value: boolean) => void] {
  const [isMock, setIsMock] = useState(() => getUseMockData())

  useEffect(() => {
    return subscribeToDataMode(() => {
      setIsMock(getUseMockData())
    })
  }, [])

  const toggle = useCallback((value: boolean) => {
    setUseMockData(value)
  }, [])

  return [isMock, toggle]
}
