import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { FormField } from './FormField'
import { Input } from './Input'

describe('FormField', () => {
  it('associates the label with the control', () => {
    render(
      <FormField label="Email">
        <Input />
      </FormField>,
    )
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
  })

  it('links an error message via aria-describedby', () => {
    render(
      <FormField label="Email" error="Required">
        <Input />
      </FormField>,
    )
    const input = screen.getByLabelText('Email')
    const describedBy = input.getAttribute('aria-describedby')
    expect(describedBy).toBeTruthy()
    expect(screen.getByText('Required')).toHaveAttribute('id', describedBy!)
    expect(input).toHaveAttribute('aria-invalid', 'true')
  })
})
