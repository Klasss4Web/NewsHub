import cors from 'cors'
import express from 'express'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { ENV } from './config/env.js'
import guardianRouter from './routes/guardian.js'
import newsRouter from './routes/news.js'
import nyTimesRouter from './routes/nytimes.js'

const app = express()

app.use(cors())
app.use(express.json())

app.use(newsRouter)
app.use(guardianRouter)
app.use(nyTimesRouter)

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' })
})

if (process.env.NODE_ENV === 'production') {
  const __dirname = path.dirname(fileURLToPath(import.meta.url))
  const distPath = path.resolve(__dirname, '../../dist')

  app.use(express.static(distPath))

  app.get('*', (_req, res) => {
    res.sendFile(path.join(distPath, 'index.html'))
  })
}

app.listen(ENV.PORT, () => {
  console.log(`Server running on http://localhost:${ENV.PORT}`)
})
