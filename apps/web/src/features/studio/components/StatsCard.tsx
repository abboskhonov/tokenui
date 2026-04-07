"use client"

import { Bar, BarChart, XAxis } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

interface StatsCardProps {
  label: string
  value: number
  icon: React.ReactNode
  chartData?: number[]
}

interface StatsCardSkeletonProps {
  icon: React.ReactNode
}

const days = ["M", "T", "W", "T", "F", "S", "S"]

const chartConfig = {
  value: {
    label: "Count",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig

function SimpleBarChartSkeleton() {
  return (
    <div className="mt-3 flex gap-2 h-24">
      {/* Y-axis labels placeholder */}
      <div className="flex flex-col justify-between text-[9px] text-muted-foreground/30 w-5 text-right pr-1 py-1">
        <span>—</span>
        <span>—</span>
        <span>—</span>
        <span>—</span>
      </div>

      {/* Chart area with animated bars */}
      <div className="flex-1 flex items-end justify-between gap-1.5 relative py-1">
        {days.map((day, i) => (
          <div key={i} className="flex flex-col items-center gap-1 flex-1 h-full justify-end">
            {/* Animated skeleton bar */}
            <div
              className="w-full rounded-t-sm bg-primary/20 animate-pulse"
              style={{
                height: `${20 + Math.random() * 30}%`,
                animationDelay: `${i * 100}ms`,
              }}
            />
            {/* Day label */}
            <span className="text-[10px] font-medium text-muted-foreground/40">
              {day}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

function SimpleBarChart({ data }: { data: number[] }) {
  // Ensure we have exactly 7 data points
  const normalizedData = data.slice(0, 7)
  while (normalizedData.length < 7) {
    normalizedData.push(0)
  }

  // Transform data for the chart
  const chartData = days.map((day, i) => ({
    day,
    value: normalizedData[i] ?? 0,
  }))

  return (
    <div className="mt-3 h-24">
      <ChartContainer config={chartConfig} className="h-full w-full">
        <BarChart data={chartData} accessibilityLayer margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
          <XAxis
            dataKey="day"
            tickLine={false}
            axisLine={false}
            tickMargin={4}
            className="text-[10px]"
          />
          <ChartTooltip
            cursor={{ fill: "var(--muted)", opacity: 0.3 }}
            content={<ChartTooltipContent hideLabel />}
          />
          <Bar
            dataKey="value"
            fill="var(--color-value)"
            radius={[2, 2, 0, 0]}
            maxBarSize={24}
          />
        </BarChart>
      </ChartContainer>
    </div>
  )
}

export function StatsCardSkeleton({ icon }: StatsCardSkeletonProps) {
  return (
    <div className="rounded-xl bg-card/50 p-4 ring-1 ring-border">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-muted-foreground/50">
          {icon}
          <span className="text-sm bg-muted rounded w-16 h-4 animate-pulse" />
        </div>
        <div className="h-7 w-12 bg-muted rounded animate-pulse" />
      </div>
      <SimpleBarChartSkeleton />
    </div>
  )
}

export function StatsCard({ label, value, icon, chartData }: StatsCardProps) {
  return (
    <div className="rounded-xl bg-card/50 p-4 ring-1 ring-border">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-muted-foreground">
          {icon}
          <span className="text-sm">{label}</span>
        </div>
        <span className="text-2xl font-semibold">{value.toLocaleString()}</span>
      </div>
      {chartData && <SimpleBarChart data={chartData} />}
    </div>
  )
}
