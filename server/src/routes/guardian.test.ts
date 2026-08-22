import { describe, it, expect, vi } from 'vitest'
import request from 'supertest'
import express from 'express'
import guardianRouter from './guardian.js'

vi.mock('../services/guardianApiService.js', () => ({
  fetchGuardianFromApi: vi.fn(),
}))

import { fetchGuardianFromApi } from '../services/guardianApiService.js'

const mockFetchGuardianFromApi = vi.mocked(fetchGuardianFromApi)

describe('GET /api/guardian', () => {
  const app = express()
  app.use(guardianRouter)

  it('returns Guardian news data', async () => {
    mockFetchGuardianFromApi.mockResolvedValue({
      response: {
        status: 'ok',
        total: 0,
        pages: 0,
        currentPage: 1,
        results: [],
      },
    })

    const response = await request(app)
      .get('/api/guardian?q=technology&page=1&pageSize=10')
      .expect(200)

    expect(response.body.response.status).toBe('ok')
    expect(mockFetchGuardianFromApi).toHaveBeenCalledWith({
      q: 'technology',
      page: 1,
      pageSize: 10,
      from: undefined,
      to: undefined,
      category: undefined,
    })
  })

  it('returns 500 with a generic message when the service throws', async () => {
    mockFetchGuardianFromApi.mockRejectedValue(new Error('Guardian API error'))

    const response = await request(app).get('/api/guardian').expect(500)

    expect(response.body.status).toBe('error')
    expect(response.body.message).toBe(
      'Failed to fetch articles from The Guardian'
    )
  })
})
