"use client"

import { useEffect, useState } from "react"
import { properties as staticProperties, heatTier, type Property } from "@/lib/properties"
import { fetchHeatScore } from "@/lib/api"
import { DashboardHeader } from "@/components/dashboard-header"
import { PropertyList } from "@/components/property-list"
import { UsHeatMap } from "@/components/us-heat-map"
import { HeatScoreBadge } from "@/components/heat-score-badge"

export default function Page() {
  const [selectedId, setSelectedId] = useState<string | null>(staticProperties[0]?.id ?? null)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [liveScores, setLiveScores] = useState<Record<string, number>>({})
  const [loadingIds, setLoadingIds] = useState<Set<string>>(new Set(staticProperties.map((p) => p.id)))
  const [searchedProperties, setSearchedProperties] = useState<Property[]>([])
  useEffect(() => {
    let cancelled = false

    async function loadSequentially() {
      for (const p of staticProperties) {
        if (cancelled) break
        const [longitude, latitude] = p.coordinates
        try {
          const result = await fetchHeatScore(latitude, longitude)
          if (!cancelled) {
            setLiveScores((cur) => ({ ...cur, [p.id]: result.heat_score }))
          }
        } catch (err) {
          console.error(`Failed to fetch heat score for ${p.id}:`, err)
        } finally {
          if (!cancelled) {
            setLoadingIds((cur) => {
              const next = new Set(cur)
              next.delete(p.id)
              return next
            })
          }
        }
      }
    }

    loadSequentially()

    return () => {
      cancelled = true
    }
  }, [])

  const properties: Property[] = [
    ...searchedProperties,
    ...staticProperties.map((p) =>
      liveScores[p.id] !== undefined ? { ...p, heatScore: liveScores[p.id] } : p,
    ),
  ]

  const selected = properties.find((p) => p.id === selectedId) ?? null
  const selectedIsLoading = selectedId ? loadingIds.has(selectedId) : false

  function handleSelect(id: string) {
    setSelectedId(id)
    setExpandedId(id)
  }

  function handleToggleExpand(id: string) {
    setExpandedId((cur) => (cur === id ? null : id))
    setSelectedId(id)
  }
  function handleAddProperty(newProperty: Property) {
    setSearchedProperties((cur) => [newProperty, ...cur])
    setSelectedId(newProperty.id)
    setExpandedId(newProperty.id)
  }

  return (
    <div className="flex h-dvh flex-col bg-background">
      <DashboardHeader properties={properties} />

      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        <aside className="flex h-72 shrink-0 flex-col border-b border-border bg-sidebar lg:h-auto lg:w-[380px] lg:border-b-0 lg:border-r">
          <PropertyList
            properties={properties}
            selectedId={selectedId}
            expandedId={expandedId}
            onSelect={handleSelect}
            onToggleExpand={handleToggleExpand}
            onAddProperty={handleAddProperty}
          />
        </aside>

        <main className="relative min-h-0 flex-1 overflow-hidden bg-secondary/30">
          <UsHeatMap properties={properties} selectedId={selectedId} onSelect={handleSelect} />

          {selected && (
            <div className="pointer-events-none absolute right-4 top-4 w-64 rounded-lg border border-border bg-card/95 p-4 shadow-lg backdrop-blur">
              <div className="flex items-center gap-3">
                <HeatScoreBadge score={selected.heatScore} size="md" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-foreground">{selected.address}</p>
                  <p className="text-xs text-muted-foreground">
                    {selected.city}
                    {selected.city && selected.state ? ", " : ""}
                    {selected.state}
                  </p>
                  <p className="mt-1 text-[11px] text-muted-foreground">
                    {selectedIsLoading ? "Fetching live satellite data…" : `${heatTier(selected.heatScore).label} heat exposure`}
                  </p>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
