import { getDb } from '../store'
import type { Customer } from '../types'
import { clone, delay } from './util'

export const customerService = {
  async list(): Promise<Customer[]> {
    await delay()
    return clone(
      [...getDb().customers].sort((a, b) => a.name.localeCompare(b.name)),
    )
  },

  async getById(id: string): Promise<Customer | null> {
    await delay()
    return clone(getDb().customers.find((c) => c.id === id) ?? null)
  },
}
