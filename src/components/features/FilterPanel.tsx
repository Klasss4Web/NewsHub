import { useState } from 'react'

import { capitalize } from '@/utils'
import { SearchBar } from './SearchBar'
import type { ArticleFilter } from '@/types'
import { NEWS_SOURCES, NEWS_CATEGORIES } from '@/constants'
import { Input, Select, Checkbox, Button } from '@/components/common'

interface FilterPanelProps {
  filter: ArticleFilter
  onChange: (filter: ArticleFilter) => void
}

export const FilterPanel = ({ filter, onChange }: FilterPanelProps) => {
  const [isOpen, setIsOpen] = useState(false)

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
      sources: [],
    })
  }

  const hasActiveFilters =
    filter.fromDate ||
    filter.toDate ||
    filter.category ||
    filter.sources.length > 0

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div className="mb-4 flex items-center justify-between md:hidden">
        <h3 className="font-semibold text-gray-900 dark:text-white">Filters</h3>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400"
        >
          {isOpen ? 'Hide' : 'Show'}
        </button>
      </div>

      <div
        className={[
          'space-y-4',
          isOpen ? 'block md:block' : 'hidden md:block',
        ].join(' ')}
      >
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <SearchBar
              value={filter.keyword}
              onChange={(value) => updateFilter('keyword', value)}
            />
          </div>
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
            value={filter.toDate || ''}
            onChange={(event) =>
              updateFilter('toDate', event.target.value || null)
            }
          />
          <Select
            label="Category"
            value={filter.category || ''}
            onChange={(event) =>
              updateFilter('category', event.target.value || null)
            }
            options={categoryOptions}
            placeholder="All categories"
          />
        </div>

        <div>
          <span className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Sources
          </span>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {NEWS_SOURCES.map((source) => (
              <Checkbox
                key={source.id}
                label={source.name}
                checked={filter.sources.includes(source.id)}
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
