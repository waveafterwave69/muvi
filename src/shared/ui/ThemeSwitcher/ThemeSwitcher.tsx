import { useTheme } from '@/shared/providers/ThemeProvider'
import { Moon, Sun } from 'lucide-react'
import styles from './ThemeSwitcher.module.scss'

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
    <button
      onClick={handleClick}
      aria-label={theme === 'light' ? 'Включить тёмную тему' : 'Включить светлую тему'}
      className={styles.button}
    >
      {theme === 'light' ? <Sun aria-hidden /> : <Moon aria-hidden />}
    </button>
  )
}
