import { useState, useCallback, useMemo } from 'react'
import {
  SearchBar,
  FilterPanel,
  ArticleList,
  FeedToggle,
  DataModeToggle,
} from '@/components/features'
import { useArticles } from '@/hooks'
import { usePreferences } from '@/stores/preferenceStore'
import { ScrollReveal } from '@/components/common'
import type { ArticleFilter, FeedView } from '@/types'
import { DEFAULT_SOURCES } from '@/constants'

export const HomePage = () => {
  const { preferredSources, preferredCategories } = usePreferences()
  const [filter, setFilter] = useState<ArticleFilter>({
    keyword: '',
    fromDate: null,
    toDate: null,
    category: null,
    sources: [],
  })
  const [view, setView] = useState<FeedView>('all')

  const effectiveFilter = useMemo<ArticleFilter>(
    () => ({
      ...filter,
      sources: filter.sources.length > 0 ? filter.sources : DEFAULT_SOURCES,
    }),
    [filter]
  )

  const { articles, loading, loadingMore, error, sourceErrors, hasMore, loadMore, reset } =
    useArticles({ filter: effectiveFilter, view })

  const handleSearch = useCallback((keyword: string) => {
    setFilter((prev) => ({ ...prev, keyword }))
  }, [])

  const handleFilterChange = useCallback((nextFilter: ArticleFilter) => {
    setFilter(nextFilter)
  }, [])

  return (
    <div className="space-y-6">
      <ScrollReveal animation="slide-up">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
            Latest News
          </h1>
          <FeedToggle view={view} onChange={setView} />
        </div>
      </ScrollReveal>

      {view === 'personalised' && (
        <ScrollReveal animation="slide-up" delay={75}>
          <div className="rounded-lg bg-primary-50 p-4 text-sm text-primary-800 dark:bg-primary-900/30 dark:text-primary-200">
            Showing articles matching your preferred sources (
            {preferredSources.length}) and categories ({preferredCategories.length}).
          </div>
        </ScrollReveal>
      )}

      <ScrollReveal animation="slide-up" delay={100}>
        <DataModeToggle />
      </ScrollReveal>

      <ScrollReveal animation="slide-up" delay={150}>
        <SearchBar value={filter.keyword} onChange={handleSearch} />
      </ScrollReveal>

      <ScrollReveal animation="slide-up" delay={200}>
        <FilterPanel filter={filter} onChange={handleFilterChange} />
      </ScrollReveal>

      {sourceErrors.length > 0 && (
        <ScrollReveal animation="fade-in" delay={250}>
          <div
            className="rounded-lg border border-yellow-200 bg-yellow-50 p-3 text-sm text-yellow-800 dark:border-yellow-900/50 dark:bg-yellow-900/20 dark:text-yellow-200"
            role="status"
          >
            <p className="font-medium">Some sources are unavailable:</p>
            <ul className="mt-1 list-inside list-disc">
              {sourceErrors.map((err, index) => (
                <li key={index}>{err}</li>
              ))}
            </ul>
          </div>
        </ScrollReveal>
      )}

      <ArticleList
        articles={articles}
        loading={loading}
        loadingMore={loadingMore}
        error={error}
        hasMore={hasMore}
        onLoadMore={loadMore}
        onRetry={reset}
      />
    </div>
  )
}
