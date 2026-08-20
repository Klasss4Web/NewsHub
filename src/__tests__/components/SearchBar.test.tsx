import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { SearchBar } from '@/components/features/SearchBar'

describe('SearchBar', () => {
  it('renders input and calls onChange when user types', () => {
    const onChange = vi.fn()
    render(<SearchBar value="" onChange={onChange} />)

    const input = screen.getByLabelText('Search articles')
    fireEvent.change(input, { target: { value: 'react' } })

    expect(onChange).toHaveBeenCalledWith('react')
  })

  it('displays the current value', () => {
    render(<SearchBar value="typescript" onChange={vi.fn()} />)
    expect(screen.getByDisplayValue('typescript')).toBeInTheDocument()
  })
})
