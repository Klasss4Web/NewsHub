/**
 * Normalised article shape used throughout the application.
 * Every external news API is mapped to this interface via adapters.
 */
export interface Article {
  id: string
  title: string
  description: string | null
  url: string
  imageUrl: string | null
  source: string
  sourceId: string
  author: string | null
  category: string | null
  publishedAt: Date
}

/**
 * Generic result returned by each adapter.
 * Includes pagination metadata for infinite scroll.
 */
export interface AdapterResult {
  articles: Article[]
  totalResults: number
  currentPage: number
  hasMore: boolean
}

/**
 * Represents a single news source available in the aggregator.
 */
export interface NewsSource {
  id: string
  name: string
  key: string
}
