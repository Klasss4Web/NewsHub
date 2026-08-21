import { fetchNyTimesArticles } from '@/api/clients/nyTimesClient'
import type { IArticleAdapter } from '@/api/adapters/IArticleAdapter'
import type {
  AdapterResult,
  Article,
  ArticleFilter,
  PaginationOptions,
} from '@/types'
import type {
  NyTimesMultimediaItem,
  NyTimesMultimediaObject,
} from '@/api/clients/nyTimesClient'

const NY_TIMES_IMAGE_BASE = 'https://www.nytimes.com/'

const isMultimediaArray = (
  multimedia: NyTimesMultimediaItem[] | NyTimesMultimediaObject
): multimedia is NyTimesMultimediaItem[] => Array.isArray(multimedia)

const extractImageUrl = (
  multimedia: NyTimesMultimediaItem[] | NyTimesMultimediaObject
): string | null => {
  if (isMultimediaArray(multimedia)) {
    const item = multimedia.find((m) => m.subtype === 'thumbnail')
    return item ? `${NY_TIMES_IMAGE_BASE}${item.url}` : null
  }

  if (multimedia.default?.url) {
    return `${NY_TIMES_IMAGE_BASE}${multimedia.default.url}`
  }

  if (multimedia.thumbnail?.url) {
    return `${NY_TIMES_IMAGE_BASE}${multimedia.thumbnail.url}`
  }

  return null
}

export class NyTimesAdapter implements IArticleAdapter {
  readonly sourceId = 'nytimes'
  readonly sourceName = 'The New York Times'

  async fetch(
    filter: ArticleFilter,
    pagination: PaginationOptions
  ): Promise<AdapterResult> {
    const response = await fetchNyTimesArticles(filter, pagination)
    const { response: data } = response

    const articles: Article[] = data.docs.map((item) => ({
      id: `nytimes-${item._id}`,
      title: item.headline.main,
      description: item.abstract || item.snippet || null,
      url: item.web_url,
      imageUrl: extractImageUrl(item.multimedia),
      source: this.sourceName,
      sourceId: this.sourceId,
      author: item.byline?.original?.replace('By ', '') || null,
      category:
        item.news_desk?.toLowerCase() ||
        item.section_name?.toLowerCase() ||
        null,
      publishedAt: new Date(item.pub_date),
    }))

    const totalHits = data.metadata?.hits ?? 0
    const totalPages = Math.ceil(totalHits / pagination.pageSize)
    const currentPage = pagination.page

    return {
      articles,
      totalResults: totalHits,
      currentPage,
      hasMore: currentPage < totalPages,
    }
  }
}
