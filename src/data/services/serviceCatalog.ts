import { getDb } from '../store'
import type { Service } from '../types'
import { clone, delay } from './util'

export const serviceCatalog = {
  async list(): Promise<Service[]> {
    await delay()
    return clone(getDb().services)
  },

  async getById(id: string): Promise<Service | null> {
    await delay()
    return clone(getDb().services.find((s) => s.id === id) ?? null)
  },
}
