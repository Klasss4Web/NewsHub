import { API_ENDPOINTS, API_KEYS } from '@/services/apiConfigService'
import { getUseMockData } from '@/services/dataModeService'
import { fetchMockArticles } from '@/services/mockDataService'
import { fetchWithTimeout } from '@/utils'
import type { ArticleFilter, PaginationOptions } from '@/types'

export interface NyTimesMultimediaItem {
  url: string
  subtype?: string
}

export interface NyTimesMultimediaObject {
  caption?: string
  credit?: string
  default?: { url: string; height?: number; width?: number }
  thumbnail?: { url: string; height?: number; width?: number }
}

export interface NyTimesResponse {
  status: string
  response: {
    docs: Array<{
      _id: string
      abstract: string
      web_url: string
      snippet: string
      lead_paragraph: string
      source: string
      multimedia: NyTimesMultimediaItem[] | NyTimesMultimediaObject
      headline: {
        main: string
      }
      byline: {
        original: string | null
        person: Array<{ firstname: string; lastname: string }>
      }
      pub_date: string
      news_desk: string
      section_name: string
    }>
    metadata: {
      hits: number
      offset: number
      time: number
    }
  }
}

/**
 * Fetch articles from The New York Times Article Search API.
 */
export const fetchNyTimesArticles = async (
  filter: ArticleFilter,
  pagination: PaginationOptions
): Promise<NyTimesResponse> => {
  if (getUseMockData() || !API_KEYS.nytimes) {
    const result = await fetchMockArticles(
      filter,
      pagination.page,
      pagination.pageSize,
      'nytimes'
    )
    return {
      status: 'OK',
      response: {
        docs: result.articles.map((article) => ({
          _id: article.id,
          abstract: article.description || '',
          web_url: article.url,
          snippet: article.description || '',
          lead_paragraph: article.description || '',
          source: article.source,
          multimedia: {},
          headline: { main: article.title },
          byline: { original: article.author, person: [] },
          pub_date: article.publishedAt.toISOString(),
          news_desk: article.category || 'News',
          section_name: article.category || 'News',
        })),
        metadata: {
          hits: result.totalResults,
          offset: (pagination.page - 1) * pagination.pageSize,
          time: 0,
        },
      },
    }
  }

  const params = new URLSearchParams({
    q: filter.keyword || 'news',
    page: String(pagination.page - 1),
    'api-key': API_KEYS.nytimes,
    sort: 'newest',
  })

  if (filter.fromDate)
    params.set('begin_date', filter.fromDate.replace(/-/g, ''))
  if (filter.toDate) params.set('end_date', filter.toDate.replace(/-/g, ''))
  if (filter.category) {
    params.set('fq', `news_desk:("${filter.category}")`)
  }

  const response = await fetchWithTimeout(
    `${API_ENDPOINTS.nytimes}?${params.toString()}`
  )
  return response.json() as Promise<NyTimesResponse>
}
