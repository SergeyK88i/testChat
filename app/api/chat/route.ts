import { openai } from "@ai-sdk/openai"
import { streamText } from "ai"
import type { NextRequest } from "next/server"

// Пример данных источников (в реальном приложении эти данные могут приходить из базы данных)
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

export async function POST(req: NextRequest) {
  const { messages, selectedSource, userRole = "requester" } = await req.json()

  // Получаем данные о выбранном источнике
  const sourceData = selectedSource ? sources.find((source) => source.id === selectedSource) : null

  // Формируем системное сообщение с контекстом о выбранном источнике
  let systemMessage = `Ты ИИ аналитик, который помогает пользователям понять индекс зрелости источников данных. 
Индекс зрелости включает в себя оценку надежности, точности и полноты источника.

Роль пользователя: ${userRole === "requester" ? "Заказчик данных" : "Владелец источника данных"}`

  if (sourceData) {
    systemMessage += `

Выбранный источник: ${sourceData.name}
  Владелец: ${sourceData.owner}
  Общий индекс зрелости: ${sourceData.score}/100
  Надежность: ${sourceData.details.reliability}%
  Точность: ${sourceData.details.accuracy}%
  Полнота: ${sourceData.details.completeness}%`

    if (userRole === "owner") {
      systemMessage += `
      
Как владельцу источника, пользователю важно получить конкретные рекомендации по улучшению показателей. 
Предлагай практические шаги для повышения индекса зрелости. Фокусируйся на конкретных действиях, 
которые помогут улучшить слабые места источника.

Если пользователь запрашивает примеры кода, предоставляй их в формате блоков кода с указанием языка программирования:
\`\`\`python
# Пример кода на Python
\`\`\`

\`\`\`sql
-- Пример SQL запроса
\`\`\`

\`\`\`javascript
// Пример кода на JavaScript
\`\`\`

Примеры кода должны быть практичными и применимыми к задачам улучшения качества данных.`
    } else {
      systemMessage += `
      
Как заказчику данных, пользователю важно понять, насколько источник соответствует его требованиям.
Объясняй значение показателей и помогай интерпретировать индекс зрелости для принятия решений.`
    }
  } else {
    systemMessage += `

Пользователь еще не выбрал источник.`
  }

  // Создаем поток ответа от модели
  const result = await streamText({
    model: openai("gpt-4-turbo"),
    messages: [{ role: "system", content: systemMessage }, ...messages],
  })

  // Возвращаем поток ответа
  return result.toDataStreamResponse()
}

