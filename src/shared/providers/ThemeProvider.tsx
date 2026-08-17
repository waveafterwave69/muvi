'use client'

import { createContext, type ReactNode, useContext, useEffect, useSyncExternalStore } from 'react'

type Theme = 'light' | 'dark'

interface ThemeContextValue {
  theme: Theme
  setTheme: (theme: Theme) => void
}

export const ThemeContext = createContext<ThemeContextValue | null>(null)

const THEME_STORAGE_KEY = 'muvi-theme'
const THEME_CHANGE_EVENT = 'muvi-theme-change'

const getPreferredTheme = (): Theme => {
  const saved = localStorage.getItem(THEME_STORAGE_KEY)
  if (saved === 'light' || saved === 'dark') return saved

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

const getServerTheme = (): Theme => 'light'

const subscribeToTheme = (callback: () => void) => {
  const colorScheme = window.matchMedia('(prefers-color-scheme: dark)')

  window.addEventListener('storage', callback)
  window.addEventListener(THEME_CHANGE_EVENT, callback)
  colorScheme.addEventListener('change', callback)

  return () => {
    window.removeEventListener('storage', callback)
    window.removeEventListener(THEME_CHANGE_EVENT, callback)
    colorScheme.removeEventListener('change', callback)
  }
}

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const theme = useSyncExternalStore(subscribeToTheme, getPreferredTheme, getServerTheme)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  const setTheme = (newTheme: Theme) => {
    document.documentElement.setAttribute('data-theme', newTheme)
    localStorage.setItem(THEME_STORAGE_KEY, newTheme)
    window.dispatchEvent(new Event(THEME_CHANGE_EVENT))
  }

  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>
}

export const useTheme = () => {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}
