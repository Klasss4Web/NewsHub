import { createContext, useContext, useMemo, useCallback, type ReactNode } from 'react'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { DEFAULT_CATEGORIES, DEFAULT_SOURCES } from '@/constants'
import type { UserPreferences } from '@/types'

const STORAGE_KEY = 'news-aggregator-preferences'

const defaultPreferences: UserPreferences = {
  preferredSources: DEFAULT_SOURCES,
  preferredCategories: DEFAULT_CATEGORIES,
  preferredAuthors: [],
}

interface PreferencesContextValue extends UserPreferences {
  toggleSource: (source: string) => void
  toggleCategory: (category: string) => void
  toggleAuthor: (author: string) => void
  resetPreferences: () => void
  isPreferredSource: (source: string) => boolean
  isPreferredCategory: (category: string | null) => boolean
  isPreferredAuthor: (author: string | null) => boolean
}

const PreferencesContext = createContext<PreferencesContextValue | undefined>(
  undefined
)

export const PreferencesProvider = ({ children }: { children: ReactNode }) => {
  const [preferences, setPreferences] = useLocalStorage<UserPreferences>(
    STORAGE_KEY,
    defaultPreferences
  )

  const toggleItem = useCallback(
    (key: keyof UserPreferences, value: string) => {
      setPreferences((prev) => {
        const list = prev[key]
        const exists = list.includes(value)
        return {
          ...prev,
          [key]: exists
            ? list.filter((item) => item !== value)
            : [...list, value],
        }
      })
    },
    [setPreferences]
  )

  const toggleSource = useCallback(
    (source: string) => toggleItem('preferredSources', source),
    [toggleItem]
  )

  const toggleCategory = useCallback(
    (category: string) => toggleItem('preferredCategories', category),
    [toggleItem]
  )

  const toggleAuthor = useCallback(
    (author: string) => toggleItem('preferredAuthors', author),
    [toggleItem]
  )

  const resetPreferences = useCallback(() => {
    setPreferences(defaultPreferences)
  }, [setPreferences])

  const isPreferredSource = useCallback(
    (source: string) => preferences.preferredSources.includes(source),
    [preferences.preferredSources]
  )

  const isPreferredCategory = useCallback(
    (category: string | null) =>
      !!category && preferences.preferredCategories.includes(category),
    [preferences.preferredCategories]
  )

  const isPreferredAuthor = useCallback(
    (author: string | null) =>
      !!author && preferences.preferredAuthors.includes(author),
    [preferences.preferredAuthors]
  )

  const value = useMemo(
    () => ({
      ...preferences,
      toggleSource,
      toggleCategory,
      toggleAuthor,
      resetPreferences,
      isPreferredSource,
      isPreferredCategory,
      isPreferredAuthor,
    }),
    [
      preferences,
      toggleSource,
      toggleCategory,
      toggleAuthor,
      resetPreferences,
      isPreferredSource,
      isPreferredCategory,
      isPreferredAuthor,
    ]
  )

  return (
    <PreferencesContext.Provider value={value}>
      {children}
    </PreferencesContext.Provider>
  )
}

export const usePreferences = (): PreferencesContextValue => {
  const context = useContext(PreferencesContext)
  if (!context) {
    throw new Error(
      'usePreferences must be used within a PreferencesProvider'
    )
  }
  return context
}
