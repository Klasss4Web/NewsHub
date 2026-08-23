import { describe, it, expect, vi } from 'vitest'
import request from 'supertest'
import express from 'express'
import newsRouter from './news.js'

vi.mock('../services/newsApiService.js', () => ({
  fetchNewsFromApi: vi.fn(),
  fetchNewsFromEverythingApi: vi.fn(),
}))

import {
  fetchNewsFromApi,
  fetchNewsFromEverythingApi,
} from '../services/newsApiService.js'

const mockFetchNewsFromApi = vi.mocked(fetchNewsFromApi)
const mockFetchNewsFromEverythingApi = vi.mocked(fetchNewsFromEverythingApi)

describe('GET /api/news', () => {
  const app = express()
  app.use(newsRouter)

  it('returns news data from NewsAPI', async () => {
    mockFetchNewsFromApi.mockResolvedValue({
      status: 'ok',
      totalResults: 1,
      articles: [],
    })

    const response = await request(app)
      .get('/api/news?q=technology&page=1&pageSize=10')
      .expect(200)

    expect(response.body.status).toBe('ok')
    expect(mockFetchNewsFromApi).toHaveBeenCalledWith({
      q: 'technology',
      page: 1,
      pageSize: 10,
      from: undefined,
      to: undefined,
      sortBy: undefined,
      category: undefined,
    })
  })

  it('returns 500 with a generic message when the service throws', async () => {
    mockFetchNewsFromApi.mockRejectedValue(new Error('NewsAPI error'))

    const response = await request(app).get('/api/news').expect(500)

    expect(response.body.status).toBe('error')
    expect(response.body.message).toBe(
      'Failed to fetch articles from NewsAPI'
    )
  })
})

describe('GET /api/news/everything', () => {
  const app = express()
  app.use(newsRouter)

  it('returns news data from NewsAPI /everything', async () => {
    mockFetchNewsFromEverythingApi.mockResolvedValue({
      status: 'ok',
      totalResults: 1,
      articles: [],
    })

    const response = await request(app)
      .get(
        '/api/news/everything?q=technology&page=1&pageSize=10&from=2026-08-20&to=2026-08-21T19%3A55%3A26Z'
      )
      .expect(200)

    expect(response.body.status).toBe('ok')
    expect(mockFetchNewsFromEverythingApi).toHaveBeenCalledWith({
      q: 'technology',
      page: 1,
      pageSize: 10,
      from: '2026-08-20',
      to: '2026-08-21T19:55:26Z',
      sortBy: undefined,
    })
  })

  it('returns 500 with a generic message when the /everything service throws', async () => {
    mockFetchNewsFromEverythingApi.mockRejectedValue(
      new Error('NewsAPI error')
    )

    const response = await request(app).get('/api/news/everything').expect(500)

    expect(response.body.status).toBe('error')
    expect(response.body.message).toBe(
      'Failed to fetch articles from NewsAPI'
    )
  })
})
