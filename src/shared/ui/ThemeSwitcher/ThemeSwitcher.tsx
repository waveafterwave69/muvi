import { Button } from '@/shared/ui'
import { useTheme } from '@/shared/providers/ThemeProvider'
import { Moon, Sun } from 'lucide-react'

const nextTheme = {
  dark: 'light',
  light: 'dark',
} as const

export const ThemeSwitcher = () => {
  const { theme, setTheme } = useTheme()

  const handleClick = () => {
    setTheme(nextTheme[theme])
  }

  return (
    <Button
      onClick={handleClick}
      aria-label={theme === 'light' ? 'Включить тёмную тему' : 'Включить светлую тему'}
    >
      {theme === 'light' ? <Sun aria-hidden /> : <Moon aria-hidden />}
    </Button>
  )
}
