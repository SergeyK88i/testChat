"use client"

import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts"

type RadarChartProps = {
  data: {
    subject: string
    value: number
    fullMark: number
  }[]
}

export default function SourceRadarChart({ data }: RadarChartProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
        <PolarGrid />
        <PolarAngleAxis dataKey="subject" />
        <PolarRadiusAxis angle={30} domain={[0, 100]} />
        <Radar name="Показатели" dataKey="value" stroke="#2563eb" fill="#3b82f6" fillOpacity={0.6} />
      </RadarChart>
    </ResponsiveContainer>
  )
}

