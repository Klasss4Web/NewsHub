import { PreferencePanel } from '@/components/features'

export const PreferencesPage = () => {
  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
          Your Preferences
        </h1>
        <p className="mt-1 text-gray-600 dark:text-gray-300">
          Customise your news feed by selecting your favourite sources and
          categories.
        </p>
      </div>
      <PreferencePanel />
    </div>
  )
}
