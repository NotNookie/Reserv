import { getDb } from '../store'
import type { Staff } from '../types'
import { clone, delay } from './util'

export const staffService = {
  async list(): Promise<Staff[]> {
    await delay()
    return clone(
      [...getDb().staff].sort((a, b) => a.name.localeCompare(b.name)),
    )
  },

  async getById(id: string): Promise<Staff | null> {
    await delay()
    return clone(getDb().staff.find((s) => s.id === id) ?? null)
  },
}
