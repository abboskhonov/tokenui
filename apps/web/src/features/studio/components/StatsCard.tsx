interface StatsCardProps {
  label: string
  value: number
  icon: React.ReactNode
  chartData?: number[]
}

function SimpleBarChart({ data }: { data: number[] }) {
  // Use a baseline max so small values have visual room to show differences
  // e.g., 9 views with baseline 10 → 90% height (not 100%), 0 views → 0%
  const maxValue = Math.max(...data, 10)
  const days = ["M", "T", "W", "T", "F", "S", "S"]
  
  return (
    <div className="mt-3 flex items-end justify-between gap-1 h-16 px-1">
      {data.map((value, i) => (
        <div key={i} className="flex flex-col items-center gap-1 flex-1">
          <div 
            className="w-full bg-primary/30 rounded-t-sm transition-all duration-500 hover:bg-primary/50"
            style={{ 
              height: `${(value / maxValue) * 100}%`,
              minHeight: value > 0 ? 4 : 2
            }}
          />
          <span className="text-[10px] text-muted-foreground">{days[i]}</span>
        </div>
      ))}
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
