import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@solidjs/testing-library'
import CounterButton from '@components/Counter'

describe('CounterButton', () => {
  it('starts at 0 with singular "time"', () => {
    render(() => <CounterButton />)
    expect(screen.getByText(/Clicked 0 times/)).toBeInTheDocument()
  })

  it('increments to 1 on click, showing singular "time"', () => {
    render(() => <CounterButton />)
    const btn = screen.getByRole('button', { name: /increment/i })
    fireEvent.click(btn)
    expect(screen.getByText(/Clicked 1 time/)).toBeInTheDocument()
  })

  it('shows plural "times" after 2 clicks', () => {
    render(() => <CounterButton />)
    const btn = screen.getByRole('button', { name: /increment/i })
    fireEvent.click(btn)
    fireEvent.click(btn)
    expect(screen.getByText(/Clicked 2 times/)).toBeInTheDocument()
  })
})
