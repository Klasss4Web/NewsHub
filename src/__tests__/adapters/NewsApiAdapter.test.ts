import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { NewsApiAdapter } from '@/api/adapters'
import * as client from '@/api/clients/newsApiClient'
import type { NewsApiResponse } from '@/api/clients/newsApiClient'

describe('NewsApiAdapter', () => {
  const adapter = new NewsApiAdapter()

  beforeEach(() => {
    vi.spyOn(client, 'fetchNewsApiArticles').mockResolvedValue({
      status: 'ok',
      totalResults: 2,
      articles: [
        {
          source: { id: 'test', name: 'Test Source' },
          author: 'John Doe',
          title: 'Test Article',
          description: 'Test description',
          url: 'https://example.com/1',
          urlToImage: 'https://example.com/1.jpg',
          publishedAt: '2024-01-15T10:00:00Z',
          content: null,
        },
      ],
    } as NewsApiResponse)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('normalises NewsAPI response into Article shape', async () => {
    const result = await adapter.fetch(
      {
        keyword: 'test',
        fromDate: null,
        toDate: null,
        category: null,
        sources: [],
      },
      { page: 1, pageSize: 10 }
    )

    expect(result.articles).toHaveLength(1)
    expect(result.articles[0]).toMatchObject({
      title: 'Test Article',
      source: 'NewsAPI',
      author: 'John Doe',
      url: 'https://example.com/1',
      imageUrl: 'https://example.com/1.jpg',
    })
    expect(result.articles[0].publishedAt).toBeInstanceOf(Date)
  })

  it('reports hasMore correctly', async () => {
    const result = await adapter.fetch(
      {
        keyword: 'test',
        fromDate: null,
        toDate: null,
        category: null,
        sources: [],
      },
      { page: 1, pageSize: 1 }
    )

    expect(result.hasMore).toBe(true)
  })

  it('returns an empty array when articles is not an array', async () => {
    vi.spyOn(client, 'fetchNewsApiArticles').mockResolvedValue({
      status: 'ok',
      totalResults: 0,
      articles: null,
    } as unknown as NewsApiResponse)

    const result = await adapter.fetch(
      {
        keyword: 'test',
        fromDate: null,
        toDate: null,
        category: null,
        sources: [],
      },
      { page: 1, pageSize: 10 }
    )

    expect(result.articles).toEqual([])
  })
})
