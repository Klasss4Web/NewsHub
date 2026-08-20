export const NEWS_CATEGORIES = [
  'business',
  'entertainment',
  'health',
  'science',
  'sports',
  'technology',
  'politics',
  'world',
] as const

export type NewsCategory = (typeof NEWS_CATEGORIES)[number]

export const DEFAULT_CATEGORIES: NewsCategory[] = [...NEWS_CATEGORIES]
