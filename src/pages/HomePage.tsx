import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  FilterPanel,
  ArticleList,
  FeedToggle,
  DataModeToggle,
} from '@/components/features'
import { DEFAULT_SOURCES } from '@/constants'
import { ScrollReveal } from '@/components/common'
import type { ArticleFilter, FeedView } from '@/types'
import { useArticles, useLocalStorage } from '@/hooks'
import { usePreferences } from '@/stores/preferenceStore'

const FILTER_STORAGE_KEY = 'news-aggregator-home-filter'
const BANNER_DISMISSED_KEY = 'news-aggregator-banner-dismissed'

const defaultFilter: ArticleFilter = {
  keyword: '',
  fromDate: null,
  toDate: null,
  category: null,
  sources: DEFAULT_SOURCES,
}

const buildSearchParams = (filter: ArticleFilter): URLSearchParams => {
  const params = new URLSearchParams()
  if (filter.keyword) params.set('q', filter.keyword)
  if (filter.fromDate) params.set('from', filter.fromDate)
  if (filter.toDate) params.set('to', filter.toDate)
  if (filter.category) params.set('category', filter.category)
  if (
    filter.sources.length > 0 &&
    filter.sources.length < DEFAULT_SOURCES.length
  ) {
    params.set('sources', filter.sources.join(','))
  }
  return params
}

const parseFilterFromSearchParams = (
  searchParams: URLSearchParams
): Partial<ArticleFilter> => {
  const keyword = searchParams.get('q') || ''
  const fromDate = searchParams.get('from')
  const toDate = searchParams.get('to')
  const category = searchParams.get('category')
  const sourcesParam = searchParams.get('sources')
  const sources = sourcesParam
    ? sourcesParam.split(',').filter((id) => DEFAULT_SOURCES.includes(id))
    : []

  const result: Partial<ArticleFilter> = {}
  if (keyword) result.keyword = keyword
  if (fromDate) result.fromDate = fromDate
  if (toDate) result.toDate = toDate
  if (category) result.category = category
  if (sources.length > 0) result.sources = sources
  return result
}

const hasUrlFilterParams = (searchParams: URLSearchParams): boolean => {
  return ['q', 'from', 'to', 'category', 'sources'].some((key) =>
    searchParams.has(key)
  )
}

export const HomePage = () => {
  const {
    preferredSources,
    preferredCategories,
    toggleSource: togglePreferredSource,
  } = usePreferences()
  const [filter, setFilter] = useLocalStorage<ArticleFilter>(
    FILTER_STORAGE_KEY,
    defaultFilter
  )
  const [searchParams, setSearchParams] = useSearchParams()
  const initialUrlAppliedRef = useRef(false)
  const [view, setView] = useState<FeedView>('all')
  const [isBannerDismissed, setIsBannerDismissed] = useLocalStorage<boolean>(
    BANNER_DISMISSED_KEY,
    false
  )

  // On first load, URL query params take precedence over localStorage so
  // shared links work correctly.
  useEffect(() => {
    if (initialUrlAppliedRef.current) return
    initialUrlAppliedRef.current = true

    if (!hasUrlFilterParams(searchParams)) return

    const urlFilter = parseFilterFromSearchParams(searchParams)
    setFilter((prev) => ({
      ...prev,
      ...urlFilter,
      sources:
        urlFilter.sources && urlFilter.sources.length > 0
          ? urlFilter.sources
          : DEFAULT_SOURCES,
    }))
  }, [searchParams, setFilter])

  // Keep the URL in sync with the current filter.
  useEffect(() => {
    if (!initialUrlAppliedRef.current) return

    const params = buildSearchParams(filter)
    const currentParams = new URLSearchParams(searchParams.toString())

    // Only update if the params actually changed to avoid unnecessary history
    // entries.
    if (params.toString() !== currentParams.toString()) {
      setSearchParams(params, { replace: true })
    }
  }, [filter, searchParams, setSearchParams])

  const effectiveFilter = useMemo<ArticleFilter>(
    () => ({
      ...filter,
      sources: filter.sources.length > 0 ? filter.sources : DEFAULT_SOURCES,
    }),
    [filter]
  )

  const {
    articles,
    loading,
    loadingMore,
    error,
    sourceErrors,
    hasMore,
    loadMore,
    reset,
  } = useArticles({ filter: effectiveFilter, view })

  const handleFilterChange = useCallback(
    (nextFilter: ArticleFilter) => {
      // An empty source selection is treated as "all sources" so the feed
      // always remains usable and the UI stays consistent.
      setFilter({
        ...nextFilter,
        sources:
          nextFilter.sources.length > 0 ? nextFilter.sources : DEFAULT_SOURCES,
      })
    },
    [setFilter]
  )

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

      {view === 'personalised' && !isBannerDismissed && (
        <ScrollReveal animation="slide-up" delay={75}>
          <div className="relative rounded-lg bg-primary-50 p-4 text-sm text-primary-800 dark:bg-primary-900/30 dark:text-primary-200">
            <button
              type="button"
              onClick={() => setIsBannerDismissed(true)}
              className="absolute right-2 top-2 rounded p-1 text-primary-600 hover:bg-primary-100 dark:text-primary-300 dark:hover:bg-primary-800/50"
              aria-label="Close personalised feed notice"
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
            <p className="pr-6">
              Showing articles matching your preferred sources (
              {preferredSources.length}) and categories (
              {preferredCategories.length}).
            </p>
            <div className="mt-3 flex justify-start">
              <button
                type="button"
                onClick={() => setIsBannerDismissed(true)}
                className="text-xs font-medium underline hover:no-underline"
              >
                Dismiss
              </button>
            </div>
          </div>
        </ScrollReveal>
      )}

      <ScrollReveal animation="slide-up" delay={100}>
        <DataModeToggle />
      </ScrollReveal>

      <ScrollReveal animation="slide-up" delay={150}>
        <FilterPanel
          filter={filter}
          onChange={handleFilterChange}
          view={view}
          preferredSources={preferredSources}
          onPreferredSourceToggle={togglePreferredSource}
        />
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
        category={filter?.category as string}
      />
    </div>
  )
}
