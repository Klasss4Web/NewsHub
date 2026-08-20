import type { NewsSource } from '@/types'

export const NEWS_SOURCES: NewsSource[] = [
  { id: 'newsapi', name: 'NewsAPI' },
  { id: 'guardian', name: 'The Guardian' },
  { id: 'nytimes', name: 'The New York Times' },
]

export const DEFAULT_SOURCES = NEWS_SOURCES.map((source) => source.id)
