"use client"

import { useState, useMemo, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import SourceStats from "@/components/source-stats"
import ChatInterface from "@/components/chat-interface"
import SourceSearch from "@/components/source-search"
import {
  MessageSquare,
  Moon,
  Sun,
  Bell,
  Settings,
  HelpCircle,
  Home,
  Database,
  FileText,
  Download,
  ChevronRight,
  Shield,
  Zap,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { useMediaQuery } from "@/hooks/use-media-query"
import ImprovementSuggestions from "@/components/improvement-suggestions"
import OwnerSourceSelector from "@/components/owner-source-selector"

// Пример данных источников (в реальном приложении эти данные могут приходить с API)
const sources = [
  {
    id: "1",
    name: "CRM система",
    owner: "Отдел продаж",
    score: 85,
    details: { reliability: 90, accuracy: 80, completeness: 85 },
  },
  {
    id: "2",
    name: "Финансовая отчетность",
    owner: "Финансовый отдел",
    score: 72,
    details: { reliability: 75, accuracy: 70, completeness: 71 },
  },
  {
    id: "3",
    name: "Клиентская база",
    owner: "Отдел маркетинга",
    score: 93,
    details: { reliability: 95, accuracy: 92, completeness: 92 },
  },
  {
    id: "4",
    name: "Система учета товаров",
    owner: "Логистический отдел",
    score: 68,
    details: { reliability: 65, accuracy: 70, completeness: 69 },
  },
  {
    id: "5",
    name: "HR данные",
    owner: "Отдел кадров",
    score: 78,
    details: { reliability: 80, accuracy: 75, completeness: 79 },
  },
]

// Пример источников, принадлежащих текущему пользователю (в реальном приложении это будет определяться на основе авторизации)
const userOwnedSources = [
  { id: "1", name: "CRM система", score: 85 },
  { id: "4", name: "Система учета товаров", score: 68 },
]

export default function SourceMaturityPage() {
  const [selectedSource, setSelectedSource] = useState<string | null>(null)
  const [userRole, setUserRole] = useState<"requester" | "owner">("requester")
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [minScore, setMinScore] = useState(0)
  const isMobile = useMediaQuery("(max-width: 768px)")

  // Для владельца данных - автоматически выбираем его первый источник
  useEffect(() => {
    if (userRole === "owner" && userOwnedSources.length > 0 && !selectedSource) {
      setSelectedSource(userOwnedSources[0].id)
    }
  }, [userRole, selectedSource])

  // Переключение темной темы
  const toggleTheme = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove("dark")
      setIsDarkMode(false)
    } else {
      document.documentElement.classList.add("dark")
      setIsDarkMode(true)
    }
  }

  // Фильтрация источников
  const filteredSources = useMemo(() => {
    return sources.filter((source) => {
      const matchesSearch =
        source.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        source.owner.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesScore = source.score >= minScore
      return matchesSearch && matchesScore
    })
  }, [searchQuery, minScore])

  const sourceData = selectedSource ? sources.find((source) => source.id === selectedSource) : null

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 dark:from-background dark:to-background">
      {/* Корпоративная навигация */}
      <header className="border-b sticky top-0 z-50 bg-background">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2 md:gap-4">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Database className="h-5 w-5" />
                  <span className="sr-only">Меню</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[240px] sm:w-[300px]">
                <div className="flex flex-col gap-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
                      К
                    </div>
                    <span className="font-semibold text-lg">КорпДата</span>
                  </div>
                  <nav className="flex flex-col gap-2">
                    <Button variant="ghost" className="justify-start gap-2">
                      <Home className="h-4 w-4" />
                      Главная
                    </Button>
                    <Button variant="ghost" className="justify-start gap-2">
                      <Database className="h-4 w-4" />
                      Источники данных
                    </Button>
                    <Button variant="ghost" className="justify-start gap-2">
                      <FileText className="h-4 w-4" />
                      Отчеты
                    </Button>
                    <Button variant="ghost" className="justify-start gap-2">
                      <Settings className="h-4 w-4" />
                      Настройки
                    </Button>
                  </nav>
                </div>
              </SheetContent>
            </Sheet>

            <div className="hidden md:flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
                К
              </div>
              <span className="font-semibold text-lg">КорпДата</span>
            </div>

            <nav className="hidden md:flex items-center gap-6 ml-6">
              <Button variant="ghost" className="text-sm font-medium">
                Главная
              </Button>
              <Button variant="ghost" className="text-sm font-medium">
                Источники данных
              </Button>
              <Button variant="ghost" className="text-sm font-medium">
                Отчеты
              </Button>
              <Button variant="ghost" className="text-sm font-medium">
                Настройки
              </Button>
            </nav>
          </div>

          <div className="flex items-center gap-2">
            <Tabs
              defaultValue={userRole}
              onValueChange={(value) => setUserRole(value as "requester" | "owner")}
              className="mr-2"
            >
              <TabsList className="h-8">
                <TabsTrigger value="requester" className="text-xs px-3 h-7">
                  Заказчик
                </TabsTrigger>
                <TabsTrigger value="owner" className="text-xs px-3 h-7">
                  Владелец
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-full">
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              <span className="sr-only">Переключить тему</span>
            </Button>

            <Button variant="ghost" size="icon" className="rounded-full relative">
              <Bell className="h-5 w-5" />
              <span className="sr-only">Уведомления</span>
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-primary"></span>
            </Button>

            <Button variant="ghost" size="icon" className="rounded-full">
              <HelpCircle className="h-5 w-5" />
              <span className="sr-only">Помощь</span>
            </Button>

            <Separator orientation="vertical" className="h-6 mx-1" />

            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Аватар пользователя" />
                <AvatarFallback>ИП</AvatarFallback>
              </Avatar>
              <div className="hidden md:block">
                <p className="text-sm font-medium">Иван Петров</p>
                <p className="text-xs text-muted-foreground">
                  {userRole === "requester" ? "Аналитик данных" : "Владелец источника"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto py-8 space-y-6 px-4 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {userRole === "requester" ? "Каталог источников данных" : "Управление источником данных"}
            </h1>
            <p className="text-muted-foreground mt-1">
              {userRole === "requester"
                ? "Выберите и проанализируйте источники данных по индексу зрелости"
                : "Анализируйте и улучшайте показатели ваших источников данных"}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {userRole === "owner" && sourceData && (
              <Button variant="outline" className="gap-2">
                <Download className="h-4 w-4" />
                Экспорт отчета
              </Button>
            )}
            <Button className="gap-2">
              {userRole === "requester" ? (
                <>
                  <Database className="h-4 w-4" /> Запросить новый источник
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4" /> Обновить индекс
                </>
              )}
            </Button>
          </div>
        </div>

        {userRole === "requester" ? (
          // Интерфейс для заказчика данных
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-3">
              <SourceSearch onSearch={setSearchQuery} onScoreChange={setMinScore} minScore={minScore} />
            </div>

            <div className="md:col-span-2 space-y-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-medium">Доступные источники данных</CardTitle>
                  <CardDescription>Выберите источник для просмотра его индекса зрелости</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y">
                    {filteredSources.length > 0 ? (
                      filteredSources.map((source) => (
                        <div
                          key={source.id}
                          className={`p-4 flex items-center justify-between hover:bg-muted/50 cursor-pointer transition-colors ${selectedSource === source.id ? "bg-muted/50" : ""}`}
                          onClick={() => setSelectedSource(source.id)}
                        >
                          <div className="flex items-start gap-3">
                            <div
                              className={`h-10 w-10 rounded-full flex items-center justify-center ${getScoreColorClass(source.score)}`}
                            >
                              <span className="text-white font-medium">{source.score}</span>
                            </div>
                            <div>
                              <h3 className="font-medium">{source.name}</h3>
                              <p className="text-sm text-muted-foreground">Владелец: {source.owner}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant={getScoreVariant(source.score)}>{getScoreLabel(source.score)}</Badge>
                            <ChevronRight className="h-5 w-5 text-muted-foreground" />
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-8 text-center text-muted-foreground">
                        Источники не найдены. Попробуйте изменить параметры поиска.
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {sourceData && <SourceStats source={sourceData} userRole={userRole} />}
              
            </div>

            <div className="space-y-6">
              <Card className="shadow-lg border-primary/10">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-medium flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-primary" />
                    Чат с ИИ ассистентом
                  </CardTitle>
                  <CardDescription>Задайте вопрос о выбранном источнике или индексе зрелости</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <ChatInterface selectedSource={selectedSource} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-medium flex items-center gap-2">
                    <Shield className="h-5 w-5 text-primary" />
                    Требования к источникам
                  </CardTitle>
                  <CardDescription>Критерии оценки индекса зрелости</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-medium">Надежность (Reliability)</h3>
                    <p className="text-sm text-muted-foreground">
                      Оценивает стабильность и доступность источника данных. Включает время безотказной работы, частоту
                      обновлений и наличие резервного копирования.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-medium">Точность (Accuracy)</h3>
                    <p className="text-sm text-muted-foreground">
                      Оценивает корректность данных в источнике. Включает процент ошибок, наличие валидации и
                      согласованность данных.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-medium">Полнота (Completeness)</h3>
                    <p className="text-sm text-muted-foreground">
                      Оценивает полноту охвата необходимой информации. Включает процент заполненности полей, глубину
                      истории и детализацию.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          // Интерфейс для владельца данных
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Селектор источников для владельца данных */}
            <div className="md:col-span-3">
              <OwnerSourceSelector
                sources={userOwnedSources}
                selectedSourceId={selectedSource}
                onSourceSelect={setSelectedSource}
              />
            </div>

            {sourceData && (
              <>
                <div className="md:col-span-2 space-y-6">
                  <Card className="shadow-lg border-primary/10">
                    <CardHeader className="pb-3">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <CardTitle className="text-xl font-medium">Источник: {sourceData.name}</CardTitle>
                            <Badge variant={getScoreVariant(sourceData.score)} className="text-xs">
                              {getScoreLabel(sourceData.score)}
                            </Badge>
                          </div>
                          <CardDescription className="mt-1">Текущий индекс зрелости и детализация</CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                          <div
                            className={`text-white font-bold px-3 py-1 rounded-md ${getScoreColorClass(sourceData.score)}`}
                          >
                            {sourceData.score}/100
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-0">
                      <SourceStats source={sourceData} userRole={userRole} />
                    </CardContent>
                  </Card>

                  <ImprovementSuggestions source={sourceData} />
                </div>

                <div className="space-y-6">
                  <Card className="shadow-lg border-primary/10">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg font-medium flex items-center gap-2">
                        <MessageSquare className="h-5 w-5 text-primary" />
                        Чат с ИИ ассистентом
                      </CardTitle>
                      <CardDescription>
                        Задайте вопрос о вашем источнике или получите рекомендации по улучшению
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                      <ChatInterface selectedSource={selectedSource} userRole={userRole} />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg font-medium">Последние изменения</CardTitle>
                      <CardDescription>История изменений индекса зрелости</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                          <FileText className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Обновлен индекс точности</p>
                          <p className="text-xs text-muted-foreground">Индекс повышен на 2%</p>
                          <p className="text-xs text-muted-foreground mt-1">2 дня назад</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                          <FileText className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Добавлена валидация данных</p>
                          <p className="text-xs text-muted-foreground">Улучшена точность источника</p>
                          <p className="text-xs text-muted-foreground mt-1">1 неделя назад</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="h-8 w-8 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600">
                          <FileText className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Обновлена система резервного копирования</p>
                          <p className="text-xs text-muted-foreground">Улучшена надежность источника</p>
                          <p className="text-xs text-muted-foreground mt-1">2 недели назад</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      <footer className="border-t mt-12 py-6 bg-muted/30">
        <div className="container mx-auto px-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold">
                К
              </div>
              <span className="font-semibold">КорпДата</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">© 2025 КорпДата. Все права защищены.</p>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" className="text-xs">
              Политика конфиденциальности
            </Button>
            <Button variant="ghost" size="sm" className="text-xs">
              Условия использования
            </Button>
            <Button variant="ghost" size="sm" className="text-xs">
              Контакты
            </Button>
          </div>

          <div className="text-xs text-muted-foreground">Версия 1.2.0</div>
        </div>
      </footer>
    </div>
  )
}

// Вспомогательные функции для определения цвета и статуса
function getScoreColorClass(score: number) {
  if (score >= 90) return "bg-emerald-500"
  if (score >= 80) return "bg-green-500"
  if (score >= 70) return "bg-yellow-500"
  if (score >= 60) return "bg-orange-500"
  return "bg-red-500"
}

function getScoreVariant(score: number) {
  if (score >= 90) return "default"
  if (score >= 80) return "secondary"
  if (score >= 70) return "outline"
  return "destructive"
}

function getScoreLabel(score: number) {
  if (score >= 90) return "Отлично"
  if (score >= 80) return "Хорошо"
  if (score >= 70) return "Удовлетворительно"
  if (score >= 60) return "Требует внимания"
  return "Критично"
}

