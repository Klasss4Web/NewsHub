import { describe, it, expect, vi } from 'vitest'
import { fetchGuardianFromApi } from './guardianApiService.js'

const mockResponse = {
  response: {
    status: 'ok',
    total: 1,
    pages: 1,
    currentPage: 1,
    results: [],
  },
}

describe('fetchGuardianFromApi', () => {
  it('calls The Guardian API with the server-side API key', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    } as Response)

    const result = await fetchGuardianFromApi({
      q: 'technology',
      page: 2,
      pageSize: 10,
      from: '2024-01-01',
      to: '2024-01-31',
      category: 'news',
    })

    expect(global.fetch).toHaveBeenCalledOnce()
    const url = (global.fetch as ReturnType<typeof vi.fn>).mock.calls[0][0]
    expect(url).toContain('https://content.guardianapis.com/search')
    expect(url).toContain('q=technology')
    expect(url).toContain('page=2')
    expect(url).toContain('page-size=10')
    expect(url).toContain('from-date=2024-01-01')
    expect(url).toContain('to-date=2024-01-31')
    expect(url).toContain('section=news')
    expect(url).toContain('api-key=')
    expect(result).toEqual(mockResponse)
  })

  it('throws when The Guardian API returns an error', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 401,
      text: async () => 'Unauthorized',
    } as Response)

    await expect(fetchGuardianFromApi({})).rejects.toThrow('401')
  })
})
