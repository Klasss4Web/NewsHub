import { Button, Checkbox } from '@/components/common'
import { usePreferences } from '@/stores/preferenceStore'
import { NEWS_CATEGORIES, NEWS_SOURCES } from '@/constants'
import { capitalize } from '@/utils'

export const PreferencePanel = () => {
  const {
    preferredSources,
    preferredCategories,
    preferredAuthors,
    toggleSource,
    toggleCategory,
    resetPreferences,
  } = usePreferences()

  return (
    <div className="space-y-8">
      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Preferred Sources
        </h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Select the news sources you trust most.
        </p>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {NEWS_SOURCES.map((source) => (
            <Checkbox
              key={source.id}
              label={source.name}
              checked={preferredSources.includes(source.id)}
              onChange={() => toggleSource(source.id)}
            />
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Preferred Categories
        </h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Choose the topics you care about.
        </p>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {NEWS_CATEGORIES.map((category) => (
            <Checkbox
              key={category}
              label={capitalize(category)}
              checked={preferredCategories.includes(category)}
              onChange={() => toggleCategory(category)}
            />
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Preferred Authors
        </h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Click the star icon next to an author on any article card to add or
          remove them from your preferred authors.
        </p>
        {preferredAuthors.length === 0 ? (
          <p className="mt-4 text-sm text-gray-400 dark:text-gray-500">
            No preferred authors yet.
          </p>
        ) : (
          <ul className="mt-4 list-inside list-disc text-sm text-gray-700 dark:text-gray-300">
            {preferredAuthors.map((author) => (
              <li key={author}>{author}</li>
            ))}
          </ul>
        )}
      </section>

      <div className="flex justify-end">
        <Button onClick={resetPreferences} variant="secondary">
          Reset Preferences
        </Button>
      </div>
    </div>
  )
}
