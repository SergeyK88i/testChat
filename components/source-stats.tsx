"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart,
  LineChart,
  PieChart,
  AlertCircle,
  Download,
  Clock,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Info,
  ShoppingCart,
} from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

type SourceDetails = {
  reliability: number
  accuracy: number
  completeness: number
}

type SourceProps = {
  source: {
    id: string
    name: string
    score: number
    details: SourceDetails
  }
  userRole?: "requester" | "owner"
}

export default function SourceStats({ source, userRole = "requester" }: SourceProps) {
  const [activeTab, setActiveTab] = useState("overview")
  const [showOrderDialog, setShowOrderDialog] = useState(false)

  // Функция для определения цвета на основе значения
  const getColorClass = (value: number) => {
    if (value >= 90) return "bg-emerald-500"
    if (value >= 80) return "bg-green-500"
    if (value >= 70) return "bg-yellow-500"
    if (value >= 60) return "bg-orange-500"
    return "bg-red-500"
  }

  // Функция для определения текстового статуса
  const getStatus = (value: number) => {
    if (value >= 90) return "Отлично"
    if (value >= 80) return "Хорошо"
    if (value >= 70) return "Удовлетворительно"
    if (value >= 60) return "Требует внимания"
    return "Критично"
  }

  // Функция для определения рекомендаций
  const getRecommendation = (key: string, value: number) => {
    if (value >= 90) return "Поддерживайте текущий уровень"

    if (key === "reliability") {
      if (value >= 80) return "Улучшите мониторинг системы"
      if (value >= 70) return "Увеличьте частоту резервного копирования"
      return "Необходима полная реорганизация инфраструктуры"
    }

    if (key === "accuracy") {
      if (value >= 80) return "Улучшите процесс валидации данных"
      if (value >= 70) return "Внедрите автоматическую проверку данных"
      return "Требуется полный аудит данных"
    }

    if (key === "completeness") {
      if (value >= 80) return "Добавьте недостающие поля данных"
      if (value >= 70) return "Расширьте охват источника"
      return "Необходимо значительное расширение источника"
    }

    return "Требуется улучшение"
  }

  // Проверяем, можно ли оформить предзаказ (индекс >= 80)
  const canOrder = source.score >= 80

  return (
    <div className="animate-in fade-in-50 slide-in-from-bottom-5 duration-500">
      <Card className="shadow-lg border-primary/10">
        <CardContent className="p-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <PieChart className="h-4 w-4" />
                Обзор
              </TabsTrigger>
              <TabsTrigger value="details" className="flex items-center gap-2">
                <BarChart className="h-4 w-4" />
                Детали
              </TabsTrigger>
              <TabsTrigger value="history" className="flex items-center gap-2">
                <LineChart className="h-4 w-4" />
                История
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium">Общий индекс зрелости</span>
                  <span className="font-bold">
                    {source.score}/100 - {getStatus(source.score)}
                  </span>
                </div>
                <Progress value={source.score} className={getColorClass(source.score)} />
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                {Object.entries(source.details).map(([key, value], index) => {
                  const label = key === "reliability" ? "Надежность" : key === "accuracy" ? "Точность" : "Полнота"

                  // Определяем тренд (для примера)
                  const trend = key === "reliability" ? 2 : key === "accuracy" ? -1 : 3

                  return (
                    <div
                      key={key}
                      className="animate-in fade-in-50 slide-in-from-bottom-5 duration-500"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <Card className="overflow-hidden">
                        <CardHeader className={`p-3 text-white ${getColorClass(value)}`}>
                          <CardTitle className="text-sm flex items-center justify-between">
                            {label}
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger>
                                  <AlertCircle className="h-4 w-4" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>{getRecommendation(key, value)}</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="p-3">
                          <div className="flex items-end justify-between">
                            <div className="text-3xl font-bold">{value}%</div>
                            <div className="flex items-center text-xs">
                              {trend > 0 ? (
                                <span className="text-green-500 flex items-center">
                                  <ArrowUpRight className="h-3 w-3 mr-1" />+{trend}%
                                </span>
                              ) : (
                                <span className="text-red-500 flex items-center">
                                  <ArrowDownRight className="h-3 w-3 mr-1" />
                                  {trend}%
                                </span>
                              )}
                              <span className="text-muted-foreground ml-1">за месяц</span>
                            </div>
                          </div>
                          <div className="text-sm text-muted-foreground mt-1">{getStatus(value)}</div>
                          <Progress value={value} className={`mt-2 ${getColorClass(value)}`} />
                        </CardContent>
                        <CardFooter className="p-3 pt-0 flex justify-between text-xs text-muted-foreground">
                          <div className="flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            Обновлено: 2 дня назад
                          </div>
                          <div className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            15.03.2025
                          </div>
                        </CardFooter>
                      </Card>
                    </div>
                  )
                })}
              </div>

              {userRole === "owner" && (
                <Card className="mt-6">
                  <CardHeader className="p-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Info className="h-4 w-4 text-primary" />
                      Рекомендации по улучшению
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-3">
                    <ul className="space-y-2 list-disc pl-5">
                      {Object.entries(source.details).map(([key, value]) => {
                        const label = key === "reliability" ? "Надежность" : key === "accuracy" ? "Точность" : "Полнота"

                        return (
                          <li key={key}>
                            <span className="font-medium">{label}:</span> {getRecommendation(key, value)}
                          </li>
                        )
                      })}
                    </ul>
                  </CardContent>
                  <CardFooter className="p-3 pt-0 flex justify-end">
                    <Button variant="outline" size="sm" className="text-xs">
                      Подробный план улучшений
                    </Button>
                  </CardFooter>
                </Card>
              )}

              {userRole === "requester" && (
                <div className="flex justify-end">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div>
                          <Button onClick={() => setShowOrderDialog(true)} disabled={!canOrder} className="gap-2">
                            <ShoppingCart className="h-4 w-4" />
                            Оформить предзаказ
                          </Button>
                        </div>
                      </TooltipTrigger>
                      {!canOrder && (
                        <TooltipContent>
                          <p>Предзаказ доступен только для источников с индексом зрелости от 80</p>
                        </TooltipContent>
                      )}
                    </Tooltip>
                  </TooltipProvider>

                  <Dialog open={showOrderDialog} onOpenChange={setShowOrderDialog}>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Оформление предзаказа</DialogTitle>
                        <DialogDescription>
                          Оформление предзаказа на данные из источника "{source.name}"
                        </DialogDescription>
                      </DialogHeader>

                      <div className="space-y-4 py-4">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">Источник:</span>
                          <span>{source.name}</span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="font-medium">Индекс зрелости:</span>
                          <div className="flex items-center gap-2">
                            <span>{source.score}/100</span>
                            <Badge variant={source.score >= 90 ? "default" : "secondary"}>
                              {getStatus(source.score)}
                            </Badge>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="font-medium">Владелец:</span>
                          <span>{source.owner}</span>
                        </div>

                        <div className="bg-muted p-3 rounded-md">
                          <p className="text-sm">
                            Предзаказ будет направлен владельцу источника. После подтверждения вы получите доступ к
                            данным.
                          </p>
                        </div>
                      </div>

                      <DialogFooter>
                        <Button variant="outline" onClick={() => setShowOrderDialog(false)}>
                          Отмена
                        </Button>
                        <Button className="gap-2">
                          <ShoppingCart className="h-4 w-4" />
                          Оформить предзаказ
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              )}
            </TabsContent>

            <TabsContent value="details">
              <div className="space-y-6">
                <Card>
                  <CardHeader className="p-3">
                    <CardTitle className="text-sm">Детальный анализ</CardTitle>
                  </CardHeader>
                  <CardContent className="p-3">
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-semibold mb-2">Надежность - {source.details.reliability}%</h3>
                        <p className="text-muted-foreground text-sm mb-2">
                          Оценка стабильности и доступности источника данных.
                        </p>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div className="bg-muted p-2 rounded">Время безотказной работы: 99.2%</div>
                          <div className="bg-muted p-2 rounded">Среднее время отклика: 120мс</div>
                          <div className="bg-muted p-2 rounded">Частота обновления: Ежедневно</div>
                          <div className="bg-muted p-2 rounded">Резервное копирование: Да</div>
                        </div>
                      </div>

                      <div>
                        <h3 className="font-semibold mb-2">Точность - {source.details.accuracy}%</h3>
                        <p className="text-muted-foreground text-sm mb-2">Оценка корректности данных в источнике.</p>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div className="bg-muted p-2 rounded">Процент ошибок: 2.3%</div>
                          <div className="bg-muted p-2 rounded">Валидация данных: Автоматическая</div>
                          <div className="bg-muted p-2 rounded">Согласованность: Высокая</div>
                          <div className="bg-muted p-2 rounded">Верификация: Ручная</div>
                        </div>
                      </div>

                      <div>
                        <h3 className="font-semibold mb-2">Полнота - {source.details.completeness}%</h3>
                        <p className="text-muted-foreground text-sm mb-2">
                          Оценка полноты охвата необходимой информации.
                        </p>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div className="bg-muted p-2 rounded">Охват данных: 92%</div>
                          <div className="bg-muted p-2 rounded">Пропущенные поля: 3.1%</div>
                          <div className="bg-muted p-2 rounded">Глубина истории: 5 лет</div>
                          <div className="bg-muted p-2 rounded">Детализация: Высокая</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  {userRole === "owner" && (
                    <CardFooter className="p-3 pt-0 flex justify-end">
                      <Button variant="outline" size="sm" className="text-xs">
                        Экспорт детального отчета
                      </Button>
                    </CardFooter>
                  )}
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="history">
              <Card>
                <CardHeader className="p-3">
                  <CardTitle className="text-sm flex items-center justify-between">
                    <span>История изменений индекса</span>
                    {userRole === "owner" && (
                      <Button variant="outline" size="sm" className="h-8 text-xs">
                        <Download className="h-3 w-3 mr-1" /> Экспорт данных
                      </Button>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-3">
                  <div className="h-64 w-full bg-muted/30 rounded-lg flex items-center justify-center mb-4">
                    <div className="text-center text-muted-foreground">
                      <LineChart className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p>Здесь будет график истории изменений индекса зрелости</p>
                    </div>
                  </div>

                  <div className="space-y-2 mt-4">
                    <div className="flex justify-between text-sm border-b pb-2">
                      <span className="font-medium">15.03.2025</span>
                      <div className="flex items-center gap-2">
                        <span>Индекс: {source.score}%</span>
                        <Badge variant="outline" className="text-green-500">
                          +2%
                        </Badge>
                      </div>
                    </div>
                    <div className="flex justify-between text-sm border-b pb-2">
                      <span className="font-medium">01.03.2025</span>
                      <div className="flex items-center gap-2">
                        <span>Индекс: {source.score - 2}%</span>
                        <Badge variant="outline" className="text-yellow-500">
                          +0%
                        </Badge>
                      </div>
                    </div>
                    <div className="flex justify-between text-sm border-b pb-2">
                      <span className="font-medium">15.02.2025</span>
                      <div className="flex items-center gap-2">
                        <span>Индекс: {source.score - 5}%</span>
                        <Badge variant="outline" className="text-red-500">
                          -3%
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

