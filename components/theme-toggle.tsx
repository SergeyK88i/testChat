"use client"

import { Moon, Sun } from "lucide-react"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  const [isDarkMode, setIsDarkMode] = useState(false)

  // Проверяем предпочтения пользователя при загрузке
  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark")
    setIsDarkMode(isDark)
  }, [])

  const toggleTheme = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove("dark")
      setIsDarkMode(false)
    } else {
      document.documentElement.classList.add("dark")
      setIsDarkMode(true)
    }
  }

  return (
    <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-full">
      {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
      <span className="sr-only">Переключить тему</span>
    </Button>
  )
}

