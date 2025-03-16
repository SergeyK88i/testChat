"use client"

import type React from "react"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Download, FileText, FileImage, Table } from "lucide-react"

type ExportDialogProps = {
  sourceName: string
  children: React.ReactNode
}

export default function ExportDialog({ sourceName, children }: ExportDialogProps) {
  const [format, setFormat] = useState("pdf")
  const [includeDetails, setIncludeDetails] = useState(true)
  const [includeHistory, setIncludeHistory] = useState(true)
  const [includeRecommendations, setIncludeRecommendations] = useState(true)

  const handleExport = () => {
    // В реальном приложении здесь будет логика экспорта
    console.log("Экспорт в формате:", format)
    console.log("Включить детали:", includeDetails)
    console.log("Включить историю:", includeHistory)
    console.log("Включить рекомендации:", includeRecommendations)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Экспорт отчета</DialogTitle>
          <DialogDescription>Экспорт данных по источнику "{sourceName}"</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <h4 className="font-medium">Формат экспорта</h4>
            <RadioGroup defaultValue={format} onValueChange={setFormat} className="flex flex-col space-y-1">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="pdf" id="pdf" />
                <Label htmlFor="pdf" className="flex items-center">
                  <FileText className="mr-2 h-4 w-4 text-muted-foreground" />
                  PDF документ
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="excel" id="excel" />
                <Label htmlFor="excel" className="flex items-center">
                  <Table className="mr-2 h-4 w-4 text-muted-foreground" />
                  Excel таблица
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="image" id="image" />
                <Label htmlFor="image" className="flex items-center">
                  <FileImage className="mr-2 h-4 w-4 text-muted-foreground" />
                  Изображение (PNG)
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium">Содержимое отчета</h4>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="details"
                checked={includeDetails}
                onCheckedChange={(checked) => setIncludeDetails(checked as boolean)}
              />
              <Label htmlFor="details">Включить детальную информацию</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="history"
                checked={includeHistory}
                onCheckedChange={(checked) => setIncludeHistory(checked as boolean)}
              />
              <Label htmlFor="history">Включить историю изменений</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="recommendations"
                checked={includeRecommendations}
                onCheckedChange={(checked) => setIncludeRecommendations(checked as boolean)}
              />
              <Label htmlFor="recommendations">Включить рекомендации</Label>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Экспортировать
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

