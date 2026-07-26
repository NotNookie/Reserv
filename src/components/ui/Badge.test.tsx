import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Badge } from './Badge'

describe('Badge', () => {
  it('renders its content', () => {
    render(<Badge tone="confirmed">Confirmed</Badge>)
    expect(screen.getByText('Confirmed')).toBeInTheDocument()
  })

  it('applies tone-specific classes', () => {
    render(<Badge tone="cancelled">Cancelled</Badge>)
    expect(screen.getByText('Cancelled').className).toContain(
      'text-status-cancelled',
    )
  })
})
