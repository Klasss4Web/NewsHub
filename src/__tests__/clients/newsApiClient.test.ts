import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { fetchNewsApiArticles } from '@/api/clients/newsApiClient'

describe('fetchNewsApiArticles', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn())
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('calls the local /api/news proxy for top-headlines without exposing an API key', async () => {
    const fetchMock = global.fetch as ReturnType<typeof vi.fn>
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({
        status: 'ok',
        totalResults: 0,
        articles: [],
      }),
    })

    await fetchNewsApiArticles(
      {
        keyword: 'technology',
        fromDate: '2026-08-20',
        toDate: '2026-08-21T19:55:26Z',
        category: 'business',
        sources: [],
        newsApiEndpoint: 'top-headlines',
      },
      { page: 1, pageSize: 10 }
    )

    expect(fetchMock).toHaveBeenCalledOnce()
    const url = fetchMock.mock.calls[0][0]
    expect(url).toContain('/api/news?')
    expect(url).toContain('q=technology')
    expect(url).toContain('page=1')
    expect(url).toContain('pageSize=10')
    expect(url).toContain('category=business')
    expect(url).not.toContain('from=')
    expect(url).not.toContain('to=')
    expect(url).not.toContain('apiKey=')
  })

  it('does not call the API for /everything when only the from date is selected', async () => {
    const fetchMock = global.fetch as ReturnType<typeof vi.fn>
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({
        status: 'ok',
        totalResults: 0,
        articles: [],
      }),
    })

    const result = await fetchNewsApiArticles(
      {
        keyword: 'technology',
        fromDate: '2026-08-20',
        toDate: null,
        category: 'business',
        sources: [],
        newsApiEndpoint: 'everything',
      },
      { page: 1, pageSize: 10 }
    )

    expect(fetchMock).not.toHaveBeenCalled()
    expect(result).toEqual({
      status: 'ok',
      totalResults: 0,
      articles: [],
    })
  })

  it('calls the local /api/news/everything proxy for everything without exposing an API key', async () => {
    const fetchMock = global.fetch as ReturnType<typeof vi.fn>
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({
        status: 'ok',
        totalResults: 0,
        articles: [],
      }),
    })

    await fetchNewsApiArticles(
      {
        keyword: 'technology',
        fromDate: '2026-08-20',
        toDate: '2026-08-21T19:55:26Z',
        category: 'business',
        sources: [],
        newsApiEndpoint: 'everything',
      },
      { page: 1, pageSize: 10 }
    )

    expect(fetchMock).toHaveBeenCalledOnce()
    const url = fetchMock.mock.calls[0][0]
    expect(url).toContain('/api/news/everything?')
    expect(url).toContain('q=technology')
    expect(url).toContain('page=1')
    expect(url).toContain('pageSize=10')
    expect(url).toContain('from=2026-08-20')
    expect(url).toContain('to=2026-08-21T19%3A55%3A26Z')
    expect(url).not.toContain('category=')
    expect(url).not.toContain('apiKey=')
  })
})
