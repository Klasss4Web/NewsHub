import { API_ENDPOINTS, API_KEYS } from '@/services/apiConfigService'
import { getUseMockData } from '@/services/dataModeService'
import { fetchMockArticles } from '@/services/mockDataService'
import { fetchWithTimeout } from '@/utils'
import type { ArticleFilter, PaginationOptions } from '@/types'

export interface NewsApiResponse {
  status: string
  totalResults: number
  articles: Array<{
    source: { id: string | null; name: string }
    author: string | null
    title: string
    description: string | null
    url: string
    urlToImage: string | null
    publishedAt: string
    content: string | null
  }>
}

/**
 * Fetch articles from NewsAPI.org.
 */
export const fetchNewsApiArticles = async (
  filter: ArticleFilter,
  pagination: PaginationOptions
): Promise<NewsApiResponse> => {
  if (getUseMockData() || !API_KEYS.newsapi) {
    const result = await fetchMockArticles(
      filter,
      pagination.page,
      pagination.pageSize,
      'newsapi'
    )
    return {
      status: 'ok',
      totalResults: result.totalResults,
      articles: result.articles.map((article) => ({
        source: { id: null, name: article.source },
        author: article.author,
        title: article.title,
        description: article.description,
        url: article.url,
        urlToImage: article.imageUrl,
        publishedAt: article.publishedAt.toISOString(),
        content: null,
      })),
    }
  }

  const params = new URLSearchParams({
    q: filter.keyword || 'news',
    page: String(pagination.page),
    pageSize: String(pagination.pageSize),
    apiKey: API_KEYS.newsapi,
    sortBy: 'publishedAt',
  })

  if (filter.fromDate) params.set('from', filter.fromDate)
  if (filter.toDate) params.set('to', filter.toDate)

  const response = await fetchWithTimeout(
    `${API_ENDPOINTS.newsapi}?${params.toString()}`
  )
  return response.json() as Promise<NewsApiResponse>
}
