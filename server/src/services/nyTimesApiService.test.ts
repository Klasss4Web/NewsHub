import { describe, it, expect, vi } from 'vitest'
import { fetchNyTimesFromApi } from './nyTimesApiService.js'

const mockResponse = {
  status: 'OK',
  response: {
    docs: [],
    metadata: { hits: 0, offset: 0, time: 0 },
  },
}

describe('fetchNyTimesFromApi', () => {
  it('calls The New York Times API with the server-side API key', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    } as Response)

    const result = await fetchNyTimesFromApi({
      q: 'technology',
      page: 2,
      pageSize: 10,
      begin_date: '2024-01-01',
      end_date: '2024-01-31',
      fq: 'news_desk:("Technology")',
    })

    expect(global.fetch).toHaveBeenCalledOnce()
    const url = (global.fetch as ReturnType<typeof vi.fn>).mock.calls[0][0]
    expect(url).toContain(
      'https://api.nytimes.com/svc/search/v2/articlesearch.json'
    )
    expect(url).toContain('q=technology')
    expect(url).toContain('page=1')
    expect(url).toContain('begin_date=20240101')
    expect(url).toContain('end_date=20240131')
    expect(url).toContain('fq=news_desk%3A%28%22Technology%22%29')
    expect(url).toContain('api-key=')
    expect(result).toEqual(mockResponse)
  })

  it('throws when The New York Times API returns an error', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 401,
      text: async () => 'Unauthorized',
    } as Response)

    await expect(fetchNyTimesFromApi({})).rejects.toThrow('401')
  })
})
