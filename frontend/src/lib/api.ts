export type AnalyzeResponse = {
  status: string
  heat_score: number
  building_coverage: number
  tree_coverage: number
  road_coverage: number
}

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:8000"

export async function fetchHeatScore(latitude: number, longitude: number): Promise<AnalyzeResponse> {
  const res = await fetch(`${API_BASE}/api/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ latitude, longitude }),
  })

  if (!res.ok) {
    const detail = await res.text()
    throw new Error(`analyze failed (${res.status}): ${detail}`)
  }

  return res.json()
}
