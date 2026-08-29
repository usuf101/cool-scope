"""Cool Scope — FortyGuard satellite fetch via FastAPI.

This wraps the FortyGuard API polling into a web server endpoint (/api/analyze)
so the React frontend can consume it.
"""

from __future__ import annotations

import os
import time
from datetime import datetime

import requests
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

load_dotenv()

API_KEY = os.getenv("FORTYGUARD_API_KEY")
BASE_URL = (os.getenv("FORTYGUARD_BASE_URL") or "https://api.fortyguard.com").rstrip("/")
HEADERS = {"api-key": API_KEY, "Content-Type": "application/json"}

_SUCCESS = {"succeeded", "completed"}
_FAILURE = {"failed", "error"}

ROOF_CLASS_HINTS = ("building", "roof")
CANOPY_CLASS_HINTS = ("tree", "canopy", "plant")
ROAD_CLASS_HINTS = ("road", "route", "highway", "street", "pavement", "parking", "sidewalk")

# ==========================================
# 1. Initialize FastAPI
# ==========================================
app = FastAPI(title="Cool Scope API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class LocationRequest(BaseModel):
    latitude: float
    longitude: float

class FortyGuardRequestError(RuntimeError):
    """Raised when submit or poll returns a non-recoverable API error."""

# ==========================================
# 2. Helper Functions
# ==========================================
def _parse_json(resp: requests.Response) -> dict:
    try:
        body = resp.json()
    except ValueError as exc:
        raise FortyGuardRequestError(f"Non-JSON response HTTP {resp.status_code}") from exc
    return body if isinstance(body, dict) else {"value": body}

def extract_activity_id(submit_body: dict) -> str | None:
    data = submit_body.get("data")
    if isinstance(data, dict) and data.get("activity_id"):
        return str(data["activity_id"])
    if submit_body.get("activity_id"):
        return str(submit_body["activity_id"])
    return None

def unwrap_status_payload(body: dict) -> dict:
    if isinstance(body.get("data"), dict):
        return body["data"]
    return body

# ==========================================
# 3. Core API Logic
# ==========================================
def submit_satellite(payload: dict) -> str:
    url = f"{BASE_URL}/v1/satellite"
    resp = requests.post(url, headers=HEADERS, json=payload, timeout=60)
    body = _parse_json(resp)
    if resp.status_code not in (200, 202) or body.get("error"):
        raise FortyGuardRequestError(f"POST /v1/satellite failed: {resp.status_code}")

    activity_id = extract_activity_id(body)
    if not activity_id:
        raise FortyGuardRequestError("No activity_id in submit response")
    return activity_id

def poll_status(activity_id: str, poll_interval: float = 3.0, timeout: float = 240.0) -> dict:
    url = f"{BASE_URL}/v1/status/{activity_id}"
    deadline = time.monotonic() + timeout

    while time.monotonic() < deadline:
        resp = requests.get(url, headers=HEADERS, timeout=60)
        if resp.status_code == 404:
            time.sleep(poll_interval)
            continue

        body = _parse_json(resp)
        if not resp.ok or body.get("error"):
            raise FortyGuardRequestError(
                f"GET /v1/status/{activity_id} failed: HTTP {resp.status_code} — {body}"
            )

        data = unwrap_status_payload(body)
        status = str(data.get("status") or body.get("status") or "").lower()

        if status in _SUCCESS:
            result = data.get("result")
            if result is None:
                result = {k: v for k, v in data.items() if k not in {"status", "message"}}
            return result

        if status in _FAILURE:
            raise FortyGuardRequestError(f"Activity failed: {data.get('message') or status}")

        print(f"[poll_status] {activity_id}: status={status!r}, waiting...")
        time.sleep(poll_interval)

    raise FortyGuardRequestError(f"Activity did not complete within {timeout}s")

def extract_segmentation(result: dict) -> dict:
    seg = result.get("segmentation") or {}
    segments = seg.get("segments") or {}

    def _coverage(hints: tuple[str, ...]) -> float:
        total = 0.0
        for name, pct in segments.items():
            key = str(name).lower()
            if any(h in key for h in hints):
                try: total += float(pct)
                except (TypeError, ValueError): continue
        return total

    building_and_road = _coverage(ROOF_CLASS_HINTS) + _coverage(ROAD_CLASS_HINTS)
    tree = _coverage(CANOPY_CLASS_HINTS)
    others = _coverage(("others",))

    if building_and_road == 0 and others > 0:
        building_and_road = others

    return {
        "roof_coverage_pct": building_and_road,
        "canopy_coverage_pct": tree,
        "road_coverage_pct": 0.0,
    }

# ==========================================
# 4. The FastAPI Endpoint
# ==========================================
@app.post("/api/analyze")
def analyze_endpoint(req: LocationRequest):
    if not API_KEY:
        raise HTTPException(status_code=500, detail="FORTYGUARD_API_KEY is not set.")

    try:
        payload = {
            "sat": {"latitude": req.latitude, "longitude": req.longitude},
            "date_time": {
                "start_date": datetime.now().strftime("%Y-%m-%d"),
                "start_time": "14:00",
                "filter_type": 1,
            },
            "granularity": 80,
        }

        activity_id = submit_satellite(payload)
        result = poll_status(activity_id)

        parsed = extract_segmentation(result)
        building = parsed["roof_coverage_pct"]
        tree = parsed["canopy_coverage_pct"]
        road = parsed["road_coverage_pct"]

        impervious_score = (building * 0.65) + (road * 0.35)
        cooling_offset = tree * 0.5

        heat_score = impervious_score - cooling_offset
        heat_score = max(0, min(100, heat_score))

        return {
            "status": "success",
            "heat_score": round(heat_score, 1),
            "building_coverage": building,
            "tree_coverage": tree,
            "road_coverage": road,
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))