import { Thermometer } from "lucide-react"
import { type Property, formatCurrency } from "@/lib/properties"

export function DashboardHeader({ properties }: { properties: Property[] }) {
  const count = properties.length
  const avgHeat = Math.round(properties.reduce((s, p) => s + p.heatScore, 0) / count)
  const totalSavings = properties.reduce((s, p) => s + p.projectedHvacSavings, 0)
  const highRisk = properties.filter((p) => p.heatScore >= 70).length

  return (
    <header className="flex flex-wrap items-center justify-between gap-4 border-b border-border bg-card px-4 py-3">
      <div className="flex items-center gap-3">
        <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary text-primary-foreground">
          <Thermometer className="h-5 w-5" aria-hidden="true" />
        </div>
        <div>
          <h1 className="text-base font-semibold leading-tight text-foreground">Cool Scope</h1>
          <p className="text-xs text-muted-foreground">Urban heat &amp; cooling retrofit intelligence</p>
        </div>
      </div>

      <dl className="flex flex-wrap items-center gap-x-6 gap-y-2">
        <Kpi label="Properties" value={String(count)} />
        <Kpi label="Avg Heat Score" value={String(avgHeat)} accent />
        <Kpi label="High-risk assets" value={String(highRisk)} />
        <Kpi label="Projected annual savings" value={formatCurrency(totalSavings)} accent />
      </dl>
    </header>
  )
}

function Kpi({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="text-right">
      <dt className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</dt>
      <dd className={`font-mono text-lg font-semibold tabular-nums ${accent ? "text-primary" : "text-foreground"}`}>
        {value}
      </dd>
    </div>
  )
}
