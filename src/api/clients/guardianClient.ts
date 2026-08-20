import { API_ENDPOINTS, API_KEYS, useMockData } from '@/services/apiConfigService'
import { fetchMockArticles } from '@/services/mockDataService'
import { fetchWithTimeout } from '@/utils'
import type { ArticleFilter, PaginationOptions } from '@/types'

export interface GuardianResponse {
  response: {
    status: string
    total: number
    pages: number
    currentPage: number
    results: Array<{
      id: string
      type: string
      sectionId: string
      sectionName: string
      webPublicationDate: string
      webTitle: string
      webUrl: string
      fields?: {
        trailText?: string
        thumbnail?: string
        byline?: string
      }
    }>
  }
}

/**
 * Fetch articles from The Guardian Open Platform.
 */
export const fetchGuardianArticles = async (
  filter: ArticleFilter,
  pagination: PaginationOptions
): Promise<GuardianResponse> => {
  if (useMockData() || !API_KEYS.guardian) {
    const result = await fetchMockArticles(filter, pagination.page, pagination.pageSize, 'guardian')
    return {
      response: {
        status: 'ok',
        total: result.totalResults,
        pages: Math.ceil(result.totalResults / pagination.pageSize),
        currentPage: pagination.page,
        results: result.articles.map((article) => ({
          id: article.id,
          type: 'article',
          sectionId: article.category || 'news',
          sectionName: article.category || 'News',
          webPublicationDate: article.publishedAt.toISOString(),
          webTitle: article.title,
          webUrl: article.url,
          fields: {
            trailText: article.description || '',
            thumbnail: article.imageUrl || '',
            byline: article.author || '',
          },
        })),
      },
    }
  }

  const params = new URLSearchParams({
    q: filter.keyword || 'news',
    page: String(pagination.page),
    'page-size': String(pagination.pageSize),
    'api-key': API_KEYS.guardian,
    'order-by': 'newest',
    'show-fields': 'trailText,thumbnail,byline',
  })

  if (filter.fromDate) params.set('from-date', filter.fromDate)
  if (filter.toDate) params.set('to-date', filter.toDate)
  if (filter.category) params.set('section', filter.category)

  const response = await fetchWithTimeout(
    `${API_ENDPOINTS.guardian}?${params.toString()}`
  )
  return response.json() as Promise<GuardianResponse>
}
