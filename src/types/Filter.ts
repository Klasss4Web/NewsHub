/**
 * Filters applied to article searches.
 */
export interface ArticleFilter {
  keyword: string
  fromDate: string | null
  toDate: string | null
  category: string | null
  sources: string[]
}

/**
 * Pagination options for repository queries.
 */
export interface PaginationOptions {
  page: number
  pageSize: number
}
