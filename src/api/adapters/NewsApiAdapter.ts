import { fetchNewsApiArticles } from '@/api/clients/newsApiClient'
import type { IArticleAdapter } from '@/api/adapters/IArticleAdapter'
import type { AdapterResult, Article, ArticleFilter, PaginationOptions } from '@/types'

export class NewsApiAdapter implements IArticleAdapter {
  readonly sourceId = 'newsapi'
  readonly sourceName = 'NewsAPI'

  async fetch(
    filter: ArticleFilter,
    pagination: PaginationOptions
  ): Promise<AdapterResult> {
    const response = await fetchNewsApiArticles(filter, pagination)

    const articles: Article[] = response.articles.map((item, index) => ({
      id: `newsapi-${item.url || index}`,
      title: item.title,
      description: item.description,
      url: item.url,
      imageUrl: item.urlToImage,
      source: this.sourceName,
      sourceId: this.sourceId,
      author: item.author,
      category: null,
      publishedAt: new Date(item.publishedAt),
    }))

    return {
      articles,
      totalResults: response.totalResults,
      currentPage: pagination.page,
      hasMore: pagination.page * pagination.pageSize < response.totalResults,
    }
  }
}
