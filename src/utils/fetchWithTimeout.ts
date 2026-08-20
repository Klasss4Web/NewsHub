export interface FetchConfig {
  timeout?: number
}

export interface ApiErrorBody {
  message?: string
  faultstring?: string
  status?: string
  code?: string
  errorcode?: string
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public body: ApiErrorBody | null = null
  ) {
    super(message)
    this.name = 'ApiError'
  }

  get isRateLimit(): boolean {
    const text = this.message.toLowerCase()
    return (
      text.includes('rate limit') ||
      text.includes('quota violation') ||
      text.includes('too many requests') ||
      this.status === 429
    )
  }
}

const DEFAULT_TIMEOUT = 30000

const extractErrorMessage = async (
  response: Response
): Promise<ApiErrorBody | null> => {
  try {
    const body = (await response.json()) as ApiErrorBody
    return body
  } catch {
    return null
  }
}

/**
 * Custom fetch wrapper inspired by the pattern used in
 * C:\Dev\open-retail\drivers-web-app\src\configs\fetch.js
 *
 * Features:
 * - Enforces a request timeout via AbortController
 * - Supports full URLs and relative paths
 * - Defaults JSON content-type when appropriate
 * - Parses error response bodies and throws descriptive ApiError instances
 */
export const fetchWithTimeout = async (
  url: string,
  options: RequestInit = {},
  { timeout = DEFAULT_TIMEOUT }: FetchConfig = {}
): Promise<Response> => {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeout)

  const headers = new Headers(options.headers || {})

  if (
    !headers.has('Content-Type') &&
    !(options.body instanceof FormData) &&
    !(options.body instanceof URLSearchParams)
  ) {
    headers.set('Content-Type', 'application/json')
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
      signal: controller.signal,
    })

    if (!response.ok) {
      const body = await extractErrorMessage(response)
      const message =
        body?.faultstring ||
        body?.message ||
        body?.status ||
        `HTTP ${response.status}: ${response.statusText}`
      throw new ApiError(message, response.status, body)
    }

    return response
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new ApiError(
        'Request timed out. Please try again.',
        408,
        null
      )
    }

    if (error instanceof ApiError) {
      throw error
    }

    throw new ApiError(
      error instanceof Error ? error.message : 'An unexpected network error occurred.',
      0,
      null
    )
  } finally {
    clearTimeout(timeoutId)
  }
}
