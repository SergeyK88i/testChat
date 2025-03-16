"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, X, SlidersHorizontal } from "lucide-react"

type SourceSearchProps = {
  onSearch: (query: string) => void
  onScoreChange: (score: number) => void
  minScore: number
}

export default function SourceSearch({ onSearch, onScoreChange, minScore }: SourceSearchProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
    onSearch(e.target.value)
  }

  const handleScoreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseInt(e.target.value, 10)
    onScoreChange(value)
  }

  const resetFilters = () => {
    setSearchQuery("")
    onSearch("")
    onScoreChange(0)
  }

  return (
    <Card className="shadow-lg border-primary/10">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            <Search className="h-5 w-5 text-primary" />
            Поиск источников данных
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={() => setIsFilterOpen(!isFilterOpen)} className="h-8 gap-2">
            <SlidersHorizontal className="h-4 w-4" />
            {isFilterOpen ? "Скрыть фильтры" : "Показать фильтры"}
          </Button>
        </div>
        <CardDescription>Найдите источники данных по названию, владельцу или индексу зрелости</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Поиск по названию или владельцу..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="pl-9 h-10"
            />
          </div>
          {(searchQuery || minScore > 0) && (
            <Button variant="outline" size="sm" onClick={resetFilters} className="h-10 gap-2">
              <X className="h-4 w-4" />
              Сбросить
            </Button>
          )}
        </div>

        {isFilterOpen && (
          <div className="animate-in fade-in-50 slide-in-from-top-5 duration-300">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Минимальный индекс зрелости: {minScore}</span>
              </div>
              <div className="relative">
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={minScore}
                  onChange={handleScoreChange}
                  className="w-full h-2 bg-secondary rounded-full appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>0</span>
                  <span>25</span>
                  <span>50</span>
                  <span>75</span>
                  <span>100</span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4">
                <Button variant="outline" size="sm" className="h-8 text-xs" onClick={() => onScoreChange(90)}>
                  Отличные (90+)
                </Button>
                <Button variant="outline" size="sm" className="h-8 text-xs" onClick={() => onScoreChange(80)}>
                  Хорошие (80+)
                </Button>
                <Button variant="outline" size="sm" className="h-8 text-xs" onClick={() => onScoreChange(70)}>
                  Удовлетворительные (70+)
                </Button>
                <Button variant="outline" size="sm" className="h-8 text-xs" onClick={() => onScoreChange(0)}>
                  Все источники
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

