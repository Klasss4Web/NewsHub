import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { ArticleCard } from '@/components/features/ArticleCard'
import type { Article } from '@/types'

const mockArticle: Article = {
  id: 'test-1',
  title: 'Test Article Title',
  description: 'Test description content',
  url: 'https://example.com/article',
  imageUrl: null,
  source: 'Test Source',
  sourceId: 'test-source',
  author: 'Jane Doe',
  category: 'technology',
  publishedAt: new Date('2024-01-15T10:00:00Z'),
}

describe('ArticleCard', () => {
  it('renders article title and source', () => {
    render(
      <MemoryRouter>
        <ArticleCard article={mockArticle} />
      </MemoryRouter>
    )

    expect(screen.getByText('Test Article Title')).toBeInTheDocument()
    expect(screen.getByText('Test Source')).toBeInTheDocument()
    expect(screen.getByText('technology')).toBeInTheDocument()
  })

  it('links to the internal article detail page', () => {
    render(
      <MemoryRouter>
        <ArticleCard article={mockArticle} />
      </MemoryRouter>
    )

    const link = screen.getByLabelText('Read article: Test Article Title')
    expect(link).toHaveAttribute('href', '/article/test-1')
  })
})
