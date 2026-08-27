export type GeocodeResult = {
  latitude: number
  longitude: number
  displayName: string
}

export async function geocodeAddress(query: string): Promise<GeocodeResult> {
  const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(query)}`

  const res = await fetch(url, {
    headers: {
      // Nominatim's usage policy asks for a descriptive UA/referer identifying the app.
      "Accept-Language": "en",
    },
  })

  if (!res.ok) {
    throw new Error(`Geocoding failed (${res.status})`)
  }

  const results = await res.json()

  if (!Array.isArray(results) || results.length === 0) {
    throw new Error("No matching address found")
  }

  const first = results[0]
  return {
    latitude: parseFloat(first.lat),
    longitude: parseFloat(first.lon),
    displayName: first.display_name as string,
  }
}