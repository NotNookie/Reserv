import { describe, it, expect, vi } from 'vitest'
import type { KeyboardEvent } from 'react'
import { rowActivation } from './interactions'

function keyEvent(key: string) {
  return { key, preventDefault: vi.fn() } as unknown as KeyboardEvent
}

describe('rowActivation', () => {
  it('activates on click', () => {
    const fn = vi.fn()
    rowActivation(fn).onClick()
    expect(fn).toHaveBeenCalledOnce()
  })

  it('activates on Enter and Space, preventing default', () => {
    const fn = vi.fn()
    const props = rowActivation(fn)

    const enter = keyEvent('Enter')
    props.onKeyDown(enter)
    expect(enter.preventDefault).toHaveBeenCalled()

    props.onKeyDown(keyEvent(' '))
    expect(fn).toHaveBeenCalledTimes(2)
  })

  it('ignores other keys', () => {
    const fn = vi.fn()
    rowActivation(fn).onKeyDown(keyEvent('a'))
    expect(fn).not.toHaveBeenCalled()
  })

  it('exposes button semantics for keyboard users', () => {
    const props = rowActivation(vi.fn())
    expect(props.role).toBe('button')
    expect(props.tabIndex).toBe(0)
  })
})
