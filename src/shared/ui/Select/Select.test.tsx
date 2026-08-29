import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import Select from './Select'

const options = [
  { value: 'planned', label: 'В планах' },
  { value: 'watched', label: 'Просмотрено' },
] as const

describe('Select', () => {
  it('shows the label and the selected option', () => {
    render(<Select label="Статус" options={options} value="planned" onChange={vi.fn()} />)

    const control = screen.getByRole('button', { name: 'Статус' })
    expect(control).toHaveTextContent('В планах')
    expect(control).toHaveAttribute('aria-expanded', 'false')
  })

  it('opens the list of available options', async () => {
    const user = userEvent.setup()
    render(<Select label="Статус" options={options} value="planned" onChange={vi.fn()} />)

    const control = screen.getByRole('button', { name: 'Статус' })
    await user.click(control)

    expect(control).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByRole('listbox', { name: 'Статус' })).toBeInTheDocument()
    expect(screen.getAllByRole('option')).toHaveLength(options.length)
    expect(screen.getByRole('option', { name: 'В планах' })).toHaveAttribute(
      'aria-selected',
      'true',
    )
  })

  it('reports the selected value and closes the list', async () => {
    const user = userEvent.setup()
    const handleChange = vi.fn()
    render(<Select label="Статус" options={options} value="planned" onChange={handleChange} />)

    await user.click(screen.getByRole('button', { name: 'Статус' }))
    await user.click(screen.getByRole('option', { name: 'Просмотрено' }))

    expect(handleChange).toHaveBeenCalledOnce()
    expect(handleChange).toHaveBeenCalledWith('watched')
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
  })

  it('supports opening and closing from the keyboard', async () => {
    const user = userEvent.setup()
    render(<Select label="Статус" options={options} value="planned" onChange={vi.fn()} />)

    const control = screen.getByRole('button', { name: 'Статус' })
    await user.tab()
    expect(control).toHaveFocus()

    await user.keyboard('{ArrowDown}')
    expect(screen.getByRole('listbox', { name: 'Статус' })).toBeInTheDocument()

    await user.keyboard('{Escape}')
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
  })

  it('closes when the user clicks outside', async () => {
    const user = userEvent.setup()
    render(
      <>
        <button type="button">Другой элемент</button>
        <Select label="Статус" options={options} value="planned" onChange={vi.fn()} />
      </>,
    )

    await user.click(screen.getByRole('button', { name: 'Статус' }))
    expect(screen.getByRole('listbox')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Другой элемент' }))
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
  })

  it('does not open when disabled', async () => {
    const user = userEvent.setup()
    render(
      <Select
        label="Статус"
        options={options}
        value="planned"
        onChange={vi.fn()}
        disabled
      />,
    )

    const control = screen.getByRole('button', { name: 'Статус' })
    expect(control).toBeDisabled()

    await user.click(control)
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
  })
})
