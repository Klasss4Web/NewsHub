import { fetchGuardianArticles } from '@/api/clients/guardianClient'
import type { IArticleAdapter } from '@/api/adapters/IArticleAdapter'
import { stripHtml } from '@/utils'
import type {
  AdapterResult,
  Article,
  ArticleFilter,
  PaginationOptions,
} from '@/types'

export class GuardianAdapter implements IArticleAdapter {
  readonly sourceId = 'guardian'
  readonly sourceName = 'The Guardian'

  async fetch(
    filter: ArticleFilter,
    pagination: PaginationOptions
  ): Promise<AdapterResult> {
    const response = await fetchGuardianArticles(filter, pagination)
    const { response: data } = response

    const articles: Article[] = data.results.map((item) => ({
      id: `guardian-${item.id}`,
      title: item.webTitle,
      description: stripHtml(item.fields?.trailText),
      url: item.webUrl,
      imageUrl: item.fields?.thumbnail || null,
      source: this.sourceName,
      sourceId: this.sourceId,
      author: item.fields?.byline || null,
      category: item.sectionId.toLowerCase(),
      publishedAt: new Date(item.webPublicationDate),
    }))

    return {
      articles,
      totalResults: data.total,
      currentPage: data.currentPage,
      hasMore: data.currentPage < data.pages,
    }
  }
}
