import { describe, it, expect, beforeEach } from 'vitest'
import { resetDb } from '../store'
import { invoiceService } from './invoiceService'

describe('invoiceService', () => {
  beforeEach(() => resetDb())

  it('generates invoices from billable bookings', async () => {
    const all = await invoiceService.list()
    expect(all.length).toBeGreaterThan(0)
    // Cancelled bookings are never invoiced.
    expect(all.every((i) => i.booking.status !== 'cancelled')).toBe(true)
  })

  it('marks an unpaid invoice as paid with a method and timestamp', async () => {
    const [unpaid] = await invoiceService.list({ status: 'unpaid' })
    expect(unpaid).toBeDefined()

    const paid = await invoiceService.markPaid(unpaid!.id, 'card')
    expect(paid.status).toBe('paid')
    expect(paid.method).toBe('card')
    expect(paid.paidAt).toBeTruthy()
  })

  it('refunds a paid invoice but rejects refunding an unpaid one', async () => {
    const [paid] = await invoiceService.list({ status: 'paid' })
    expect(paid).toBeDefined()
    const refunded = await invoiceService.refund(paid!.id)
    expect(refunded.status).toBe('refunded')

    const [unpaid] = await invoiceService.list({ status: 'unpaid' })
    await expect(invoiceService.refund(unpaid!.id)).rejects.toThrow()
  })
})
