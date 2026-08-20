/**
 * User-selected preferences used to personalise the news feed.
 */
export interface UserPreferences {
  preferredSources: string[]
  preferredCategories: string[]
  preferredAuthors: string[]
}

/**
 * View modes available on the home page.
 */
export type FeedView = 'all' | 'personalised'
