import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { GuardianAdapter } from '@/api/adapters'
import * as client from '@/api/clients/guardianClient'
import type { GuardianResponse } from '@/api/clients/guardianClient'

describe('GuardianAdapter', () => {
  const adapter = new GuardianAdapter()

  beforeEach(() => {
    vi.spyOn(client, 'fetchGuardianArticles').mockResolvedValue({
      response: {
        status: 'ok',
        total: 10,
        pages: 2,
        currentPage: 1,
        results: [
          {
            id: 'guardian-1',
            type: 'article',
            sectionId: 'technology',
            sectionName: 'Technology',
            webPublicationDate: '2024-01-15T10:00:00Z',
            webTitle: 'Guardian Test',
            webUrl: 'https://theguardian.com/test',
            fields: {
              trailText: 'Guardian trail text',
              thumbnail: 'https://theguardian.com/thumb.jpg',
              byline: 'Jane Smith',
            },
          },
        ],
      },
    } as GuardianResponse)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('normalises Guardian response into Article shape', async () => {
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
      id: 'guardian-guardian-1',
      title: 'Guardian Test',
      source: 'The Guardian',
      category: 'technology',
      author: 'Jane Smith',
    })
  })
})
