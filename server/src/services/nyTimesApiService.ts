import { ENV } from '../config/env.js'
import { HttpError } from '../utils/httpError.js'
import type { NyTimesResponse } from '../types/nytimes.js'

const NYTIMES_BASE_URL =
  'https://api.nytimes.com/svc/search/v2/articlesearch.json'

export interface FetchNyTimesOptions {
  q?: string
  fq?: string
  page?: number
  pageSize?: number
  begin_date?: string
  end_date?: string
  category?: string
}

export const fetchNyTimesFromApi = async (
  options: FetchNyTimesOptions
): Promise<NyTimesResponse> => {
  if (!ENV.NYTIMES_KEY) {
    throw new Error('NYTIMES_KEY is not configured on the server')
  }

  const params = new URLSearchParams({
    q: options.q || 'news',
    page: String((options.page || 1) - 1),
    'api-key': ENV.NYTIMES_KEY,
  })

  if (!options.q) params.set('sort', 'newest')

  if (options.begin_date) {
    params.set('begin_date', options.begin_date.replace(/-/g, ''))
  }
  if (options.end_date) {
    params.set('end_date', options.end_date.replace(/-/g, ''))
  }
  if (options.fq) {
    params.set('fq', options?.fq)
  }

  console.log({ Q: `${NYTIMES_BASE_URL}?${params.toString()}` })

  const response = await fetch(`${NYTIMES_BASE_URL}?${params.toString()}`)

  if (!response.ok) {
    const errorText = await response.text()
    throw new HttpError(
      `The New York Times API responded with status ${response.status}: ${errorText}`,
      response.status
    )
  }

  return response.json() as Promise<NyTimesResponse>
}
