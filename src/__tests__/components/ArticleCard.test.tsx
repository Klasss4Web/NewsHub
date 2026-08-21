import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { ArticleCard } from '@/components/features/ArticleCard'
import { PreferencesProvider } from '@/stores/preferenceStore'
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

const renderWithProviders = (article: Article) =>
  render(
    <MemoryRouter>
      <PreferencesProvider>
        <ArticleCard article={article} />
      </PreferencesProvider>
    </MemoryRouter>
  )

describe('ArticleCard', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('renders article title and source', () => {
    renderWithProviders(mockArticle)

    expect(screen.getByText('Test Article Title')).toBeInTheDocument()
    expect(screen.getByText('Test Source')).toBeInTheDocument()
    expect(screen.getByText('technology')).toBeInTheDocument()
  })

  it('links to the internal article detail page', () => {
    renderWithProviders(mockArticle)

    const link = screen.getByLabelText('Read article: Test Article Title')
    expect(link).toHaveAttribute('href', '/article/test-1')
  })

  it('renders an author preference toggle when an author is present', () => {
    renderWithProviders(mockArticle)

    const toggle = screen.getByRole('button', {
      name: `Add ${mockArticle.author} to preferred authors`,
    })
    expect(toggle).toBeInTheDocument()
    expect(toggle).toHaveAttribute('aria-pressed', 'false')
  })

  it('does not render an author preference toggle when no author is present', () => {
    renderWithProviders({ ...mockArticle, author: null })

    expect(
      screen.queryByRole('button', { name: /preferred authors/i })
    ).not.toBeInTheDocument()
  })

  it('toggles the author preference when clicked', async () => {
    renderWithProviders(mockArticle)

    const toggle = screen.getByRole('button', {
      name: `Add ${mockArticle.author} to preferred authors`,
    })

    await userEvent.click(toggle)

    expect(
      screen.getByRole('button', {
        name: `Remove ${mockArticle.author} from preferred authors`,
      })
    ).toHaveAttribute('aria-pressed', 'true')

    await userEvent.click(toggle)

    expect(
      screen.getByRole('button', {
        name: `Add ${mockArticle.author} to preferred authors`,
      })
    ).toHaveAttribute('aria-pressed', 'false')
  })
})
