import type { ReactNode } from 'react'

interface TooltipProps {
  content: string
  children: ReactNode
  position?: 'top' | 'bottom' | 'left' | 'right'
  className?: string
}

const positionClasses = {
  top: 'bottom-full left-1/2 mb-2 -translate-x-1/2',
  bottom: 'top-full left-1/2 mt-2 -translate-x-1/2',
  left: 'right-full top-1/2 mr-2 -translate-y-1/2',
  right: 'left-full top-1/2 ml-2 -translate-y-1/2',
}

const arrowClasses = {
  top: 'top-full left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-b-0 border-t-gray-900 dark:border-t-gray-700',
  bottom:
    'bottom-full left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-t-0 border-b-gray-900 dark:border-b-gray-700',
  left: 'left-full top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-r-0 border-l-gray-900 dark:border-l-gray-700',
  right:
    'right-full top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-l-0 border-r-gray-900 dark:border-r-gray-700',
}

export const Tooltip = ({
  content,
  children,
  position = 'top',
  className = '',
}: TooltipProps) => {
  if (!content) return <>{children}</>

  return (
    <span
      className={[`group relative inline-block`, className].join(' ')}
      tabIndex={0}
      aria-describedby={undefined}
    >
      {children}
      <span
        role="tooltip"
        className={[
          'pointer-events-none absolute z-50 w-max max-w-xs rounded-lg bg-gray-900 px-3 py-2 text-sm text-white opacity-0 shadow-lg',
          'transition-all duration-200 ease-spring',
          'group-hover:opacity-100 group-focus-visible:opacity-100',
          'dark:bg-gray-700',
          positionClasses[position],
        ].join(' ')}
      >
        {content}
        <span
          className={[
            'absolute h-0 w-0 border-4 border-solid border-transparent',
            arrowClasses[position],
          ].join(' ')}
          aria-hidden="true"
        />
      </span>
    </span>
  )
}
