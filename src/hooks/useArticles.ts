import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { NewsApiAdapter, GuardianAdapter, NyTimesAdapter } from '@/api/adapters'
import { NewsRepository } from '@/api/repositories/NewsRepository'
import { useDebounce } from './useDebounce'
import { useMockData } from './useMockData'
import type { Article, ArticleFilter, FeedView } from '@/types'
import { DEFAULT_SOURCES } from '@/constants'
import { usePreferences } from '@/stores/preferenceStore'

const PAGE_SIZE = 12

interface UseArticlesOptions {
  filter: ArticleFilter
  view: FeedView
}

interface UseArticlesResult {
  articles: Article[]
  loading: boolean
  loadingMore: boolean
  error: string | null
  sourceErrors: string[]
  hasMore: boolean
  loadMore: () => void
  reset: () => void
}

const repository = new NewsRepository([
  new NewsApiAdapter(),
  new GuardianAdapter(),
  new NyTimesAdapter(),
])

export function useArticles({
  filter,
  view,
}: UseArticlesOptions): UseArticlesResult {
  const [isMockData] = useMockData()
  const {
    preferredSources,
    preferredCategories,
    preferredAuthors,
    isPreferredSource,
    isPreferredCategory,
    isPreferredAuthor,
  } = usePreferences()
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sourceErrors, setSourceErrors] = useState<string[]>([])
  const [hasMore, setHasMore] = useState(true)
  const pageRef = useRef(1)
  const debouncedFilter = useDebounce(filter, 350)

  /**
   * In personalised view the API calls should be scoped to the user's
   * preferred sources and categories. This avoids fetching articles from
   * unwanted sources and lets the APIs do the filtering where possible.
   * All News continues to use the filter from the FilterPanel unchanged.
   */
  const personalisedFilters = useMemo<ArticleFilter[]>(() => {
    // The NewsAPI endpoint is chosen by feed view, not by the filter panel.
    // All News uses /top-headlines (category, no date range); My Feed uses
    // /everything (date range, no category).
    const newsApiEndpoint = view === 'personalised' ? 'everything' : 'top-headlines'

    if (view !== 'personalised') {
      return [{ ...filter, newsApiEndpoint }]
    }

    const sources =
      preferredSources.length > 0 ? preferredSources : DEFAULT_SOURCES
    const categories =
      preferredCategories.length > 0 ? preferredCategories : [null]

    return categories.map((category) => ({
      ...filter,
      sources,
      category,
      authors: preferredAuthors,
      newsApiEndpoint,
    }))
  }, [filter, view, preferredSources, preferredCategories, preferredAuthors])

  const applyPersonalisation = useCallback(
    (items: Article[]) => {
      if (view !== 'personalised') return items
      return items.filter(
        (article) =>
          isPreferredSource(article.sourceId) ||
          isPreferredCategory(article.category) ||
          isPreferredAuthor(article.author)
      )
    },
    [view, isPreferredSource, isPreferredCategory, isPreferredAuthor]
  )

  const fetchPage = useCallback(
    async (page: number, isLoadingMore: boolean) => {
      if (!isLoadingMore) {
        setLoading(true)
        setError(null)
      } else {
        setLoadingMore(true)
      }

      try {
        const results = await Promise.all(
          personalisedFilters.map((personalisedFilter) =>
            repository.fetchArticles(personalisedFilter, {
              page,
              pageSize: PAGE_SIZE,
            })
          )
        )

        const allArticles = results.flatMap((result) => result.articles)
        const allErrors = results.flatMap((result) => result.errors)
        const hasMorePages = results.some((result) => result.hasMore)

        setSourceErrors([...new Set(allErrors)])

        // Deduplicate across all personalised filter results and sort by date.
        const seenUrls = new Set<string>()
        const deduplicatedArticles = allArticles.filter((article) => {
          if (seenUrls.has(article.url)) return false
          seenUrls.add(article.url)
          return true
        })
        const sortedArticles = [...deduplicatedArticles].sort(
          (a, b) => b.publishedAt.getTime() - a.publishedAt.getTime()
        )

        if (page === 1) {
          setArticles(applyPersonalisation(sortedArticles))
        } else {
          setArticles((prev) => {
            const combined = [...prev, ...sortedArticles]
            const seen = new Set<string>()
            const deduplicated = combined.filter((article) => {
              if (seen.has(article.id)) return false
              seen.add(article.id)
              return true
            })
            return applyPersonalisation(deduplicated)
          })
        }

        setHasMore(hasMorePages)
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'Failed to load articles. Please try again.'
        )
        setHasMore(false)
      } finally {
        setLoading(false)
        setLoadingMore(false)
      }
    },
    [personalisedFilters, applyPersonalisation]
  )

  // Keep a ref to the latest fetchPage callback so the initial-load effect
  // only runs when the *debounced* filter changes, not on every keystroke.
  const fetchPageRef = useRef(fetchPage)
  useEffect(() => {
    fetchPageRef.current = fetchPage
  }, [fetchPage])

  useEffect(() => {
    pageRef.current = 1
    setArticles([])
    setHasMore(true)
    fetchPageRef.current(1, false)
  }, [debouncedFilter, view, isMockData])

  const loadMore = useCallback(() => {
    if (loading || loadingMore || !hasMore) return
    pageRef.current += 1
    fetchPageRef.current(pageRef.current, true)
  }, [loading, loadingMore, hasMore])

  const reset = useCallback(() => {
    pageRef.current = 1
    setArticles([])
    setHasMore(true)
    fetchPageRef.current(1, false)
  }, [])

  return {
    articles,
    loading,
    loadingMore,
    error,
    sourceErrors,
    hasMore,
    loadMore,
    reset,
  }
}
