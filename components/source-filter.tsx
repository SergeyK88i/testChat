"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Search, Filter, X } from "lucide-react"

type SourceFilterProps = {
  onFilterChange: (filters: {
    search: string
    minScore: number
  }) => void
}

export default function SourceFilter({ onFilterChange }: SourceFilterProps) {
  const [search, setSearch] = useState("")
  const [minScore, setMinScore] = useState(0)
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
    onFilterChange({ search: e.target.value, minScore })
  }

  const handleScoreChange = (value: number[]) => {
    setMinScore(value[0])
    onFilterChange({ search, minScore: value[0] })
  }

  const resetFilters = () => {
    setSearch("")
    setMinScore(0)
    onFilterChange({ search: "", minScore: 0 })
  }

  return (
    <Card className="shadow-lg border-primary/10">
      <CardHeader className="bg-muted/50 pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5 text-primary" />
            Поиск и фильтрация
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={() => setIsFilterOpen(!isFilterOpen)} className="rounded-full">
            {isFilterOpen ? <X className="h-5 w-5" /> : <Filter className="h-5 w-5" />}
          </Button>
        </div>
        <CardDescription>Найдите и отфильтруйте источники по различным параметрам</CardDescription>
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Поиск источников..."
              value={search}
              onChange={handleSearchChange}
              className="pl-9 h-10"
            />
          </div>
          {search || minScore > 0 ? (
            <Button variant="ghost" size="sm" onClick={resetFilters} className="h-10">
              <X className="h-4 w-4 mr-2" />
              Сбросить
            </Button>
          ) : null}
        </div>

        {isFilterOpen && (
          <div className="mt-4 space-y-4 animate-in fade-in-50 slide-in-from-top-5 duration-300">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Минимальный индекс зрелости: {minScore}</span>
              </div>
              <Slider defaultValue={[minScore]} max={100} step={5} onValueChange={handleScoreChange} />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

