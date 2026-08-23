import { useLocalStorage, useMockData } from '@/hooks'
import { Toggle } from '@/components/common'

const DISMISS_STORAGE_KEY = 'news-aggregator:data-mode-info-dismissed'

export const DataModeToggle = () => {
  const [isMockData, setIsMockData] = useMockData()
  const [isDismissed, setIsDismissed] = useLocalStorage(
    DISMISS_STORAGE_KEY,
    false
  )

  if (isDismissed) {
    return null
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <Toggle
        checked={isMockData}
        onChange={setIsMockData}
        label={isMockData ? 'Using Saved Data' : 'Using Live APIs'}
      />
      <div className="mt-2 flex items-start justify-between gap-3">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {isMockData
            ? 'Showing sample articles. Toggle off to fetch from real news APIs.'
            : 'Fetching from configured news APIs. Requires valid API keys.'}
        </p>
        <button
          type="button"
          onClick={() => setIsDismissed(true)}
          className="shrink-0 cursor-pointer text-xs font-medium text-primary-600 hover:text-primary-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 dark:text-primary-400 dark:hover:text-primary-300"
        >
          Dismiss
        </button>
      </div>
    </div>
  )
}
