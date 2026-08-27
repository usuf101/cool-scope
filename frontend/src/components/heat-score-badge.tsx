import { heatTier, heatColorVar } from "@/lib/properties"
import { cn } from "@/lib/utils"

type Size = "sm" | "md" | "lg"

const sizeMap: Record<Size, { box: string; score: string; label: string; ring: number }> = {
  sm: { box: "h-11 w-11", score: "text-sm", label: "text-[9px]", ring: 3 },
  md: { box: "h-14 w-14", score: "text-lg", label: "text-[10px]", ring: 4 },
  lg: { box: "h-20 w-20", score: "text-3xl", label: "text-[11px]", ring: 5 },
}

export function HeatScoreBadge({
  score,
  size = "md",
  showLabel = true,
  className,
}: {
  score: number
  size?: Size
  showLabel?: boolean
  className?: string
}) {
  const tier = heatTier(score)
  const color = heatColorVar(score)
  const s = sizeMap[size]

  return (
    <div className={cn("flex flex-col items-center gap-1", className)}>
      <div
        className={cn("relative grid place-items-center rounded-full", s.box)}
        style={{
          background: `conic-gradient(${color} ${score * 3.6}deg, var(--muted) 0deg)`,
        }}
        role="img"
        aria-label={`Heat Score ${score} out of 100, ${tier.label}`}
      >
        <div
          className="absolute inset-0 grid place-items-center rounded-full bg-card"
          style={{ margin: s.ring }}
        >
          <span className={cn("font-mono font-semibold tabular-nums text-card-foreground", s.score)}>{score}</span>
        </div>
      </div>
      {showLabel && (
        <span
          className={cn(
            "rounded-full px-2 py-0.5 font-medium uppercase tracking-wide text-primary-foreground",
            s.label,
          )}
          style={{ backgroundColor: color }}
        >
          {tier.label}
        </span>
      )}
    </div>
  )
}
