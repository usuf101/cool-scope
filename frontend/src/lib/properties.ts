export type Retrofit = {
  id: string
  title: string
  description: string
  heatReduction: number // points off the Heat Score
  cost: number
  category: "roof" | "landscape" | "hvac" | "envelope"
}

export type Property = {
  id: string
  address: string
  city: string
  state: string
  coordinates: [number, number] // [longitude, latitude]
  heatScore: number // 0-100
  price: number
  sqft: number
  type: string
  currentHvacCost: number
  projectedHvacSavings: number
  retrofitCost: number
  retrofits: Retrofit[]
  isSearchResult?: boolean // true for properties added via address search
}

export const properties: Property[] = [
  {
    id: "phx-01",
    address: "2288 E Camelback Rd",
    city: "Phoenix",
    state: "AZ",
    coordinates: [-112.074, 33.509],
    heatScore: 94,
    price: 1240000,
    sqft: 4200,
    type: "Mixed-use retail",
    currentHvacCost: 38400,
    projectedHvacSavings: 14600,
    retrofitCost: 61000,
    retrofits: [
      {
        id: "r1",
        title: "Cool roof coating (high-albedo white)",
        description:
          "Apply reflective white membrane to the 6,800 sq ft flat roof to cut solar heat gain by up to 35%.",
        heatReduction: 11,
        cost: 27000,
        category: "roof",
      },
      {
        id: "r2",
        title: "Plant 14 desert shade trees",
        description:
          "Native mesquite and palo verde along the south and west facades to shade glazing and paved lots.",
        heatReduction: 6,
        cost: 9000,
        category: "landscape",
      },
      {
        id: "r3",
        title: "Variable-speed HVAC + economizer",
        description:
          "Replace aging RTUs with high-SEER variable-speed units and add an economizer for free cooling.",
        heatReduction: 4,
        cost: 25000,
        category: "hvac",
      },
    ],
  },
  {
    id: "lv-01",
    address: "701 S Las Vegas Blvd",
    city: "Las Vegas",
    state: "NV",
    coordinates: [-115.156, 36.16],
    heatScore: 88,
    price: 2100000,
    sqft: 7600,
    type: "Hospitality",
    currentHvacCost: 62000,
    projectedHvacSavings: 21800,
    retrofitCost: 88000,
    retrofits: [
      {
        id: "r1",
        title: "Cool roof coating (high-albedo white)",
        description: "Reflective coating across the roof deck to lower rooftop surface temps by 50-60°F at peak.",
        heatReduction: 10,
        cost: 34000,
        category: "roof",
      },
      {
        id: "r2",
        title: "Low-e window film retrofit",
        description: "Spectrally selective film on west-facing curtain wall to reject 78% of solar heat.",
        heatReduction: 7,
        cost: 19000,
        category: "envelope",
      },
      {
        id: "r3",
        title: "Chiller plant optimization",
        description: "Add demand-based control sequencing and VFDs to the central chiller plant.",
        heatReduction: 5,
        cost: 35000,
        category: "hvac",
      },
    ],
  },
  {
    id: "hou-01",
    address: "1400 Smith St",
    city: "Houston",
    state: "TX",
    coordinates: [-95.369, 29.758],
    heatScore: 81,
    price: 3450000,
    sqft: 12400,
    type: "Class A office",
    currentHvacCost: 96000,
    projectedHvacSavings: 28400,
    retrofitCost: 112000,
    retrofits: [
      {
        id: "r1",
        title: "Green roof + reflective pavers",
        description: "Convert 40% of the roof to a planted assembly with reflective pavers on the remainder.",
        heatReduction: 9,
        cost: 58000,
        category: "roof",
      },
      {
        id: "r2",
        title: "Plant 22 canopy shade trees",
        description: "Live oak canopy across the surface parking to reduce ground-level radiant heat.",
        heatReduction: 5,
        cost: 16000,
        category: "landscape",
      },
      {
        id: "r3",
        title: "Smart BAS zoning upgrade",
        description: "Retrofit building automation with occupancy-based zoning and setpoint scheduling.",
        heatReduction: 4,
        cost: 38000,
        category: "hvac",
      },
    ],
  },
  {
    id: "mia-01",
    address: "1101 Brickell Ave",
    city: "Miami",
    state: "FL",
    coordinates: [-80.192, 25.761],
    heatScore: 76,
    price: 5200000,
    sqft: 18900,
    type: "Class A office",
    currentHvacCost: 142000,
    projectedHvacSavings: 39600,
    retrofitCost: 158000,
    retrofits: [
      {
        id: "r1",
        title: "Cool roof + solar-reflective paint",
        description: "White elastomeric coating rated at 0.87 solar reflectance across the tower roof.",
        heatReduction: 8,
        cost: 47000,
        category: "roof",
      },
      {
        id: "r2",
        title: "Exterior shading fins",
        description: "Horizontal aluminum shading on east and west elevations to cut peak cooling load.",
        heatReduction: 6,
        cost: 71000,
        category: "envelope",
      },
      {
        id: "r3",
        title: "High-efficiency water-cooled chillers",
        description: "Replace with magnetic-bearing chillers at 0.32 kW/ton.",
        heatReduction: 5,
        cost: 40000,
        category: "hvac",
      },
    ],
  },
  {
    id: "atl-01",
    address: "191 Peachtree St NE",
    city: "Atlanta",
    state: "GA",
    coordinates: [-84.387, 33.759],
    heatScore: 68,
    price: 2850000,
    sqft: 9800,
    type: "Class B office",
    currentHvacCost: 71000,
    projectedHvacSavings: 18200,
    retrofitCost: 84000,
    retrofits: [
      {
        id: "r1",
        title: "Reflective roof recoat",
        description: "Recoat the built-up roof with a white acrylic system to raise reflectance to 0.82.",
        heatReduction: 7,
        cost: 29000,
        category: "roof",
      },
      {
        id: "r2",
        title: "Plant 18 street trees",
        description: "Willow oak along the plaza and drop-off to shade hardscape and entries.",
        heatReduction: 5,
        cost: 13000,
        category: "landscape",
      },
      {
        id: "r3",
        title: "Economizer + demand control ventilation",
        description: "Add air-side economizers and CO2-based ventilation to existing AHUs.",
        heatReduction: 3,
        cost: 42000,
        category: "hvac",
      },
    ],
  },
  {
    id: "den-01",
    address: "1601 Wewatta St",
    city: "Denver",
    state: "CO",
    coordinates: [-105.001, 39.752],
    heatScore: 54,
    price: 1980000,
    sqft: 8100,
    type: "Creative office",
    currentHvacCost: 44000,
    projectedHvacSavings: 9800,
    retrofitCost: 52000,
    retrofits: [
      {
        id: "r1",
        title: "Cool roof recoat",
        description: "Reflective coating to reduce summer peak rooftop temps and shoulder-season load.",
        heatReduction: 6,
        cost: 21000,
        category: "roof",
      },
      {
        id: "r2",
        title: "Plant 10 shade trees",
        description: "Deciduous canopy on the west facade for summer shade and winter solar gain.",
        heatReduction: 4,
        cost: 8000,
        category: "landscape",
      },
      {
        id: "r3",
        title: "Rooftop unit tune-up + controls",
        description: "Recommission RTUs and add smart thermostats with scheduling.",
        heatReduction: 3,
        cost: 23000,
        category: "hvac",
      },
    ],
  },
  {
    id: "sea-01",
    address: "400 Fairview Ave N",
    city: "Seattle",
    state: "WA",
    coordinates: [-122.333, 47.622],
    heatScore: 41,
    price: 3100000,
    sqft: 11200,
    type: "Tech office",
    currentHvacCost: 39000,
    projectedHvacSavings: 7200,
    retrofitCost: 46000,
    retrofits: [
      {
        id: "r1",
        title: "Partial green roof",
        description: "Extensive sedum roof over the amenity deck to buffer summer heat and manage stormwater.",
        heatReduction: 5,
        cost: 28000,
        category: "roof",
      },
      {
        id: "r2",
        title: "Plant 12 native trees",
        description: "Vine maple and Douglas fir screening on the south courtyard.",
        heatReduction: 3,
        cost: 10000,
        category: "landscape",
      },
      {
        id: "r3",
        title: "Heat-pump changeover",
        description: "Swap electric resistance zones for high-efficiency heat pumps.",
        heatReduction: 2,
        cost: 8000,
        category: "hvac",
      },
    ],
  },
  {
    id: "sac-01",
    address: "500 Capitol Mall",
    city: "Sacramento",
    state: "CA",
    coordinates: [-121.503, 38.579],
    heatScore: 72,
    price: 2670000,
    sqft: 10400,
    type: "Government office",
    currentHvacCost: 68000,
    projectedHvacSavings: 19400,
    retrofitCost: 79000,
    retrofits: [
      {
        id: "r1",
        title: "High-albedo roof membrane",
        description: "Replace dark membrane with a white TPO roof at 0.79 reflectance.",
        heatReduction: 8,
        cost: 41000,
        category: "roof",
      },
      {
        id: "r2",
        title: "Plant 16 shade trees",
        description: "Valley oak canopy across the mall frontage and parking.",
        heatReduction: 5,
        cost: 12000,
        category: "landscape",
      },
      {
        id: "r3",
        title: "VAV retrofit + economizer",
        description: "Convert constant-volume AHUs to VAV with integrated economizers.",
        heatReduction: 4,
        cost: 26000,
        category: "hvac",
      },
    ],
  },
]

export type HeatTier = {
  label: string
  token: string // css var token name
  className: string
}

export function heatTier(score: number): HeatTier {
  if (score >= 85) return { label: "Extreme", token: "heat-extreme", className: "bg-heat-extreme" }
  if (score >= 70) return { label: "High", token: "heat-hot", className: "bg-heat-hot" }
  if (score >= 55) return { label: "Elevated", token: "heat-warm", className: "bg-heat-warm" }
  if (score >= 40) return { label: "Moderate", token: "heat-mild", className: "bg-heat-mild" }
  return { label: "Low", token: "heat-cool", className: "bg-heat-cool" }
}

export function heatColorVar(score: number): string {
  return `var(--${heatTier(score).token})`
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value)
}

export function paybackYears(retrofitCost: number, annualSavings: number): number {
  if (annualSavings <= 0) return 0
  return retrofitCost / annualSavings
}

export function tenYearRoi(retrofitCost: number, annualSavings: number): number {
  if (retrofitCost <= 0) return 0
  return ((annualSavings * 10 - retrofitCost) / retrofitCost) * 100
}
