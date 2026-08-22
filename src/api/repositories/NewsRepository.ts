import type { IArticleAdapter } from '@/api/adapters/IArticleAdapter'
import { ApiError } from '@/utils'
import type { Article, ArticleFilter, PaginationOptions } from '@/types'
import { DEFAULT_SOURCES } from '@/constants'

export interface RepositoryResult {
  articles: Article[]
  hasMore: boolean
  errors: string[]
}

const formatError = (adapterName: string, error: unknown): string => {
  if (error instanceof ApiError && error.isRateLimit) {
    return `${adapterName} rate limit exceeded. Please try again later.`
  }

  if (
    error instanceof ApiError &&
    (error.status === 401 || error.status === 403)
  ) {
    return `${adapterName} API key is invalid or expired.`
  }

  const message = error instanceof Error ? error.message : 'Unknown error'
  return `${adapterName}: ${message}`
}

/**
 * Aggregates articles from multiple news source adapters.
 *
 * Design decisions:
 * - Uses Promise.allSettled so a single failing source doesn't break the feed.
 * - Sorts the combined result by publication date (newest first).
 * - Deduplicates articles by URL to avoid the same story appearing twice.
 * - Normalises adapter errors into user-friendly messages.
 */
export class NewsRepository {
  constructor(private readonly adapters: IArticleAdapter[]) {}

  async fetchArticles(
    filter: ArticleFilter,
    pagination: PaginationOptions
  ): Promise<RepositoryResult> {
    const selectedSources =
      filter.sources.length > 0
        ? filter.sources
        : this.adapters.map((a) => a.sourceId)

    const activeAdapters = this.adapters.filter((adapter) =>
      selectedSources.includes(adapter.sourceId)
    )

    const results = await Promise.allSettled(
      activeAdapters.map((adapter) => adapter.fetch(filter, pagination))
    )

    const errors: string[] = []
    const allArticles: Article[] = []
    let hasMore = false

    results.forEach((result, index) => {
      const adapter = activeAdapters[index]

      if (result.status === 'fulfilled') {
        allArticles.push(...result.value.articles)
        if (result.value.hasMore) {
          hasMore = true
        }
      } else {
        errors.push(formatError(adapter.sourceName, result.reason))
      }
    })

    const deduplicatedArticles = this.deduplicateByUrl(allArticles)
    const sortedArticles = this.sortByDateAndSource(deduplicatedArticles)

    return {
      articles: sortedArticles,
      hasMore,
      errors,
    }
  }

  private deduplicateByUrl(articles: Article[]): Article[] {
    const seen = new Set<string>()
    return articles.filter((article) => {
      if (seen.has(article.url)) {
        return false
      }
      seen.add(article.url)
      return true
    })
  }

  private sortByDateAndSource(articles: Article[]): Article[] {
    const sourceRank = (sourceId: string) =>
      DEFAULT_SOURCES.indexOf(sourceId) === -1
        ? DEFAULT_SOURCES.length
        : DEFAULT_SOURCES.indexOf(sourceId)

    return [...articles].sort((a, b) => {
      const dateDiff = b.publishedAt.getTime() - a.publishedAt.getTime()
      if (dateDiff !== 0) return dateDiff
      return sourceRank(a.sourceId) - sourceRank(b.sourceId)
    })
  }
}
