import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'

type Theme = 'light' | 'dark'

export interface ThemeTransition {
  /** X coordinate (clientX) the toggle was activated at. */
  x: number
  /** Y coordinate (clientY) the toggle was activated at. */
  y: number
}

const STORAGE_KEY = 'news-aggregator-theme'

const getInitialTheme = (): Theme => {
  if (typeof window === 'undefined') return 'light'
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY) as Theme | null
    if (stored === 'light' || stored === 'dark') return stored
  } catch {
    // ignore storage errors
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}

interface ThemeContextValue {
  theme: Theme
  toggleTheme: (origin?: ThemeTransition) => void
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setThemeState] = useState<Theme>(getInitialTheme)

  // Origin of the most recent theme toggle. Used by the View Transition
  // clip-path reveal so the circle expands from the click point.
  const originRef = useRef<ThemeTransition>({
    x: typeof window !== 'undefined' ? window.innerWidth / 2 : 0,
    y: typeof window !== 'undefined' ? window.innerHeight / 2 : 0,
  })

  // Skip the transition on first paint — the theme class is applied
  // synchronously (and index.html sets it even earlier to avoid a flash).
  const isInitialMount = useRef(true)

  useEffect(() => {
    const root = window.document.documentElement

    const apply = () => {
      root.classList.remove('light', 'dark')
      root.classList.add(theme)
    }

    const persist = () => {
      try {
        window.localStorage.setItem(STORAGE_KEY, theme)
      } catch {
        // ignore storage errors
      }
    }

    if (isInitialMount.current) {
      isInitialMount.current = false
      apply()
      persist()
      return
    }

    persist()

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches
    const supportsViewTransition =
      !prefersReducedMotion &&
      'startViewTransition' in document &&
      document.visibilityState === 'visible'

    if (supportsViewTransition) {
      const { x, y } = originRef.current
      root.style.setProperty('--theme-transition-x', `${x}px`)
      root.style.setProperty('--theme-transition-y', `${y}px`)
      // Tag the root so the view-transition CSS only applies to theme
      // changes, not to any other startViewTransition calls.
      root.dataset.themeVt = 'true'

      const transition = document.startViewTransition(apply)

      // Swallow rejections — the API rejects when the transition is skipped
      // (e.g. rapid double-toggle, tab hidden mid-transition).
      transition.ready.catch(() => {})
      transition.updateCallbackDone.catch(() => {})
      transition.finished
        .catch(() => {})
        .finally(() => {
          delete root.dataset.themeVt
        })
    } else {
      // Fallback for browsers without View Transitions: animate the colour
      // tokens directly, then remove the transitioning class.
      root.classList.add('theme-transitioning')
      apply()

      const timer = window.setTimeout(() => {
        root.classList.remove('theme-transitioning')
      }, 350)

      return () => {
        window.clearTimeout(timer)
        root.classList.remove('theme-transitioning')
      }
    }
  }, [theme])

  const toggleTheme = useCallback((origin?: ThemeTransition) => {
    if (origin) {
      originRef.current = origin
    }
    setThemeState((prev) => (prev === 'light' ? 'dark' : 'light'))
  }, [])

  const setTheme = useCallback((value: Theme) => {
    setThemeState(value)
  }, [])

  const value = useMemo(
    () => ({ theme, toggleTheme, setTheme }),
    [theme, toggleTheme, setTheme]
  )

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  )
}

export const useTheme = (): ThemeContextValue => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
