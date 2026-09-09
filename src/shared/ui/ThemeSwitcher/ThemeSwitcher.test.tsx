import { ThemeContext } from '@/shared/providers/ThemeProvider'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { ThemeSwitcher } from './ThemeSwitcher'
import { render, screen } from '@testing-library/react'

const renderThemeSwitcher = (theme: 'light' | 'dark') => {
  const setTheme = vi.fn()

  render(
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <ThemeSwitcher />
    </ThemeContext.Provider>,
  )

  return { setTheme }
}

describe('ThemeSwithcer', () => {
  it('смена светлой темы на тёмную', async () => {
    const user = userEvent.setup()
    const { setTheme } = renderThemeSwitcher('light')

    const swtithThemeButtonEl = screen.getByRole('button', {
      name: 'Включить тёмную тему',
    })

    await user.click(swtithThemeButtonEl)

    expect(setTheme).toHaveBeenCalledOnce()
    expect(setTheme).toHaveBeenCalledWith('dark')
  })

  it('смена темной темы на светлую', async () => {
    const user = userEvent.setup()
    const { setTheme } = renderThemeSwitcher('dark')

    const swtithThemeButtonEl = screen.getByRole('button', {
      name: 'Включить светлую тему',
    })

    await user.click(swtithThemeButtonEl)

    expect(setTheme).toHaveBeenCalledOnce()
    expect(setTheme).toHaveBeenCalledWith('light')
  })

  it('предлагает включить тёмную тему, когда сейчас светлая', () => {
    renderThemeSwitcher('light')

    const swtithThemeButtonEl = screen.getByRole('button', {
      name: 'Включить тёмную тему',
    })

    expect(swtithThemeButtonEl).toBeInTheDocument()
  })

  it('предлагает включить светлую тему, когда сейчас тёмная', () => {
    renderThemeSwitcher('dark')

    const swtithThemeButtonEl = screen.getByRole('button', {
      name: 'Включить светлую тему',
    })

    expect(swtithThemeButtonEl).toBeInTheDocument()
  })
})
