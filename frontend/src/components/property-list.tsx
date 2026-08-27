"use client"

import { useMemo, useState } from "react"
import { ArrowUpDown, Loader2, Search } from "lucide-react"
import { type Property } from "@/lib/properties"
import { PropertyCard } from "@/components/property-card"
import { geocodeAddress } from "@/lib/geocode"
import { fetchHeatScore } from "@/lib/api"

type SortKey = "heat" | "savings" | "price"

export function PropertyList({
  properties,
  selectedId,
  expandedId,
  onSelect,
  onToggleExpand,
  onAddProperty,
}: {
  properties: Property[]
  selectedId: string | null
  expandedId: string | null
  onSelect: (id: string) => void
  onToggleExpand: (id: string) => void
  onAddProperty: (property: Property) => void
}) {
  const [query, setQuery] = useState("")
  const [sort, setSort] = useState<SortKey>("heat")
  const [isSearching, setIsSearching] = useState(false)
  const [searchError, setSearchError] = useState<string | null>(null)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    const list = properties.filter(
      (p) =>
        !q ||
        p.address.toLowerCase().includes(q) ||
        p.city.toLowerCase().includes(q) ||
        p.state.toLowerCase().includes(q),
    )
    return [...list].sort((a, b) => {
      if (sort === "heat") return b.heatScore - a.heatScore
      if (sort === "savings") return b.projectedHvacSavings - a.projectedHvacSavings
      return b.price - a.price
    })
  }, [properties, query, sort])

  // If the typed query doesn't match anything already in the list, offer to look it up.
  const hasLocalMatches = filtered.length > 0
  const trimmedQuery = query.trim()

  async function handleSearchNewAddress() {
    if (!trimmedQuery || isSearching) return
    setIsSearching(true)
    setSearchError(null)

    try {
      const geo = await geocodeAddress(trimmedQuery)
      const analysis = await fetchHeatScore(geo.latitude, geo.longitude)

      const parts = geo.displayName.split(",").map((s) => s.trim())
      const address = parts[0] ?? trimmedQuery
      const city = parts[1] ?? ""
      const state = parts[parts.length - 2] ?? ""

      const newProperty: Property = {
        id: `search-${Date.now()}`,
        address,
        city,
        state,
        coordinates: [geo.longitude, geo.latitude],
        heatScore: analysis.heat_score,
        price: 0,
        sqft: 0,
        type: "Custom lookup",
        currentHvacCost: 0,
        projectedHvacSavings: 0,
        retrofitCost: 0,
        retrofits: [],
        isSearchResult: true,
      }

      onAddProperty(newProperty)
      setQuery("")
    } catch (err) {
      setSearchError(err instanceof Error ? err.message : "Search failed")
    } finally {
      setIsSearching(false)
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    handleSearchNewAddress()
  }

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-border p-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-foreground">Portfolio</h2>
            <p className="text-xs text-muted-foreground">{filtered.length} properties analyzed</p>
          </div>
          <div className="flex items-center gap-1 rounded-md border border-border bg-card p-0.5">
            {(["heat", "savings", "price"] as SortKey[]).map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => setSort(key)}
                className={`rounded px-2 py-1 text-[11px] font-medium capitalize transition-colors ${
                  sort === key ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {key}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="relative mt-3">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setSearchError(null)
            }}
            placeholder="Search by address or city…"
            className="w-full rounded-md border border-input bg-card py-2 pl-8 pr-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Search properties"
            disabled={isSearching}
          />
          {isSearching && (
            <Loader2 className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 animate-spin text-muted-foreground" />
          )}
        </form>

        {/* Offer a live lookup only when the query doesn't already match a known property */}
        {trimmedQuery && !hasLocalMatches && !isSearching && (
          <button
            type="button"
            onClick={handleSearchNewAddress}
            className="mt-2 w-full rounded-md border border-dashed border-primary/40 px-3 py-2 text-left text-xs font-medium text-primary transition-colors hover:bg-accent"
          >
            Analyze &ldquo;{trimmedQuery}&rdquo; with live satellite data →
          </button>
        )}

        {isSearching && (
          <p className="mt-2 flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <Loader2 className="h-3 w-3 animate-spin" />
            Looking up address and fetching Heat Score…
          </p>
        )}

        {searchError && (
          <p className="mt-2 text-[11px] text-destructive">{searchError}</p>
        )}

        <div className="mt-2 flex items-center gap-1 text-[11px] text-muted-foreground">
          <ArrowUpDown className="h-3 w-3" aria-hidden="true" />
          Sorted by {sort === "heat" ? "highest Heat Score" : sort === "savings" ? "projected savings" : "price"}
        </div>
      </div>

      <div className="flex-1 space-y-2 overflow-y-auto p-3">
        {filtered.map((p) => (
          <PropertyCard
            key={p.id}
            property={p}
            isSelected={p.id === selectedId}
            isExpanded={p.id === expandedId}
            onSelect={() => onSelect(p.id)}
            onToggleExpand={() => onToggleExpand(p.id)}
          />
        ))}
        {filtered.length === 0 && !trimmedQuery && (
          <p className="py-8 text-center text-sm text-muted-foreground">No properties match your search.</p>
        )}
      </div>
    </div>
  )
}