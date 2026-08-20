import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { FeedToggle } from '@/components/features/FeedToggle'

describe('FeedToggle', () => {
  it('renders both options', () => {
    render(<FeedToggle view="all" onChange={vi.fn()} />)
    expect(screen.getByText('All News')).toBeInTheDocument()
    expect(screen.getByText('My Feed')).toBeInTheDocument()
  })

  it('calls onChange when clicking an option', () => {
    const onChange = vi.fn()
    render(<FeedToggle view="all" onChange={onChange} />)

    fireEvent.click(screen.getByText('My Feed'))
    expect(onChange).toHaveBeenCalledWith('personalised')
  })
})
