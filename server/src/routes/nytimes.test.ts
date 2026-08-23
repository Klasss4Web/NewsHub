import { describe, it, expect, vi } from 'vitest'
import request from 'supertest'
import express from 'express'
import nyTimesRouter from './nytimes.js'

vi.mock('../services/nyTimesApiService.js', () => ({
  fetchNyTimesFromApi: vi.fn(),
}))

import { fetchNyTimesFromApi } from '../services/nyTimesApiService.js'

const mockFetchNyTimesFromApi = vi.mocked(fetchNyTimesFromApi)

describe('GET /api/nytimes', () => {
  const app = express()
  app.use(nyTimesRouter)

  it('returns New York Times news data', async () => {
    mockFetchNyTimesFromApi.mockResolvedValue({
      status: 'OK',
      response: {
        docs: [],
        metadata: { hits: 0, offset: 0, time: 0 },
      },
    })

    const response = await request(app)
      .get('/api/nytimes?q=technology&page=1&pageSize=10')
      .expect(200)

    expect(response.body.status).toBe('OK')
    expect(mockFetchNyTimesFromApi).toHaveBeenCalledWith({
      q: 'technology',
      page: 1,
      pageSize: 10,
      from: undefined,
      to: undefined,
      category: undefined,
    })
  })

  it('returns 500 with a generic message when the service throws', async () => {
    mockFetchNyTimesFromApi.mockRejectedValue(new Error('NYTimes API error'))

    const response = await request(app).get('/api/nytimes').expect(500)

    expect(response.body.status).toBe('error')
    expect(response.body.message).toBe(
      'Failed to fetch articles from The New York Times'
    )
  })
})
