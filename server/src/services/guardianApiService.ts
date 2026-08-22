import { ENV } from '../config/env.js'
import { HttpError } from '../utils/httpError.js'
import type { GuardianResponse } from '../types/guardian.js'

const GUARDIAN_BASE_URL = 'https://content.guardianapis.com/search'

export interface FetchGuardianOptions {
  q?: string
  page?: number
  pageSize?: number
  from?: string
  to?: string
  category?: string
}

export const fetchGuardianFromApi = async (
  options: FetchGuardianOptions
): Promise<GuardianResponse> => {
  if (!ENV.GUARDIAN_KEY) {
    throw new Error('GUARDIAN_KEY is not configured on the server')
  }

  const params = new URLSearchParams({
    q: options.q || 'news',
    page: String(options.page || 1),
    'page-size': String(options.pageSize || 20),
    'api-key': ENV.GUARDIAN_KEY,
    'show-fields': 'trailText,thumbnail,byline',
  })

  if (!options.q) params.set('order-by', 'newest')
  if (options.from) params.set('from-date', options.from)
  if (options.to) params.set('to-date', options.to)
  if (options.category) params.set('section', options.category)

  console.log({ P: `${GUARDIAN_BASE_URL}?${params.toString()}` })

  const response = await fetch(`${GUARDIAN_BASE_URL}?${params.toString()}`)

  if (!response.ok) {
    const errorText = await response.text()
    throw new HttpError(
      `The Guardian API responded with status ${response.status}: ${errorText}`,
      response.status
    )
  }

  return response.json() as Promise<GuardianResponse>
}
