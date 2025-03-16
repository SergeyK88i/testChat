"use client"

import { useState, useRef, useEffect } from "react"
import { useChat } from "ai/react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  SendIcon,
  Bot,
  Paperclip,
  Info,
  Search,
  Sparkles,
  HelpCircle,
  Zap,
  Maximize2,
  Minimize2,
  Copy,
  Check,
} from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

type ChatInterfaceProps = {
  selectedSource: string | null
  userRole?: "requester" | "owner"
}

export default function ChatInterface({ selectedSource, userRole = "requester" }: ChatInterfaceProps) {
  const { messages, input, handleInputChange, handleSubmit, isLoading, setInput } = useChat({
    api: "/api/chat",
    body: {
      selectedSource,
      userRole,
    },
  })

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [showSuggestions, setShowSuggestions] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null)

  // Автоматическая прокрутка вниз при новых сообщениях
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  // Скрыть предложения после первого сообщения
  useEffect(() => {
    if (messages.length > 0) {
      setShowSuggestions(false)
    }
  }, [messages])

  // Предложенные вопросы в зависимости от роли пользователя
  const suggestions =
    userRole === "requester"
      ? [
          { icon: <HelpCircle className="h-4 w-4" />, text: "Что означает индекс зрелости?" },
          { icon: <Search className="h-4 w-4" />, text: "Как рассчитывается индекс?" },
          { icon: <Info className="h-4 w-4" />, text: "Какие факторы влияют на надежность?" },
          { icon: <Sparkles className="h-4 w-4" />, text: "Какой источник лучше выбрать?" },
        ]
      : [
          { icon: <Zap className="h-4 w-4" />, text: "Как улучшить показатели источника?" },
          { icon: <Search className="h-4 w-4" />, text: "Что влияет на точность данных?" },
          { icon: <Info className="h-4 w-4" />, text: "Как повысить надежность источника?" },
          { icon: <Sparkles className="h-4 w-4" />, text: "Приведи пример кода для валидации данных" },
        ]

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion)
  }

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  const copyMessageToClipboard = (messageId: string, content: string) => {
    navigator.clipboard.writeText(content)
    setCopiedMessageId(messageId)
    setTimeout(() => setCopiedMessageId(null), 2000)
  }

  // Функция для форматирования сообщений с кодом
  const formatMessage = (content: string) => {
    // Простая проверка на наличие блоков кода
    if (content.includes("```")) {
      const parts = content.split(/(```[\s\S]*?```)/g)
      return (
        <>
          {parts.map((part, index) => {
            if (part.startsWith("```") && part.endsWith("```")) {
              // Извлекаем язык программирования и код
              const match = part.match(/```(\w*)\n([\s\S]*?)```/)
              const language = match?.[1] || ""
              const code = match?.[2] || part.slice(3, -3)

              return (
                <div key={index} className="my-2 relative">
                  {language && <div className="bg-muted text-xs px-3 py-1 rounded-t-md font-mono">{language}</div>}
                  <pre className="bg-muted p-3 rounded-md overflow-x-auto text-sm font-mono">
                    <code>{code}</code>
                  </pre>
                </div>
              )
            }
            return (
              <p key={index} className="whitespace-pre-wrap">
                {part}
              </p>
            )
          })}
        </>
      )
    }
    return <p className="whitespace-pre-wrap">{content}</p>
  }

  const chatContent = (
    <>
      <div className={`flex-1 overflow-y-auto p-4 space-y-4 ${isFullscreen ? "h-[calc(100vh-120px)]" : ""}`}>
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
              <Bot size={24} className="text-primary" />
            </div>
            <h3 className="text-base font-semibold mb-2">ИИ Аналитик</h3>
            <p className="text-muted-foreground text-sm max-w-md mb-4">
              {userRole === "requester"
                ? "Задайте вопрос о выбранном источнике или индексе зрелости. Я помогу вам разобраться в данных."
                : "Задайте вопрос о вашем источнике данных. Я помогу вам улучшить его показатели."}
            </p>

            {showSuggestions && (
              <div className="grid grid-cols-1 gap-2 w-full max-w-md">
                {suggestions.map((suggestion, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="justify-start text-left h-auto py-2 hover:bg-primary/5 transition-colors"
                    onClick={() => handleSuggestionClick(suggestion.text)}
                  >
                    <span className="mr-2 text-primary">{suggestion.icon}</span>
                    {suggestion.text}
                  </Button>
                ))}
              </div>
            )}
          </div>
        ) : (
          messages.map((message, index) => (
            <div
              key={message.id}
              className="animate-in fade-in-50 slide-in-from-bottom-5 duration-300 group"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <Card className={`p-3 ${message.role === "assistant" ? "bg-muted/50" : "bg-primary/5"}`}>
                <div className="flex gap-3">
                  {message.role === "user" ? (
                    <Avatar className="h-8 w-8 flex-shrink-0">
                      <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Аватар пользователя" />
                      <AvatarFallback>ИП</AvatarFallback>
                    </Avatar>
                  ) : (
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <Bot size={16} className="text-primary" />
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="font-semibold flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        {message.role === "user" ? "Вы" : "ИИ Аналитик"}
                        {message.role === "assistant" && (
                          <Badge variant="outline" className="text-xs">
                            ИИ
                          </Badge>
                        )}
                      </div>
                      {message.role === "assistant" && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => copyMessageToClipboard(message.id, message.content)}
                        >
                          {copiedMessageId === message.id ? (
                            <Check className="h-3 w-3 text-green-500" />
                          ) : (
                            <Copy className="h-3 w-3" />
                          )}
                        </Button>
                      )}
                    </div>
                    <div className="mt-1 text-pretty text-sm">{formatMessage(message.content)}</div>
                  </div>
                </div>
              </Card>
            </div>
          ))
        )}

        {isLoading && (
          <div className="animate-in fade-in-50 slide-in-from-bottom-5 duration-300">
            <Card className="p-3 bg-muted/50">
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Bot size={16} className="text-primary" />
                </div>
                <div>
                  <div className="font-semibold flex items-center gap-2 text-sm">
                    ИИ Аналитик
                    <Badge variant="outline" className="text-xs">
                      ИИ
                    </Badge>
                  </div>
                  <div className="mt-1 flex items-center">
                    <span className="inline-block w-2 h-2 bg-primary rounded-full mr-1 animate-pulse"></span>
                    <span
                      className="inline-block w-2 h-2 bg-primary rounded-full mr-1 animate-pulse"
                      style={{ animationDelay: "150ms" }}
                    ></span>
                    <span
                      className="inline-block w-2 h-2 bg-primary rounded-full animate-pulse"
                      style={{ animationDelay: "300ms" }}
                    ></span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="border-t p-3 flex gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button type="button" size="icon" variant="ghost" className="rounded-full h-8 w-8">
                <Paperclip className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Прикрепить файл</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <Input
          value={input}
          onChange={handleInputChange}
          placeholder="Введите ваш вопрос..."
          disabled={isLoading}
          className="flex-1 h-9 text-sm rounded-full"
        />

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="rounded-full h-8 w-8"
                onClick={toggleFullscreen}
              >
                {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{isFullscreen ? "Свернуть" : "Развернуть"}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <Button type="submit" size="icon" className="rounded-full h-9 w-9" disabled={isLoading || !input.trim()}>
          <SendIcon size={16} />
        </Button>
      </form>
    </>
  )

  return (
    <>
      <div className="flex flex-col h-[500px]">
        {!isFullscreen ? (
          chatContent
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground">Чат открыт в полноэкранном режиме</p>
          </div>
        )}
      </div>

      <Dialog open={isFullscreen} onOpenChange={setIsFullscreen}>
        <DialogContent className="max-w-4xl w-[90vw] h-[90vh] flex flex-col p-0">
          <DialogHeader className="px-4 py-2 border-b">
            <DialogTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-primary" />
              Чат с ИИ Аналитиком
            </DialogTitle>
          </DialogHeader>
          {chatContent}
        </DialogContent>
      </Dialog>
    </>
  )
}

