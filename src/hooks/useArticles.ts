import { useCallback, useEffect, useRef, useState } from 'react'
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
  const { isPreferredSource, isPreferredCategory, isPreferredAuthor } =
    usePreferences()
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sourceErrors, setSourceErrors] = useState<string[]>([])
  const [hasMore, setHasMore] = useState(true)
  const pageRef = useRef(1)
  const debouncedFilter = useDebounce(filter, 350)

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
        const effectiveSources =
          filter.sources.length > 0 ? filter.sources : DEFAULT_SOURCES

        const result = await repository.fetchArticles(
          { ...filter, sources: effectiveSources },
          { page, pageSize: PAGE_SIZE }
        )

        setSourceErrors(result.errors)

        if (page === 1) {
          setArticles(applyPersonalisation(result.articles))
        } else {
          setArticles((prev) => {
            const combined = [...prev, ...result.articles]
            const seen = new Set<string>()
            const deduplicated = combined.filter((article) => {
              if (seen.has(article.id)) return false
              seen.add(article.id)
              return true
            })
            return applyPersonalisation(deduplicated)
          })
        }

        setHasMore(result.hasMore)
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
    [filter, applyPersonalisation]
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
