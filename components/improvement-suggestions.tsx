"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, AlertTriangle, Zap, ArrowRight } from "lucide-react"
import { Progress } from "@/components/ui/progress"

type SourceDetails = {
  reliability: number
  accuracy: number
  completeness: number
}

type ImprovementSuggestionsProps = {
  source: {
    id: string
    name: string
    score: number
    details: SourceDetails
  }
}

export default function ImprovementSuggestions({ source }: ImprovementSuggestionsProps) {
  // Определяем слабые места источника
  const weakPoints = Object.entries(source.details)
    .filter(([_, value]) => value < 80)
    .sort((a, b) => a[1] - b[1])

  // Функция для получения рекомендаций
  const getRecommendations = (key: string, value: number) => {
    if (key === "reliability") {
      if (value < 70)
        return [
          "Внедрить систему мониторинга доступности",
          "Настроить автоматическое резервное копирование",
          "Разработать план аварийного восстановления",
          "Увеличить частоту проверок работоспособности",
        ]
      return [
        "Оптимизировать время отклика системы",
        "Улучшить процесс обновления данных",
        "Внедрить дополнительные проверки целостности",
      ]
    }

    if (key === "accuracy") {
      if (value < 70)
        return [
          "Внедрить автоматическую валидацию данных",
          "Провести полный аудит существующих данных",
          "Разработать процедуры проверки качества",
          "Обучить персонал методам контроля качества",
        ]
      return [
        "Улучшить алгоритмы проверки данных",
        "Внедрить дополнительные валидации",
        "Регулярно проводить выборочные проверки",
      ]
    }

    if (key === "completeness") {
      if (value < 70)
        return [
          "Провести анализ пропущенных данных",
          "Разработать план по заполнению пробелов",
          "Внедрить обязательные поля при вводе",
          "Автоматизировать сбор недостающих данных",
        ]
      return [
        "Расширить набор собираемых атрибутов",
        "Увеличить глубину исторических данных",
        "Добавить дополнительные источники информации",
      ]
    }

    return []
  }

  // Функция для получения названия метрики
  const getMetricName = (key: string) => {
    if (key === "reliability") return "Надежность"
    if (key === "accuracy") return "Точность"
    if (key === "completeness") return "Полнота"
    return key
  }

  // Функция для определения цвета на основе значения
  const getColorClass = (value: number) => {
    if (value >= 90) return "bg-emerald-500"
    if (value >= 80) return "bg-green-500"
    if (value >= 70) return "bg-yellow-500"
    if (value >= 60) return "bg-orange-500"
    return "bg-red-500"
  }

  // Функция для определения иконки статуса
  const getStatusIcon = (value: number) => {
    if (value >= 80) return <CheckCircle className="h-5 w-5 text-green-500" />
    if (value >= 70) return <AlertTriangle className="h-5 w-5 text-yellow-500" />
    return <XCircle className="h-5 w-5 text-red-500" />
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium flex items-center gap-2">
          <Zap className="h-5 w-5 text-primary" />
          План улучшения источника
        </CardTitle>
        <CardDescription>Рекомендации по повышению индекса зрелости вашего источника данных</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {weakPoints.length > 0 ? (
          weakPoints.map(([key, value]) => (
            <div key={key} className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getStatusIcon(value)}
                  <h3 className="font-medium">
                    {getMetricName(key)}: {value}%
                  </h3>
                </div>
                <div className="text-sm text-muted-foreground">Целевое значение: 80%+</div>
              </div>

              <Progress value={value} className={getColorClass(value)} />

              <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                <h4 className="font-medium text-sm">Рекомендуемые действия:</h4>
                <ul className="space-y-2">
                  {getRecommendations(key, value).map((recommendation, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <ArrowRight className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>{recommendation}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-6">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
            <h3 className="text-lg font-medium mb-2">Отличные показатели!</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Все показатели вашего источника данных находятся на хорошем уровне. Продолжайте поддерживать текущие
              практики для сохранения высокого индекса зрелости.
            </p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button className="gap-2">
          <Zap className="h-4 w-4" />
          Создать детальный план улучшений
        </Button>
      </CardFooter>
    </Card>
  )
}

