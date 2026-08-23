import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { NyTimesAdapter } from '@/api/adapters'
import * as client from '@/api/clients/nyTimesClient'
import type { NyTimesResponse } from '@/api/clients/nyTimesClient'

describe('NyTimesAdapter', () => {
  const adapter = new NyTimesAdapter()

  beforeEach(() => {
    vi.spyOn(client, 'fetchNyTimesArticles').mockResolvedValue({
      status: 'OK',
      response: {
        docs: [
          {
            _id: 'nyt-1',
            abstract: 'NYT abstract',
            web_url: 'https://nytimes.com/test',
            snippet: 'NYT snippet',
            lead_paragraph: 'NYT lead',
            source: 'The New York Times',
            multimedia: [],
            headline: { main: 'NYT Test' },
            byline: { original: 'By Bob Jones', person: [] },
            pub_date: '2024-01-15T10:00:00Z',
            news_desk: 'Business',
            section_name: 'Business Day',
          },
        ],
        metadata: { hits: 20, offset: 0, time: 0 },
      },
    } as NyTimesResponse)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('normalises NYT response into Article shape', async () => {
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

    expect(result.articles[0]).toMatchObject({
      id: 'nytimes-nyt-1',
      title: 'NYT Test',
      source: 'The New York Times',
      author: 'Bob Jones',
      category: 'business',
    })
  })

  it('uses the absolute default image URL without duplicating the base URL', async () => {
    vi.spyOn(client, 'fetchNyTimesArticles').mockResolvedValue({
      status: 'OK',
      response: {
        docs: [
          {
            _id: 'nyt-2',
            abstract: 'NYT abstract',
            web_url: 'https://nytimes.com/test',
            snippet: 'NYT snippet',
            lead_paragraph: 'NYT lead',
            source: 'The New York Times',
            multimedia: {
              caption: '',
              credit: '',
              default: {
                url: 'https://static01.nyt.com/images/2026/08/21/test-articleLarge.jpg',
                height: 400,
                width: 600,
              },
              thumbnail: {
                url: 'https://static01.nyt.com/images/2026/08/21/test-thumbStandard.jpg',
                height: 75,
                width: 75,
              },
            },
            headline: { main: 'NYT Test' },
            byline: { original: 'By Bob Jones', person: [] },
            pub_date: '2024-01-15T10:00:00Z',
            news_desk: 'Business',
            section_name: 'Business Day',
          },
        ],
        metadata: { hits: 1, offset: 0, time: 0 },
      },
    } as NyTimesResponse)

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

    expect(result.articles[0].imageUrl).toBe(
      'https://static01.nyt.com/images/2026/08/21/test-articleLarge.jpg'
    )
  })

  it('returns an empty array when docs is not an array', async () => {
    vi.spyOn(client, 'fetchNyTimesArticles').mockResolvedValue({
      status: 'OK',
      response: {
        docs: null,
        metadata: { hits: 0, offset: 0, time: 0 },
      },
    } as unknown as NyTimesResponse)

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
