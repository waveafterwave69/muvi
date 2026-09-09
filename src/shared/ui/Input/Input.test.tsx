import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Input } from './Input'

describe('Input', () => {
  it('uses type="text" by default', () => {
    render(<Input />);

    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('type', 'text');

  });
  it('renders the provided placeholder', () => {
    render(<Input placeholder={'Введите имя'}/>);

    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('placeholder', 'Введите имя');
  });
  it('associates the label with the input', () => {
    render(<Input label='Имя'/>);

    const input = screen.getByLabelText('Имя');
    expect(input).toBeInTheDocument();
  });
  it('shows an accessible error', () => {
    render(<Input error={'Введите имя'}/>);

    const input = screen.getByRole('textbox')
    const error = screen.getByRole('alert')

    expect(error).toBeInTheDocument()
    expect(error).toHaveTextContent('Введите имя')
    expect(input).toHaveAttribute('aria-invalid', 'true')
    expect(input).toHaveAccessibleDescription('Введите имя')
  })
  it('disables the input', () => {
    render(<Input disabled/>);

    const input = screen.getByRole('textbox');
    expect(input).toBeDisabled()
  })
})