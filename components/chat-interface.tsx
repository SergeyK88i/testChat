"use client"

import { useState, useRef, useEffect } from "react"
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
import { sendChatRequest, clearChatHistory } from '../utils/api'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
}

type ChatInterfaceProps = {
  selectedSource: string | null
  userRole?: "requester" | "owner"
}

export default function ChatInterface({ selectedSource, userRole = "requester" }: ChatInterfaceProps) {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [input, setInput] = useState("")
  const [showSuggestions, setShowSuggestions] = useState(true)
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const messageEndRef = useRef<HTMLDivElement>(null)

  const suggestions = userRole === "requester"
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

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)
    setShowSuggestions(false)

    try {
      const data = await sendChatRequest([...messages, userMessage], 'gpt3', [selectedSource || ''])
      if (data?.answer) {
        const assistantMessage: Message = {
          id: Date.now().toString(),
          role: 'assistant',
          content: data.answer
        }
        setMessages(prev => [...prev, assistantMessage])
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleClearHistory = async () => {
    try {
      await clearChatHistory()
      setMessages([])
      setShowSuggestions(true)
    } catch (error) {
      console.error('Error clearing history:', error)
    }
  }
  const chatContent = (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4">
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
                  onClick={() => setInput(suggestion.text)}
                >
                  <span className="mr-2 text-primary">{suggestion.icon}</span>
                  {suggestion.text}
                </Button>
              ))}
            </div>
          )}
        </div>
        ) : (
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[80%] rounded-lg p-3 ${
                message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'
              }`}>
                {message.content}
              </div>
            </div>
          ))}
          <div ref={messageEndRef} />
        </div>
        )}
    </div>
    <form onSubmit={handleSubmit} className="border-t p-3 flex gap-2">
    <Input
      value={input}
      onChange={(e) => setInput(e.target.value)}
      placeholder="Введите ваш вопрос..."
      className="flex-1 h-9 text-sm rounded-full"
      disabled={isLoading}
    />
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
            size="icon"
            variant="ghost"
            className="rounded-full h-8 w-8"
            onClick={() => setIsFullscreen(!isFullscreen)}
          >
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{isFullscreen ? "Свернуть" : "Развернуть"}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
    <Button 
      type="submit" 
      size="icon" 
      className="rounded-full h-9 w-9"
      disabled={isLoading}
    >
      <SendIcon size={16} />
    </Button>
    </form>
    </div>
  )
  return (
    <>
    <div className="flex flex-col h-[500px]">
      {chatContent}
    </div>
    <Dialog open={isFullscreen} onOpenChange={setIsFullscreen}>
      <DialogContent className="max-w-[80vw] h-[80vh]">
        <DialogHeader>
          <DialogTitle>Чат с ИИ Аналитиком</DialogTitle>
        </DialogHeader>
        {chatContent}
      </DialogContent>
    </Dialog>
    </>

      
    
  )
}
