import { PaintRoller, Trees, Wind, Building2, TrendingUp } from "lucide-react"
import {
  type Property,
  type Retrofit,
  formatCurrency,
  paybackYears,
  tenYearRoi,
} from "@/lib/properties"

const categoryIcon: Record<Retrofit["category"], typeof PaintRoller> = {
  roof: PaintRoller,
  landscape: Trees,
  hvac: Wind,
  envelope: Building2,
}

const categoryLabel: Record<Retrofit["category"], string> = {
  roof: "Roof",
  landscape: "Landscape",
  hvac: "HVAC",
  envelope: "Envelope",
}

export function RetrofitPanel({ property }: { property: Property }) {
  const payback = paybackYears(property.retrofitCost, property.projectedHvacSavings)
  const roi = tenYearRoi(property.retrofitCost, property.projectedHvacSavings)
  const totalHeatReduction = property.retrofits.reduce((sum, r) => sum + r.heatReduction, 0)
  const projectedScore = Math.max(0, property.heatScore - totalHeatReduction)

  return (
    <div className="space-y-4 border-t border-border bg-secondary/40 p-4">
      {/* ROI summary */}
      <div>
        <div className="mb-2 flex items-center gap-1.5">
          <TrendingUp className="h-3.5 w-3.5 text-primary" />
          <h4 className="text-xs font-semibold uppercase tracking-wide text-foreground">Projected HVAC ROI</h4>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          <Stat label="Annual savings" value={formatCurrency(property.projectedHvacSavings)} accent />
          <Stat label="Retrofit cost" value={formatCurrency(property.retrofitCost)} />
          <Stat label="Payback" value={`${payback.toFixed(1)} yrs`} />
          <Stat label="10-yr ROI" value={`${roi > 0 ? "+" : ""}${roi.toFixed(0)}%`} accent />
        </div>
        <div className="mt-3 rounded-md border border-border bg-card p-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Current cooling cost</span>
            <span className="font-mono tabular-nums text-foreground">
              {formatCurrency(property.currentHvacCost)}/yr
            </span>
          </div>
          <div className="mt-2 flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Projected Heat Score</span>
            <span className="font-mono tabular-nums font-semibold text-primary">
              {property.heatScore} → {projectedScore}
              <span className="ml-1 text-heat-mild">(-{totalHeatReduction})</span>
            </span>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div>
        <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-foreground">
          Automated retrofit recommendations
        </h4>
        <ul className="space-y-2">
          {property.retrofits.map((r) => {
            const Icon = categoryIcon[r.category]
            return (
              <li key={r.id} className="flex gap-3 rounded-md border border-border bg-card p-3">
                <div className="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-accent text-accent-foreground">
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-medium leading-snug text-foreground text-pretty">{r.title}</p>
                    <span className="shrink-0 rounded-full bg-heat-mild/15 px-2 py-0.5 text-[10px] font-medium text-heat-mild">
                      -{r.heatReduction} pts
                    </span>
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground text-pretty">{r.description}</p>
                  <div className="mt-2 flex items-center gap-3 text-[11px] text-muted-foreground">
                    <span className="rounded bg-secondary px-1.5 py-0.5 font-medium">{categoryLabel[r.category]}</span>
                    <span className="font-mono tabular-nums">{formatCurrency(r.cost)}</span>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}

function Stat({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="rounded-md border border-border bg-card p-2.5">
      <p className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className={`mt-0.5 font-mono text-sm font-semibold tabular-nums ${accent ? "text-primary" : "text-foreground"}`}>
        {value}
      </p>
    </div>
  )
}
