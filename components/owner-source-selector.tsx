"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useMediaQuery } from "@/hooks/use-media-query"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, ChevronLeft, ChevronRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

type SourceSelectorProps = {
  sources: {
    id: string
    name: string
    score: number
  }[]
  selectedSourceId: string | null
  onSourceSelect: (id: string) => void
}

export default function OwnerSourceSelector({ sources, selectedSourceId, onSourceSelect }: SourceSelectorProps) {
  const isMobile = useMediaQuery("(max-width: 768px)")
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(0)
  const [showSearch, setShowSearch] = useState(false)

  // Если у владельца только один источник, не показываем селектор
  if (sources.length <= 1) {
    return null
  }

  // Получаем цвет для индикатора на основе оценки
  const getScoreColorClass = (score: number) => {
    if (score >= 90) return "bg-emerald-500"
    if (score >= 80) return "bg-green-500"
    if (score >= 70) return "bg-yellow-500"
    if (score >= 60) return "bg-orange-500"
    return "bg-red-500"
  }

  // Фильтруем источники по поисковому запросу
  const filteredSources = sources.filter((source) => source.name.toLowerCase().includes(searchQuery.toLowerCase()))

  // Для табов используем пагинацию, если источников много
  const ITEMS_PER_PAGE = 5
  const totalPages = Math.ceil(filteredSources.length / ITEMS_PER_PAGE)
  const paginatedSources = filteredSources.slice(currentPage * ITEMS_PER_PAGE, (currentPage + 1) * ITEMS_PER_PAGE)

  // Переход к следующей/предыдущей странице
  const nextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1)
    }
  }

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1)
    }
  }

  return (
    <Card className="shadow-sm">
      <CardContent className="p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-lg font-medium">Ваши источники данных</h2>
            <p className="text-sm text-muted-foreground">
              {sources.length > 5 ? `У вас ${sources.length} источников данных` : "Выберите источник для управления"}
            </p>
          </div>

          {sources.length > 5 && (
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="h-8 px-2" onClick={() => setShowSearch(!showSearch)}>
                <Search className="h-4 w-4" />
                <span className="sr-only">Поиск</span>
              </Button>

              {showSearch && (
                <div className="relative w-[200px]">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Поиск источника..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value)
                      setCurrentPage(0) // Сбрасываем страницу при поиске
                    }}
                    className="pl-8 h-9"
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {isMobile || sources.length > 10 ? (
          // Для мобильных устройств или большого количества источников используем Select
          <div className="mt-4">
            <Select value={selectedSourceId || ""} onValueChange={onSourceSelect}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Выберите источник" />
              </SelectTrigger>
              <SelectContent>
                <ScrollArea className="h-[300px]">
                  {filteredSources.map((source) => (
                    <SelectItem key={source.id} value={source.id}>
                      <div className="flex items-center gap-2">
                        <div className={`h-2 w-2 rounded-full ${getScoreColorClass(source.score)}`} />
                        {source.name}
                        <Badge variant="outline" className="ml-auto text-xs">
                          {source.score}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </ScrollArea>
              </SelectContent>
            </Select>
          </div>
        ) : (
          // Для десктопа с небольшим количеством источников используем Tabs с пагинацией
          <div className="mt-4 flex items-center">
            {totalPages > 1 && (
              <Button variant="ghost" size="icon" onClick={prevPage} disabled={currentPage === 0} className="h-8 w-8">
                <ChevronLeft className="h-4 w-4" />
              </Button>
            )}

            <Tabs value={selectedSourceId || sources[0].id} onValueChange={onSourceSelect} className="flex-1">
              <TabsList className="w-full">
                {paginatedSources.map((source) => (
                  <TabsTrigger key={source.id} value={source.id} className="flex items-center gap-2 flex-1">
                    <div className={`h-2 w-2 rounded-full ${getScoreColorClass(source.score)}`} />
                    <span className="truncate">{source.name}</span>
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>

            {totalPages > 1 && (
              <Button
                variant="ghost"
                size="icon"
                onClick={nextPage}
                disabled={currentPage === totalPages - 1}
                className="h-8 w-8"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        )}

        {totalPages > 1 && !isMobile && sources.length <= 10 && (
          <div className="flex justify-center mt-2">
            <p className="text-xs text-muted-foreground">
              Страница {currentPage + 1} из {totalPages}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

