import type { AdapterResult, ArticleFilter, PaginationOptions } from '@/types'

/**
 * Contract that every news source adapter must implement.
 * This abstraction lets the repository aggregate articles uniformly.
 */
export interface IArticleAdapter {
  readonly sourceId: string
  readonly sourceName: string
  fetch(
    filter: ArticleFilter,
    pagination: PaginationOptions
  ): Promise<AdapterResult>
}
