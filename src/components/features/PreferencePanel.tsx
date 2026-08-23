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
    toggleAuthor,
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
        <div className="mt-4 max-h-64 overflow-y-auto">
          {preferredAuthors.length === 0 ? (
            <p className="text-sm text-gray-400 dark:text-gray-500">
              No preferred authors yet.
            </p>
          ) : (
            <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
              {preferredAuthors.map((author) => (
                <li
                  key={author}
                  className="flex items-center justify-between gap-2"
                >
                  <span className="break-words">{author}</span>
                  <button
                    type="button"
                    onClick={() => toggleAuthor(author)}
                    aria-label={`Remove ${author} from preferred authors`}
                    className="shrink-0 rounded-full p-1 text-gray-400 hover:bg-red-50 hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1 dark:hover:bg-red-900/20 dark:focus:ring-offset-gray-800"
                  >
                    <svg
                      className="h-4 w-4"
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
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <div className="flex justify-end">
        <Button onClick={resetPreferences} variant="secondary">
          Reset Preferences
        </Button>
      </div>
    </div>
  )
}
