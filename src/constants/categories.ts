export const NEWS_CATEGORIES = [
  'business',
  'politics',
  'technology',
  'science',
  'world',
  'entertainment',
  'health',
  'sports',
] as const

export type NewsCategory = (typeof NEWS_CATEGORIES)[number]

export const DEFAULT_CATEGORIES: NewsCategory[] = [...NEWS_CATEGORIES]
