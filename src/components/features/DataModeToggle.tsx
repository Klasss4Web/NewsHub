import { useMockData } from '@/hooks'
import { Toggle } from '@/components/common'

export const DataModeToggle = () => {
  const [isMockData, setIsMockData] = useMockData()

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <Toggle
        checked={isMockData}
        onChange={setIsMockData}
        label={isMockData ? 'Using mock data' : 'Using live APIs'}
      />
      <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
        {isMockData
          ? 'Showing sample articles. Toggle off to fetch from real news APIs.'
          : 'Fetching from configured news APIs. Requires valid API keys.'}
      </p>
    </div>
  )
}
