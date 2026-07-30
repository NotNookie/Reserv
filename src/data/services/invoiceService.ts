import { getDb } from '../store'
import type {
  Invoice,
  InvoiceStatus,
  InvoiceWithRelations,
  PaymentMethod,
} from '../types'
import { clone, delay } from './util'

export interface InvoiceFilters {
  status?: InvoiceStatus
  customerId?: string
  /** Case-insensitive search across invoice number and customer name. */
  search?: string
}

function resolve(invoice: Invoice): InvoiceWithRelations {
  const db = getDb()
  const customer = db.customers.find((c) => c.id === invoice.customerId)
  const booking = db.bookings.find((b) => b.id === invoice.bookingId)
  if (!customer || !booking) {
    throw new Error(`Invoice ${invoice.id} references missing entities`)
  }
  const service = db.services.find((s) => s.id === booking.serviceId)
  if (!service) {
    throw new Error(`Invoice ${invoice.id} references a missing service`)
  }
  return clone({ ...invoice, customer, booking, service })
}

export const invoiceService = {
  async list(filters: InvoiceFilters = {}): Promise<InvoiceWithRelations[]> {
    await delay()
    const db = getDb()
    let rows = [...db.invoices]

    if (filters.status) rows = rows.filter((i) => i.status === filters.status)
    if (filters.customerId) {
      rows = rows.filter((i) => i.customerId === filters.customerId)
    }
    if (filters.search) {
      const q = filters.search.toLowerCase()
      rows = rows.filter((i) => {
        const customer = db.customers.find((c) => c.id === i.customerId)
        return (
          i.number.toLowerCase().includes(q) ||
          (customer?.name.toLowerCase().includes(q) ?? false)
        )
      })
    }

    rows.sort((a, b) => b.issuedAt.localeCompare(a.issuedAt))
    return rows.map(resolve)
  },

  async getById(id: string): Promise<InvoiceWithRelations | null> {
    await delay()
    const invoice = getDb().invoices.find((i) => i.id === id)
    return invoice ? resolve(invoice) : null
  },

  async markPaid(
    id: string,
    method: PaymentMethod,
  ): Promise<InvoiceWithRelations> {
    await delay()
    const invoice = getDb().invoices.find((i) => i.id === id)
    if (!invoice) throw new Error(`Invoice ${id} not found`)
    invoice.status = 'paid'
    invoice.method = method
    invoice.paidAt = new Date().toISOString()
    return resolve(invoice)
  },

  async refund(id: string): Promise<InvoiceWithRelations> {
    await delay()
    const invoice = getDb().invoices.find((i) => i.id === id)
    if (!invoice) throw new Error(`Invoice ${id} not found`)
    if (invoice.status !== 'paid') {
      throw new Error('Only paid invoices can be refunded.')
    }
    invoice.status = 'refunded'
    return resolve(invoice)
  },
}
