import { Router } from 'express'
import { fetchNyTimesFromApi } from '../services/nyTimesApiService.js'
import { HttpError } from '../utils/httpError.js'
import { logger } from '../utils/logger.js'

const getErrorStatus = (error: unknown): number =>
  error instanceof HttpError && error.status >= 400 && error.status < 500
    ? error.status
    : 500

const router = Router()

router.get('/api/nytimes', async (req, res) => {
  try {
    const { q, page, pageSize, begin_date, end_date, fq } = req.query

    const data = await fetchNyTimesFromApi({
      q: typeof q === 'string' ? q : undefined,
      page: typeof page === 'string' ? Number(page) : undefined,
      pageSize: typeof pageSize === 'string' ? Number(pageSize) : undefined,
      begin_date: typeof begin_date === 'string' ? begin_date : undefined,
      end_date: typeof end_date === 'string' ? end_date : undefined,
      fq: typeof fq === 'string' ? fq : undefined,
    })

    res.json(data)
  } catch (error) {
    logger.error('Error fetching articles from The New York Times', error)
    res.status(getErrorStatus(error)).json({
      status: 'error',
      message: 'Failed to fetch articles from The New York Times',
    })
  }
})

export default router
