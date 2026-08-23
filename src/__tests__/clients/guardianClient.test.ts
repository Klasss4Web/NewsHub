import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { fetchGuardianArticles } from '@/api/clients/guardianClient'

describe('fetchGuardianArticles', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn())
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('calls the local /api/guardian proxy without exposing an API key', async () => {
    const fetchMock = global.fetch as ReturnType<typeof vi.fn>
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({
        response: {
          status: 'ok',
          total: 0,
          pages: 0,
          currentPage: 1,
          results: [],
        },
      }),
    })

    await fetchGuardianArticles(
      {
        keyword: 'technology',
        fromDate: '2024-01-01',
        toDate: '2024-01-31',
        category: 'news',
        sources: [],
      },
      { page: 1, pageSize: 10 }
    )

    expect(fetchMock).toHaveBeenCalledOnce()
    const url = fetchMock.mock.calls[0][0]
    expect(url).toContain('/api/guardian')
    expect(url).toContain('q=technology')
    expect(url).toContain('page=1')
    expect(url).toContain('page-size=10')
    expect(url).toContain('from=2024-01-01')
    expect(url).toContain('to=2024-01-31')
    expect(url).toContain('section=news')
    expect(url).not.toContain('api-key=')
  })
})
