import { useEffect, useState } from 'react'
import { NewsApiAdapter, GuardianAdapter, NyTimesAdapter } from '@/api/adapters'
import { NewsRepository } from '@/api/repositories/NewsRepository'
import type { Article } from '@/types'

const repository = new NewsRepository([
  new NewsApiAdapter(),
  new GuardianAdapter(),
  new NyTimesAdapter(),
])

const MAX_RELATED = 4

interface UseRelatedArticlesResult {
  related: Article[]
  loading: boolean
  error: string | null
}

export function useRelatedArticles(
  article: Article | null | undefined
): UseRelatedArticlesResult {
  const [related, setRelated] = useState<Article[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!article) {
      setRelated([])
      setError(null)
      return
    }

    let cancelled = false

    const fetchRelated = async () => {
      setLoading(true)
      setError(null)

      try {
        const result = await repository.fetchArticles(
          {
            keyword: '',
            fromDate: null,
            toDate: null,
            category: article.category,
            sources: [article.sourceId],
          },
          { page: 1, pageSize: 20 }
        )

        if (cancelled) return

        const filtered = result.articles
          .filter((item) => item.id !== article.id)
          .slice(0, MAX_RELATED)

        setRelated(filtered)
      } catch (err) {
        if (cancelled) return
        setError(
          err instanceof Error
            ? err.message
            : 'Failed to load related articles. Please try again.'
        )
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    fetchRelated()

    return () => {
      cancelled = true
    }
  }, [article])

  return { related, loading, error }
}
