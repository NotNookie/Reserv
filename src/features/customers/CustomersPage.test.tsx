import { describe, it, expect, beforeEach } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from '@/test/utils'
import { resetDb } from '@/data/store'
import { CustomersPage } from './CustomersPage'

describe('CustomersPage', () => {
  beforeEach(() => resetDb())

  it('lists seeded customers and filters by search', async () => {
    renderWithProviders(<CustomersPage />)

    expect(await screen.findByText('Eleanor Vance')).toBeInTheDocument()

    const search = screen.getByPlaceholderText(/search name/i)
    await userEvent.type(search, 'Eleanor')

    expect(screen.getByText('Eleanor Vance')).toBeInTheDocument()
    expect(screen.queryByText('John Doe')).not.toBeInTheDocument()
  })

  it('shows an empty state when nothing matches', async () => {
    renderWithProviders(<CustomersPage />)
    await screen.findByText('Eleanor Vance')

    await userEvent.type(
      screen.getByPlaceholderText(/search name/i),
      'Zzz Nobody',
    )
    expect(await screen.findByText(/no customers match/i)).toBeInTheDocument()
  })
})
