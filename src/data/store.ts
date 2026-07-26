import { createSeedData, type SeedData } from './mock/seed'

/**
 * In-memory data store standing in for a backend database. The service layer is
 * the only thing that touches this module; UI/components never import it
 * directly. Swapping to a real API means replacing the services, not this file.
 */
let db: SeedData = createSeedData()

export function getDb(): SeedData {
  return db
}

/** Reset the store to a fresh seed. Primarily for tests. */
export function resetDb(): void {
  db = createSeedData()
}

let idCounter = 1000
export function nextId(prefix: string): string {
  return `${prefix}${++idCounter}`
}
