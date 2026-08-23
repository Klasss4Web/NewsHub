import dotenv from 'dotenv'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({ path: path.resolve(__dirname, '../../.env') })

export const ENV = {
  PORT: Number(process.env.PORT) || 3001,
  NEWSAPI_KEY: process.env.NEWSAPI_KEY || '',
  GUARDIAN_KEY: process.env.GUARDIAN_KEY || '',
  NYTIMES_KEY: process.env.NYTIMES_KEY || '',
}
