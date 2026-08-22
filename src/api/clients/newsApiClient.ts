import { API_BASE_URL } from '@/services/apiConfigService'
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
 * Fetch articles from NewsAPI.org via the local proxy server.
 */
export const fetchNewsApiArticles = async (
  filter: ArticleFilter,
  pagination: PaginationOptions
): Promise<NewsApiResponse> => {
  if (getUseMockData()) {
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
    sortBy: 'publishedAt',
  })

  const useEverything = filter.newsApiEndpoint === 'everything'

  if (useEverything) {
    // /everything supports date ranges but does not support category.
    // Avoid calling the API when only the start date is selected; a range
    // needs an end date to be meaningful for this endpoint.
    if (filter.fromDate && !filter.toDate) {
      return {
        status: 'ok',
        totalResults: 0,
        articles: [],
      }
    }

    if (filter.fromDate) params.set('from', filter.fromDate)
    if (filter.toDate) params.set('to', filter.toDate)
  } else {
    // /top-headlines supports category but does not support date ranges.
    if (filter.category) params.set('category', filter.category)
  }

  const endpoint = useEverything ? 'news/everything' : 'news'

  const response = await fetchWithTimeout(
    `${API_BASE_URL}/${endpoint}?${params.toString()}`
  )
  return response.json() as Promise<NewsApiResponse>
}
