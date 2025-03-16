"use client"

import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

type LineChartProps = {
  data: {
    date: string
    score: number
    reliability?: number
    accuracy?: number
    completeness?: number
  }[]
}

export default function SourceLineChart({ data }: LineChartProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <RechartsLineChart
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis domain={[0, 100]} />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="score" stroke="#2563eb" activeDot={{ r: 8 }} name="Общий индекс" />
        <Line type="monotone" dataKey="reliability" stroke="#10b981" name="Надежность" />
        <Line type="monotone" dataKey="accuracy" stroke="#f59e0b" name="Точность" />
        <Line type="monotone" dataKey="completeness" stroke="#8b5cf6" name="Полнота" />
      </RechartsLineChart>
    </ResponsiveContainer>
  )
}

