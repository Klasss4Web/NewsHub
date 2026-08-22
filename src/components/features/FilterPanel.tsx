import { useState } from 'react'

import { capitalize } from '@/utils'
import { SearchBar } from './SearchBar'
import type { ArticleFilter, FeedView } from '@/types'
import { NEWS_SOURCES, NEWS_CATEGORIES, DEFAULT_SOURCES } from '@/constants'
import { Input, Select, Checkbox, Button } from '@/components/common'

interface FilterPanelProps {
  filter: ArticleFilter
  onChange: (filter: ArticleFilter) => void
  view?: FeedView
  preferredSources?: string[]
  onPreferredSourceToggle?: (sourceId: string) => void
}

export const FilterPanel = ({
  filter,
  onChange,
  view = 'all',
  preferredSources = [],
  onPreferredSourceToggle,
}: FilterPanelProps) => {
  const [isOpen, setIsOpen] = useState(false)

  const isPersonalised = view === 'personalised'

  const visibleSources = NEWS_SOURCES

  const isSourceChecked = (sourceId: string) =>
    isPersonalised
      ? preferredSources.includes(sourceId)
      : filter.sources.includes(sourceId)

  const isDefaultSourceSelection =
    filter.sources.length === DEFAULT_SOURCES.length &&
    DEFAULT_SOURCES.every((id) => filter.sources.includes(id))

  // NewsAPI's /top-headlines endpoint (used on All News) does not support
  // date ranges, so hide the date pickers when NewsAPI is the only source.
  const isNewsApiOnlyAllNews =
    !isPersonalised &&
    filter.sources.length === 1 &&
    filter.sources[0] === 'newsapi'

  // NewsAPI's /everything endpoint (used on My Feed) does not support
  // category filtering, so hide the category dropdown when NewsAPI is the
  // only preferred source.
  const isNewsApiOnlyMyFeed =
    isPersonalised &&
    preferredSources.length === 1 &&
    preferredSources[0] === 'newsapi'

  const hideDateRange = isNewsApiOnlyAllNews
  const hideCategory = isNewsApiOnlyMyFeed

  const categoryOptions = NEWS_CATEGORIES.map((category) => ({
    value: category,
    label: capitalize(category),
  }))

  const updateFilter = <K extends keyof ArticleFilter>(
    key: K,
    value: ArticleFilter[K]
  ) => {
    onChange({ ...filter, [key]: value })
  }

  const toggleSource = (sourceId: string) => {
    if (isPersonalised && onPreferredSourceToggle) {
      onPreferredSourceToggle(sourceId)
      return
    }

    const nextSources = filter.sources.includes(sourceId)
      ? filter.sources.filter((id) => id !== sourceId)
      : [...filter.sources, sourceId]
    updateFilter('sources', nextSources)
  }

  const clearFilters = () => {
    onChange({
      keyword: '',
      fromDate: null,
      toDate: null,
      category: null,
      sources: DEFAULT_SOURCES,
    })
  }

  const hasActiveFilters =
    filter.fromDate ||
    filter.toDate ||
    filter.category ||
    (!isPersonalised && !isDefaultSourceSelection)

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-semibold text-gray-900 dark:text-white">Filters</h3>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          className="text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400"
        >
          {isOpen ? 'Hide' : 'Show'}
        </button>
      </div>

      <div
        className={[
          'space-y-4 overflow-hidden transition-all duration-300 ease-in-out',
          isOpen
            ? 'max-h-[1000px] opacity-100'
            : 'max-h-0 opacity-0',
        ].join(' ')}
      >
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <SearchBar
              value={filter.keyword}
              onChange={(value) => updateFilter('keyword', value)}
            />
          </div>
          {!hideDateRange && (
            <>
              <Input
                type="date"
                label="From"
                value={filter.fromDate || ''}
                onChange={(event) =>
                  updateFilter('fromDate', event.target.value || null)
                }
              />
              <Input
                type="date"
                label="To"
                min={filter.fromDate || undefined}
                disabled={!filter.fromDate}
                value={filter.toDate || ''}
                onChange={(event) =>
                  updateFilter('toDate', event.target.value || null)
                }
              />
            </>
          )}
          {!hideCategory && (
            <Select
              label="Category"
              value={filter.category || ''}
              onChange={(event) =>
                updateFilter('category', event.target.value || null)
              }
              options={categoryOptions}
              placeholder="All categories"
            />
          )}
        </div>

        <div>
          <span className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            {isPersonalised ? 'My Preferred Sources' : 'Sources'}
          </span>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {visibleSources.map((source) => (
              <Checkbox
                key={source.id}
                label={source.name}
                checked={isSourceChecked(source.id)}
                onChange={() => toggleSource(source.id)}
              />
            ))}
          </div>
        </div>
      </div>

      {hasActiveFilters && (
        <div className="mt-4 flex justify-end">
          <Button onClick={clearFilters} variant="ghost" size="sm">
            Clear filters
          </Button>
        </div>
      )}
    </div>
  )
}
