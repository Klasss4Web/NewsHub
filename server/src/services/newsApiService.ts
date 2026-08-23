import { ENV } from '../config/env.js'
import { HttpError } from '../utils/httpError.js'
import type { NewsApiResponse } from '../types/news.js'

const NEWSAPI_TOP_HEADLINES_URL = 'https://newsapi.org/v2/top-headlines'
const NEWSAPI_EVERYTHING_URL = 'https://newsapi.org/v2/everything'

export interface FetchNewsOptions {
  q?: string
  page?: number
  pageSize?: number
  from?: string
  to?: string
  sortBy?: string
  category?: string
}

const buildCommonParams = (options: FetchNewsOptions): URLSearchParams => {
  return new URLSearchParams({
    q: options.q || 'news',
    page: String(options.page || 1),
    pageSize: String(options.pageSize || 20),
    apiKey: ENV.NEWSAPI_KEY || '',
  })
}

export const fetchNewsFromApi = async (
  options: FetchNewsOptions
): Promise<NewsApiResponse> => {
  if (!ENV.NEWSAPI_KEY) {
    throw new Error('NEWSAPI_KEY is not configured on the server')
  }

  const params = buildCommonParams(options)

  if (!options.q) params.set('sortBy', options?.sortBy || 'publishedAt')
  if (options.from) params.set('from', options.from)
  if (options.to) params.set('to', options.to)
  if (options.category) params.set('category', options.category)

  const response = await fetch(
    `${NEWSAPI_TOP_HEADLINES_URL}?${params.toString()}`
  )

  if (!response.ok) {
    const errorText = await response.text()
    throw new HttpError(
      `NewsAPI responded with status ${response.status}: ${errorText}`,
      response.status
    )
  }

  return response.json() as Promise<NewsApiResponse>
}

export const fetchNewsFromEverythingApi = async (
  options: FetchNewsOptions
): Promise<NewsApiResponse> => {
  if (!ENV.NEWSAPI_KEY) {
    throw new Error('NEWSAPI_KEY is not configured on the server')
  }

  const params = buildCommonParams(options)

  // The /everything endpoint supports date ranges but does not support
  // category filtering.
  if (options.from) params.set('from', options.from)
  if (options.to) params.set('to', options.to)

  const response = await fetch(`${NEWSAPI_EVERYTHING_URL}?${params.toString()}`)

  if (!response.ok) {
    const errorText = await response.text()
    throw new HttpError(
      `NewsAPI responded with status ${response.status}: ${errorText}`,
      response.status
    )
  }

  return response.json() as Promise<NewsApiResponse>
}
