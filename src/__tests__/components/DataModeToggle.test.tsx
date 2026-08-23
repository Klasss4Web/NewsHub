import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { DataModeToggle } from '@/components/features/DataModeToggle'

const mockUseMockData = vi.fn()

vi.mock('@/hooks', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/hooks')>()
  return {
    ...actual,
    useMockData: () => mockUseMockData(),
  }
})

describe('DataModeToggle', () => {
  beforeEach(() => {
    window.localStorage.clear()
    mockUseMockData.mockReturnValue([false, vi.fn()])
  })

  it('renders the live API info banner', () => {
    render(<DataModeToggle />)
    expect(
      screen.getByText(
        'Fetching from configured news APIs. Requires valid API keys.'
      )
    ).toBeInTheDocument()
  })

  it('hides the entire banner when dismiss is clicked', () => {
    render(<DataModeToggle />)
    fireEvent.click(screen.getByText('Dismiss'))
    expect(
      screen.queryByText(
        'Fetching from configured news APIs. Requires valid API keys.'
      )
    ).not.toBeInTheDocument()
    expect(screen.queryByText('Using Live APIs')).not.toBeInTheDocument()
  })

  it('renders the mock data info banner', () => {
    mockUseMockData.mockReturnValue([true, vi.fn()])
    render(<DataModeToggle />)
    expect(
      screen.getByText(
        'Showing sample articles. Toggle off to fetch from real news APIs.'
      )
    ).toBeInTheDocument()
  })
})
