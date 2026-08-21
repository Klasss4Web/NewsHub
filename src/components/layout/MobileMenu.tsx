import { useState, useEffect } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { useTheme } from '@/stores/themeStore'

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
}

export const MobileMenu = ({ isOpen, onClose }: MobileMenuProps) => {
  const { theme, toggleTheme } = useTheme()
  const location = useLocation()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => setIsVisible(true), 10)
      return () => clearTimeout(timer)
    }
    setIsVisible(false)
  }, [isOpen])

  if (!isOpen) return null

  const navBase =
    'block rounded-lg px-4 py-3 text-left text-base font-medium transition-colors'
  const navInactive =
    'text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800'
  const navActive =
    'bg-primary-100 text-primary-800 dark:bg-primary-900/40 dark:text-primary-200'

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      <div
        className={[
          'absolute inset-0 bg-black/50 transition-opacity duration-200',
          isVisible ? 'opacity-100' : 'opacity-0',
        ].join(' ')}
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className={[
          'absolute right-0 top-0 h-full w-72 bg-white shadow-2xl transition-transform duration-200 ease-out dark:bg-gray-900',
          isVisible ? 'translate-x-0' : 'translate-x-full',
        ].join(' ')}
      >
        <div className="flex items-center justify-between border-b border-gray-200 p-4 dark:border-gray-800">
          <span className="text-lg font-semibold text-gray-900 dark:text-white">
            Menu
          </span>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 dark:text-gray-300 dark:hover:bg-gray-800"
            aria-label="Close menu"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <nav className="m-4 flex flex-col gap-2 rounded-lg bg-gray-50 p-2 dark:bg-gray-800">
          <NavLink
            to="/"
            onClick={onClose}
            end
            className={
              location.pathname === '/'
                ? `${navBase} ${navActive}`
                : `${navBase} ${navInactive}`
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/preferences"
            onClick={onClose}
            className={
              location.pathname === '/preferences'
                ? `${navBase} ${navActive}`
                : `${navBase} ${navInactive}`
            }
          >
            Preferences
          </NavLink>
          <button
            type="button"
            onClick={(event) => {
              toggleTheme({ x: event.clientX, y: event.clientY })
            }}
            className={`${navBase} ${navInactive}`}
          >
            {theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
          </button>
        </nav>
      </div>
    </div>
  )
}
