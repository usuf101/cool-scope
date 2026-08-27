"use client"

import { ChevronDown, MapPin, Maximize2 } from "lucide-react"
import { type Property, formatCurrency } from "@/lib/properties"
import { HeatScoreBadge } from "@/components/heat-score-badge"
import { RetrofitPanel } from "@/components/retrofit-panel"
import { cn } from "@/lib/utils"

export function PropertyCard({
  property,
  isSelected,
  isExpanded,
  onSelect,
  onToggleExpand,
}: {
  property: Property
  isSelected: boolean
  isExpanded: boolean
  onSelect: () => void
  onToggleExpand: () => void
}) {
  const hasListingData = !property.isSearchResult && (property.price > 0 || property.sqft > 0)
  const hasRetrofits = property.retrofits.length > 0

  return (
    <article
      className={cn(
        "overflow-hidden rounded-lg border bg-card transition-colors",
        isSelected ? "border-primary ring-1 ring-primary" : "border-border hover:border-primary/40",
      )}
    >
      <button
        type="button"
        onClick={onSelect}
        className="flex w-full items-center gap-3 p-3 text-left"
        aria-pressed={isSelected}
      >
        <HeatScoreBadge score={property.heatScore} size="sm" showLabel={false} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <h3 className="truncate text-sm font-semibold text-foreground">{property.address}</h3>
            {property.isSearchResult && (
              <span className="shrink-0 rounded-full bg-accent px-1.5 py-0.5 text-[9px] font-medium uppercase tracking-wide text-accent-foreground">
                Live lookup
              </span>
            )}
          </div>
          <p className="flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3 shrink-0" aria-hidden="true" />
            <span className="truncate">
              {property.city}
              {property.city && property.state ? ", " : ""}
              {property.state}
            </span>
          </p>
          {hasListingData && (
            <div className="mt-1 flex items-center gap-2 text-[11px] text-muted-foreground">
              <span className="font-mono tabular-nums text-foreground">{formatCurrency(property.price)}</span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-0.5">
                <Maximize2 className="h-2.5 w-2.5" aria-hidden="true" />
                {property.sqft.toLocaleString()} ft²
              </span>
            </div>
          )}
        </div>
      </button>

      <div className="flex items-center justify-between border-t border-border px-3 py-1.5">
        <span className="text-[11px] text-muted-foreground">{property.type}</span>
        <button
          type="button"
          onClick={onToggleExpand}
          className="flex items-center gap-1 rounded px-1.5 py-0.5 text-[11px] font-medium text-primary transition-colors hover:bg-accent"
          aria-expanded={isExpanded}
          aria-label={isExpanded ? "Hide details" : "Show heat analysis details"}
        >
          {isExpanded ? "Hide analysis" : hasRetrofits ? "View ROI & retrofits" : "View heat analysis"}
          <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", isExpanded && "rotate-180")} />
        </button>
      </div>

      {isExpanded && (
        hasRetrofits ? (
          <RetrofitPanel property={property} />
        ) : (
          <div className="border-t border-border bg-secondary/30 px-3 py-4 text-center text-xs text-muted-foreground">
            No retrofit data available for this location yet. Heat Score is based on live satellite land-cover
            analysis (building, tree, and road coverage).
          </div>
        )
      )}
    </article>
  )
}