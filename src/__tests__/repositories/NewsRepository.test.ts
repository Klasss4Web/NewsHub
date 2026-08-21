import { describe, it, expect, vi } from 'vitest'
import { NewsRepository } from '@/api/repositories/NewsRepository'
import type { IArticleAdapter } from '@/api/adapters'
import type {
  AdapterResult,
  Article,
  ArticleFilter,
  PaginationOptions,
} from '@/types'

const createMockAdapter = (
  id: string,
  name: string,
  articles: Article[],
  hasMore: boolean
): IArticleAdapter => ({
  sourceId: id,
  sourceName: name,
  fetch: vi.fn().mockResolvedValue({
    articles,
    totalResults: articles.length,
    currentPage: 1,
    hasMore,
  } as AdapterResult),
})

const mockArticle = (overrides: Partial<Article> = {}): Article => ({
  id: 'test-1',
  title: 'Test Article',
  description: 'Description',
  url: 'https://example.com/test',
  imageUrl: null,
  source: 'Test Source',
  sourceId: 'test-source',
  author: 'Author',
  category: 'technology',
  publishedAt: new Date('2024-01-15T10:00:00Z'),
  ...overrides,
})

describe('NewsRepository', () => {
  const filter: ArticleFilter = {
    keyword: '',
    fromDate: null,
    toDate: null,
    category: null,
    sources: [],
  }
  const pagination: PaginationOptions = { page: 1, pageSize: 10 }

  it('aggregates articles from multiple adapters', async () => {
    const adapterA = createMockAdapter(
      'a',
      'Source A',
      [mockArticle({ id: 'a-1', url: 'https://example.com/a' })],
      false
    )
    const adapterB = createMockAdapter(
      'b',
      'Source B',
      [mockArticle({ id: 'b-1', url: 'https://example.com/b' })],
      false
    )
    const repository = new NewsRepository([adapterA, adapterB])

    const result = await repository.fetchArticles(filter, pagination)

    expect(result.articles).toHaveLength(2)
    expect(result.errors).toHaveLength(0)
  })

  it('deduplicates articles by URL', async () => {
    const adapterA = createMockAdapter(
      'a',
      'Source A',
      [mockArticle({ id: 'a-1', url: 'https://dup.com' })],
      false
    )
    const adapterB = createMockAdapter(
      'b',
      'Source B',
      [mockArticle({ id: 'b-1', url: 'https://dup.com' })],
      false
    )
    const repository = new NewsRepository([adapterA, adapterB])

    const result = await repository.fetchArticles(filter, pagination)

    expect(result.articles).toHaveLength(1)
  })

  it('reports errors without failing the whole request', async () => {
    const failingAdapter: IArticleAdapter = {
      sourceId: 'fail',
      sourceName: 'Failing Source',
      fetch: vi.fn().mockRejectedValue(new Error('Network error')),
    }
    const goodAdapter = createMockAdapter(
      'good',
      'Good Source',
      [mockArticle({ id: 'g-1' })],
      false
    )
    const repository = new NewsRepository([failingAdapter, goodAdapter])

    const result = await repository.fetchArticles(filter, pagination)

    expect(result.articles).toHaveLength(1)
    expect(result.errors).toContain('Failing Source: Network error')
  })
})
