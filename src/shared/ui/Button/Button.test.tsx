import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Button } from './Button'

describe('Button', () => {
  it('renders a button with the provided accessible name', () => {
    render(<Button>Сохранить</Button>)

    expect(screen.getByRole('button', { name: 'Сохранить' })).toBeInTheDocument()
  })

  it('calls the click handler when the user clicks it', async () => {
    const user = userEvent.setup()
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Сохранить</Button>)

    await user.click(screen.getByRole('button', { name: 'Сохранить' }))

    expect(handleClick).toHaveBeenCalledOnce()
  })

  it('does not call the click handler when disabled', async () => {
    const user = userEvent.setup()
    const handleClick = vi.fn()
    render(
      <Button disabled onClick={handleClick}>
        Сохранить
      </Button>,
    )

    const button = screen.getByRole('button', { name: 'Сохранить' })
    expect(button).toBeDisabled()

    await user.click(button)

    expect(handleClick).not.toHaveBeenCalled()
  })

  it('uses type="button" by default and forwards native button attributes', () => {
    render(
      <Button aria-label="Закрыть окно" title="Закрыть">
        ×
      </Button>,
    )

    const button = screen.getByRole('button', { name: 'Закрыть окно' })
    expect(button).toHaveAttribute('type', 'button')
    expect(button).toHaveAttribute('title', 'Закрыть')
  })
})
