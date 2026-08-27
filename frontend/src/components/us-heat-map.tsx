"use client"

import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps"
import { type Property, heatColorVar, heatTier } from "@/lib/properties"
import { cn } from "@/lib/utils"

const GEO_URL = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json"

export function UsHeatMap({
  properties,
  selectedId,
  onSelect,
}: {
  properties: Property[]
  selectedId: string | null
  onSelect: (id: string) => void
}) {
  return (
    <div className="relative h-full w-full">
      <ComposableMap
        projection="geoAlbersUsa"
        projectionConfig={{ scale: 1000 }}
        width={975}
        height={610}
        className="h-full w-full"
        aria-label="Map of the United States showing property heat scores"
      >
        <Geographies geography={GEO_URL}>
          {({ geographies }) =>
            geographies.map((geo) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                style={{
                  default: {
                    fill: "var(--secondary)",
                    stroke: "var(--border)",
                    strokeWidth: 0.75,
                    outline: "none",
                  },
                  hover: { fill: "var(--muted)", outline: "none" },
                  pressed: { fill: "var(--muted)", outline: "none" },
                }}
              />
            ))
          }
        </Geographies>

        {properties.map((p) => {
          const isSelected = p.id === selectedId
          const color = heatColorVar(p.heatScore)
          const r = isSelected ? 11 : 7
          return (
            <Marker
              key={p.id}
              coordinates={p.coordinates}
              onClick={() => onSelect(p.id)}
              className="cursor-pointer"
            >
              {isSelected && (
                <circle r={r + 8} fill={color} opacity={0.18}>
                  <animate attributeName="r" values={`${r + 4};${r + 12};${r + 4}`} dur="2s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.25;0;0.25" dur="2s" repeatCount="indefinite" />
                </circle>
              )}
              <circle
                r={r}
                fill={color}
                stroke="var(--card)"
                strokeWidth={isSelected ? 3 : 2}
                style={{ transition: "r 0.2s ease" }}
              />
              <text
                textAnchor="middle"
                y={r + 12}
                className="pointer-events-none font-mono text-[9px]"
                fill="var(--foreground)"
                style={{ fontWeight: 600 }}
              >
                {p.heatScore}
              </text>
            </Marker>
          )
        })}
      </ComposableMap>

      <MapLegend />
    </div>
  )
}

function MapLegend() {
  const tiers = [95, 78, 62, 47, 30]
  return (
    <div className="absolute bottom-4 left-4 rounded-lg border border-border bg-card/90 p-3 backdrop-blur">
      <p className="mb-2 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">Heat Score</p>
      <div className="flex items-center gap-2">
        <span className="text-[10px] text-muted-foreground">Low</span>
        <div className="flex overflow-hidden rounded-full">
          {tiers.map((t) => (
            <span key={t} className={cn("h-2.5 w-6")} style={{ backgroundColor: heatColorVar(t) }} />
          ))}
        </div>
        <span className="text-[10px] text-muted-foreground">Extreme</span>
      </div>
      <p className="mt-1.5 text-[10px] text-muted-foreground">
        {tiers.map((t) => heatTier(t).label).join(" · ")}
      </p>
    </div>
  )
}
