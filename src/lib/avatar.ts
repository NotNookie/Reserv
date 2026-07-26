/**
 * Deterministic avatar background/text colour pair derived from a string
 * (name or id), so a given person always gets the same colour.
 */
const PALETTE = [
  'bg-accent-blue-surface text-accent-blue',
  'bg-accent-purple-surface text-accent-purple',
  'bg-status-confirmed-surface text-status-confirmed',
  'bg-status-pending-surface text-status-pending',
  'bg-status-info-surface text-status-info',
] as const

export function getAvatarColor(seed: string): string {
  let hash = 0
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i)
    hash |= 0
  }
  const index = Math.abs(hash) % PALETTE.length
  return PALETTE[index]!
}
