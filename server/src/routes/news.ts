import { Router } from 'express'
import {
  fetchNewsFromApi,
  fetchNewsFromEverythingApi,
} from '../services/newsApiService.js'
import { HttpError } from '../utils/httpError.js'
import { logger } from '../utils/logger.js'

const getErrorStatus = (error: unknown): number =>
  error instanceof HttpError && error.status >= 400 && error.status < 500
    ? error.status
    : 500

const router = Router()

router.get('/api/news', async (req, res) => {
  try {
    const { q, page, pageSize, from, to, sortBy, category } = req.query

    const data = await fetchNewsFromApi({
      q: typeof q === 'string' ? q : undefined,
      page: typeof page === 'string' ? Number(page) : undefined,
      pageSize: typeof pageSize === 'string' ? Number(pageSize) : undefined,
      from: typeof from === 'string' ? from : undefined,
      to: typeof to === 'string' ? to : undefined,
      sortBy: typeof sortBy === 'string' ? sortBy : undefined,
      category: typeof category === 'string' ? category : undefined,
    })

    res.json(data)
  } catch (error) {
    logger.error('Error fetching news from NewsAPI', error)
    res.status(getErrorStatus(error)).json({
      status: 'error',
      message: 'Failed to fetch articles from NewsAPI',
    })
  }
})

router.get('/api/news/everything', async (req, res) => {
  try {
    const { q, page, pageSize, from, to, sortBy } = req.query

    const data = await fetchNewsFromEverythingApi({
      q: typeof q === 'string' ? q : undefined,
      page: typeof page === 'string' ? Number(page) : undefined,
      pageSize: typeof pageSize === 'string' ? Number(pageSize) : undefined,
      from: typeof from === 'string' ? from : undefined,
      to: typeof to === 'string' ? to : undefined,
      sortBy: typeof sortBy === 'string' ? sortBy : undefined,
    })

    res.json(data)
  } catch (error) {
    logger.error('Error fetching news from NewsAPI /everything', error)
    res.status(getErrorStatus(error)).json({
      status: 'error',
      message: 'Failed to fetch articles from NewsAPI',
    })
  }
})

export default router
