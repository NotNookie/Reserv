import { getDb } from '../store'
import type { Resource, ResourceStatus } from '../types'
import { clone, delay } from './util'

export const resourceService = {
  async list(): Promise<Resource[]> {
    await delay()
    return clone(getDb().resources)
  },

  async getById(id: string): Promise<Resource | null> {
    await delay()
    return clone(getDb().resources.find((r) => r.id === id) ?? null)
  },

  async updateStatus(id: string, status: ResourceStatus): Promise<Resource> {
    await delay()
    const resource = getDb().resources.find((r) => r.id === id)
    if (!resource) throw new Error(`Resource ${id} not found`)
    resource.status = status
    return clone(resource)
  },
}
