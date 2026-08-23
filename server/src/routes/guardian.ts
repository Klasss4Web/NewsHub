import { Router } from 'express'
import { fetchGuardianFromApi } from '../services/guardianApiService.js'
import { HttpError } from '../utils/httpError.js'
import { logger } from '../utils/logger.js'

const getErrorStatus = (error: unknown): number =>
  error instanceof HttpError && error.status >= 400 && error.status < 500
    ? error.status
    : 500

const router = Router()

router.get('/api/guardian', async (req, res) => {
  try {
    const { q, page, pageSize, from, to, section } = req.query

    const data = await fetchGuardianFromApi({
      q: typeof q === 'string' ? q : undefined,
      page: typeof page === 'string' ? Number(page) : undefined,
      pageSize: typeof pageSize === 'string' ? Number(pageSize) : undefined,
      from: typeof from === 'string' ? from : undefined,
      to: typeof to === 'string' ? to : undefined,
      category: typeof section === 'string' ? section : undefined,
    })

    res.json(data)
  } catch (error) {
    logger.error('Error fetching articles from The Guardian', error)
    res.status(getErrorStatus(error)).json({
      status: 'error',
      message: 'Failed to fetch articles from The Guardian',
    })
  }
})

export default router
