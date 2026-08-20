import { useState } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { MobileMenu } from './MobileMenu'
import { useTheme } from '@/stores/themeStore'

export const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { theme, toggleTheme } = useTheme()

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    [
      'relative text-sm font-medium transition-all duration-200',
      'after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-0 after:bg-primary-600',
      'after:transition-all after:duration-200 hover:after:w-full',
      isActive
        ? 'text-primary-600 after:w-full'
        : 'text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white',
    ].join(' ')

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/95 backdrop-blur dark:border-gray-700 dark:bg-gray-900/95">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded-lg"
        >
          <svg
            className="h-8 w-8 text-primary-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
            />
          </svg>
          <span className="text-xl font-bold text-gray-900 dark:text-white">NewsHub</span>
        </Link>

        <nav className="hidden md:flex md:items-center md:gap-6">
          <NavLink to="/" className={navLinkClass} end>
            Home
          </NavLink>
          <NavLink to="/preferences" className={navLinkClass}>
            Preferences
          </NavLink>
          <button
            type="button"
            onClick={(event) =>
              toggleTheme({ x: event.clientX, y: event.clientY })
            }
            className="relative flex size-9 items-center justify-center overflow-hidden rounded-lg p-2 text-gray-600 hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 dark:text-gray-300 dark:hover:bg-gray-800"
            aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
          >
            {/* Sun — visible in dark mode, rotates and scales out in light mode */}
            <svg
              className="absolute inset-0 m-auto h-5 w-5 transition-all duration-500 ease-spring motion-reduce:transition-none
                -rotate-90 scale-0 opacity-0
                dark:rotate-0 dark:scale-100 dark:opacity-100 dark:animate-icon-blink motion-reduce:animate-none"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
            {/* Moon — visible in light mode, rotates and scales out in dark mode */}
            <svg
              className="absolute inset-0 m-auto h-5 w-5 transition-all duration-500 ease-spring motion-reduce:transition-none
                rotate-0 scale-100 opacity-100 animate-moon-sway dark:animate-none motion-reduce:animate-none
                dark:-rotate-90 dark:scale-0 dark:opacity-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
              />
            </svg>
          </button>
        </nav>

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-lg p-2 text-gray-600 hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 md:hidden dark:text-gray-300 dark:hover:bg-gray-800"
          onClick={() => setIsMobileMenuOpen(true)}
          aria-label="Open menu"
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
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>

      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
    </header>
  )
}
