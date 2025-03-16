"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, PieChart } from "lucide-react"

type SourceDetails = {
  reliability: number
  accuracy: number
  completeness: number
}

type Source = {
  id: string
  name: string
  score: number
  details: SourceDetails
}

type SourceComparisonProps = {
  sources: Source[]
}

export default function SourceComparison({ sources }: SourceComparisonProps) {
  // Функция для определения цвета на основе значения
  const getColorClass = (value: number) => {
    if (value >= 90) return "bg-emerald-500"
    if (value >= 80) return "bg-green-500"
    if (value >= 70) return "bg-yellow-500"
    if (value >= 60) return "bg-orange-500"
    return "bg-red-500"
  }

  return (
    <div className="animate-in fade-in-50 slide-in-from-bottom-5 duration-500">
      <Card className="shadow-lg border-primary/10">
        <CardHeader className="bg-muted/50">
          <CardTitle className="flex items-center gap-2">
            <span className="inline-block p-2 rounded-full bg-primary/10">
              <BarChart className="h-5 w-5 text-primary" />
            </span>
            Сравнение источников
          </CardTitle>
          <CardDescription>Сравнительный анализ индексов зрелости источников</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <BarChart className="h-4 w-4" />
                Общий индекс
              </TabsTrigger>
              <TabsTrigger value="details" className="flex items-center gap-2">
                <PieChart className="h-4 w-4" />
                Детализация
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {sources.map((source, index) => (
                <div key={source.id} className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium">{source.name}</span>
                    <span className="font-bold">{source.score}/100</span>
                  </div>
                  <Progress value={source.score} className={getColorClass(source.score)} />
                </div>
              ))}
            </TabsContent>

            <TabsContent value="details">
              <div className="grid gap-6 md:grid-cols-3">
                <Card>
                  <CardHeader className="p-4">
                    <CardTitle className="text-sm">Надежность</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0 space-y-4">
                    {sources.map((source) => (
                      <div key={`reliability-${source.id}`} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>{source.name}</span>
                          <span>{source.details.reliability}%</span>
                        </div>
                        <Progress
                          value={source.details.reliability}
                          className={getColorClass(source.details.reliability)}
                        />
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="p-4">
                    <CardTitle className="text-sm">Точность</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0 space-y-4">
                    {sources.map((source) => (
                      <div key={`accuracy-${source.id}`} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>{source.name}</span>
                          <span>{source.details.accuracy}%</span>
                        </div>
                        <Progress value={source.details.accuracy} className={getColorClass(source.details.accuracy)} />
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="p-4">
                    <CardTitle className="text-sm">Полнота</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0 space-y-4">
                    {sources.map((source) => (
                      <div key={`completeness-${source.id}`} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>{source.name}</span>
                          <span>{source.details.completeness}%</span>
                        </div>
                        <Progress
                          value={source.details.completeness}
                          className={getColorClass(source.details.completeness)}
                        />
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

