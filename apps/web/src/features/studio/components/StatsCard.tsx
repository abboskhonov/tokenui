"use client"

import { useState } from "react"

interface StatsCardProps {
  label: string
  value: number
  icon: React.ReactNode
  chartData?: number[]
}

function SimpleBarChart({ data }: { data: number[] }) {
  const days = ["M", "T", "W", "T", "F", "S", "S"]
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  
  // Ensure we have exactly 7 data points
  const normalizedData = data.slice(0, 7)
  while (normalizedData.length < 7) {
    normalizedData.push(0)
  }
  
  // Calculate actual max for tight scaling
  const maxDataValue = Math.max(...normalizedData, 1)
  
  // Generate y-axis labels - max at top, 0 at bottom
  const getYLabels = (max: number): number[] => {
    if (max <= 3) return [max, 0]
    if (max <= 6) return [max, Math.round(max / 2), 0]
    if (max <= 10) return [max, Math.round(max * 0.66), Math.round(max * 0.33), 0]
    if (max <= 20) return [max, Math.round(max * 0.75), Math.round(max * 0.5), Math.round(max * 0.25), 0]
    return [max, Math.round(max * 0.8), Math.round(max * 0.6), Math.round(max * 0.4), Math.round(max * 0.2), 0]
  }
  
  const yLabels = getYLabels(maxDataValue)
  
  return (
    <div className="mt-3 flex gap-2 h-24">
      {/* Y-axis labels - flex-col with justify-between puts first at top, last at bottom */}
      <div className="flex flex-col justify-between text-[9px] text-muted-foreground/60 w-5 text-right pr-1 py-1">
        {yLabels.map((label, i) => (
          <span key={i}>{label}</span>
        ))}
      </div>
      
      {/* Chart area */}
      <div className="flex-1 flex items-end justify-between gap-1.5 relative py-1">
        {/* Grid lines - position from bottom */}
        <div className="absolute inset-x-0 top-1 bottom-1 pointer-events-none">
          {yLabels.map((_, i) => {
            const position = (i / (yLabels.length - 1)) * 100
            return (
              <div 
                key={i} 
                className="absolute w-full border-t border-border/10"
                style={{ bottom: `${position}%` }}
              />
            )
          })}
        </div>
        
        {normalizedData.map((value, i) => {
          // Height as percentage of max (tight scaling)
          const heightPercent = (value / maxDataValue) * 100
          const isHovered = hoveredIndex === i
          
          return (
            <div 
              key={i} 
              className="flex flex-col items-center gap-1 flex-1 relative h-full justify-end"
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Tooltip */}
              {isHovered && value > 0 && (
                <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-popover text-popover-foreground text-[10px] px-2 py-1 rounded shadow-lg whitespace-nowrap z-10 border border-border">
                  {value}
                </div>
              )}
              
              {/* Bar - grows from bottom, white on hover */}
              <div 
                className={`w-full rounded-t-sm transition-colors duration-150 ${
                  isHovered ? 'bg-white' : 'bg-primary/50'
                }`}
                style={{ 
                  height: `${heightPercent}%`,
                  minHeight: value > 0 ? 2 : 1
                }}
              />
              
              {/* Day label */}
              <span className={`text-[10px] font-medium transition-colors ${
                isHovered ? 'text-primary' : 'text-muted-foreground/60'
              }`}>
                {days[i]}
              </span>
            </div>
          )
        })}
      </div>
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
