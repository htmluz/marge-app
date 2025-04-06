import { ref, watchEffect, onMounted, readonly } from 'vue'

type Theme = 'light' | 'dark'

const currentTheme = ref<Theme>('light')

let isInitialized = false

export function useTheme() {
  function setTheme(theme: Theme) {
    if (theme !== 'light' && theme !== 'dark') {
      theme = 'light'
    }
    currentTheme.value = theme
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('marge_theme', theme)
    }
  }

  function toggleTheme() {
    setTheme(currentTheme.value === 'light' ? 'dark' : 'light')
  }

  function initializeTheme() {
    if (isInitialized || typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return
    }

    const savedTheme = localStorage.getItem('marge_theme') as Theme | null
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches

    if (savedTheme) {
      setTheme(savedTheme)
    } else if (prefersDark) {
      setTheme('dark')
    } else {
      setTheme('light')
    }
    isInitialized = true
  }

  watchEffect(() => {
    if (typeof document !== 'undefined') {
      const htmlElement = document.documentElement
      htmlElement.classList.remove('light', 'dark')
      htmlElement.classList.add(currentTheme.value)
      htmlElement.style.colorScheme = currentTheme.value
    }
  })

  onMounted(() => {
    initializeTheme()
  })

  return {
    currentTheme: readonly(currentTheme),
    toggleTheme,
    setTheme,
  }
}
