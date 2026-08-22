/**
 * Filters applied to article searches.
 */
export interface ArticleFilter {
  keyword: string
  fromDate: string | null
  toDate: string | null
  category: string | null
  sources: string[]
  authors?: string[]
  /**
   * Which NewsAPI endpoint to use. This is driven by the current feed view:
   * - 'top-headlines' is used for My Feed (supports category, no date range).
   * - 'everything' is used for All News (supports date range, no category).
   */
  newsApiEndpoint?: 'top-headlines' | 'everything'
}

/**
 * Pagination options for repository queries.
 */
export interface PaginationOptions {
  page: number
  pageSize: number
}
