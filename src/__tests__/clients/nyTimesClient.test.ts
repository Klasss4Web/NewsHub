import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { fetchNyTimesArticles } from '@/api/clients/nyTimesClient'

describe('fetchNyTimesArticles', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn())
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('calls the local /api/nytimes proxy without exposing an API key', async () => {
    const fetchMock = global.fetch as ReturnType<typeof vi.fn>
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({
        status: 'OK',
        response: {
          docs: [],
          metadata: { hits: 0, offset: 0, time: 0 },
        },
      }),
    })

    await fetchNyTimesArticles(
      {
        keyword: 'technology',
        fromDate: '2024-01-01',
        toDate: '2024-01-31',
        category: 'Technology',
        sources: [],
      },
      { page: 2, pageSize: 10 }
    )

    expect(fetchMock).toHaveBeenCalledOnce()
    const url = fetchMock.mock.calls[0][0]
    expect(url).toContain('/api/nytimes')
    expect(url).toContain('q=technology')
    expect(url).toContain('page=1')
    expect(url).toContain('begin_date=20240101')
    expect(url).toContain('end_date=20240131')
    expect(url).toContain('fq=news_desk%3A%28%22Technology%22%29')
    expect(url).not.toContain('api-key=')
  })
})
