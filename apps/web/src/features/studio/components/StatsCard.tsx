interface StatsCardProps {
  label: string
  value: number
  icon: React.ReactNode
}

export function StatsCard({ label, value, icon }: StatsCardProps) {
  return (
    <div className="rounded-xl bg-card/50 p-4 ring-1 ring-border">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-muted-foreground">
          {icon}
          <span className="text-sm">{label}</span>
        </div>
        <span className="text-lg font-semibold">{value}</span>
      </div>
      <div className="mt-4 flex h-24 items-center justify-center rounded-lg bg-muted/50 text-sm text-muted-foreground">
        No data
      </div>
    </div>
  )
}
