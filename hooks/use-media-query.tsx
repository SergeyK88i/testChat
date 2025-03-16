"use client"

import { useEffect, useState } from "react"

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const media = window.matchMedia(query)

    // Установка начального значения
    if (media.matches !== matches) {
      setMatches(media.matches)
    }

    // Обработчик изменений
    const listener = () => {
      setMatches(media.matches)
    }

    // Добавление слушателя
    media.addEventListener("change", listener)

    // Очистка
    return () => {
      media.removeEventListener("change", listener)
    }
  }, [matches, query])

  return matches
}

