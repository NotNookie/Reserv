/** Simulated network latency (ms) so the UI exercises real loading states. */
const LATENCY_MS = 180

export function delay(ms: number = LATENCY_MS): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/** Deep clone so callers can never mutate the store by reference. */
export function clone<T>(value: T): T {
  return structuredClone(value)
}

/** Two half-open intervals [aStart,aEnd) and [bStart,bEnd) overlap. */
export function intervalsOverlap(
  aStart: string,
  aEnd: string,
  bStart: string,
  bEnd: string,
): boolean {
  return aStart < bEnd && bStart < aEnd
}
