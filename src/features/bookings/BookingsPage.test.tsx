import { describe, it, expect, beforeEach } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithProviders } from '@/test/utils'
import { resetDb } from '@/data/store'
import { BookingsPage } from './BookingsPage'

describe('BookingsPage', () => {
  beforeEach(() => resetDb())

  it('renders seeded bookings after loading', async () => {
    renderWithProviders(<BookingsPage />)

    // Loading state first.
    expect(screen.getByText(/loading bookings/i)).toBeInTheDocument()

    // Then the table with a seeded customer (appears in multiple rows).
    const matches = await screen.findAllByText('Eleanor Vance')
    expect(matches.length).toBeGreaterThan(0)
    expect(
      screen.getByRole('button', { name: /new booking/i }),
    ).toBeInTheDocument()
  })

  it('shows an empty state when a filter matches nothing', async () => {
    renderWithProviders(<BookingsPage />)
    // Wait for initial load.
    await screen.findAllByText('Eleanor Vance')

    const search = screen.getByPlaceholderText(/search customer/i)
    // Type a name that does not exist in the seed.
    const { default: userEvent } = await import('@testing-library/user-event')
    await userEvent.type(search, 'Zzzz Nobody')

    expect(await screen.findByText(/no bookings match/i)).toBeInTheDocument()
  })
})
