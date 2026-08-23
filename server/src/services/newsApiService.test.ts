import { describe, it, expect, vi } from 'vitest'
import {
  fetchNewsFromApi,
  fetchNewsFromEverythingApi,
} from './newsApiService.js'

const mockResponse = {
  status: 'ok',
  totalResults: 1,
  articles: [
    {
      source: { id: null, name: 'Test' },
      author: null,
      title: 'Test',
      description: null,
      url: 'https://example.com',
      urlToImage: null,
      publishedAt: '2024-01-01T00:00:00Z',
      content: null,
    },
  ],
}

describe('fetchNewsFromApi', () => {
  it('calls NewsAPI /top-headlines with the server-side API key', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    } as Response)

    const result = await fetchNewsFromApi({
      q: 'technology',
      page: 2,
      pageSize: 10,
      category: 'business',
    })

    expect(global.fetch).toHaveBeenCalledOnce()
    const url = (global.fetch as ReturnType<typeof vi.fn>).mock.calls[0][0]
    expect(url).toContain('https://newsapi.org/v2/top-headlines')
    expect(url).toContain('q=technology')
    expect(url).toContain('page=2')
    expect(url).toContain('pageSize=10')
    expect(url).toContain('category=business')
    expect(url).toContain('apiKey=')
    expect(result).toEqual(mockResponse)
  })

  it('throws when NewsAPI returns an error', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 401,
      text: async () => 'Unauthorized',
    } as Response)

    await expect(fetchNewsFromApi({})).rejects.toThrow('401')
  })
})

describe('fetchNewsFromEverythingApi', () => {
  it('calls NewsAPI /everything with the server-side API key', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    } as Response)

    const result = await fetchNewsFromEverythingApi({
      q: 'technology',
      page: 2,
      pageSize: 10,
      from: '2026-08-20',
      to: '2026-08-21T19:55:26Z',
    })

    expect(global.fetch).toHaveBeenCalledOnce()
    const url = (global.fetch as ReturnType<typeof vi.fn>).mock.calls[0][0]
    expect(url).toContain('https://newsapi.org/v2/everything')
    expect(url).toContain('q=technology')
    expect(url).toContain('page=2')
    expect(url).toContain('pageSize=10')
    expect(url).toContain('from=2026-08-20')
    expect(url).toContain('to=2026-08-21T19%3A55%3A26Z')
    expect(url).not.toContain('category=')
    expect(url).toContain('apiKey=')
    expect(result).toEqual(mockResponse)
  })

  it('throws when NewsAPI /everything returns an error', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 401,
      text: async () => 'Unauthorized',
    } as Response)

    await expect(fetchNewsFromEverythingApi({})).rejects.toThrow('401')
  })
})
