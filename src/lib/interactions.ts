import type { KeyboardEvent } from 'react'

export interface RowActivationProps {
  role: 'button'
  tabIndex: 0
  onClick: () => void
  onKeyDown: (event: KeyboardEvent) => void
}

/**
 * Props that make a non-button element (e.g. a table row) behave like a button:
 * clickable by mouse and activatable by Enter/Space, and reachable by keyboard.
 */
export function rowActivation(onActivate: () => void): RowActivationProps {
  return {
    role: 'button',
    tabIndex: 0,
    onClick: onActivate,
    onKeyDown: (event: KeyboardEvent) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault()
        onActivate()
      }
    },
  }
}
