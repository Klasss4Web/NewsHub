import type { FeedView } from '@/types'

interface FeedToggleProps {
  view: FeedView
  onChange: (view: FeedView) => void
}

export const FeedToggle = ({ view, onChange }: FeedToggleProps) => {
  return (
    <div
      className="inline-flex rounded-lg border border-gray-200 bg-white p-1 dark:border-gray-700 dark:bg-gray-800"
      role="group"
    >
      <button
        type="button"
        onClick={() => onChange('all')}
        className={[
          'rounded-md px-4 py-2 text-sm font-medium transition-all duration-200',
          'hover:scale-105 active:scale-95',
          view === 'all'
            ? 'bg-primary-600 text-white shadow-sm'
            : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700',
        ].join(' ')}
        aria-pressed={view === 'all'}
      >
        All News
      </button>
      <button
        type="button"
        onClick={() => onChange('personalised')}
        className={[
          'rounded-md px-4 py-2 text-sm font-medium transition-all duration-200',
          'hover:scale-105 active:scale-95',
          view === 'personalised'
            ? 'bg-primary-600 text-white shadow-sm'
            : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700',
        ].join(' ')}
        aria-pressed={view === 'personalised'}
      >
        My Feed
      </button>
    </div>
  )
}
