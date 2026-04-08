from fastapi import APIRouter
import json
import os

router = APIRouter()

# Exact absolute path based on confirmed project structure
DATA_FILE    = r"C:\PROJECTS\FLOW_PULSE\data\fdi_data.json"
SCHEMES_FILE = r"C:\PROJECTS\FLOW_PULSE\data\schemes.json"

def load_data():
    with open(DATA_FILE, "r", encoding="utf-8") as f:
        return json.load(f)

def load_schemes():
    with open(SCHEMES_FILE, "r", encoding="utf-8") as f:
        return json.load(f)

@router.get("/sectors")
def get_sectors():
    try:
        data = load_data()
        return data["sectors"]
    except Exception as e:
        return {"error": str(e)}

@router.get("/sectors/{sector_id}")
def get_sector(sector_id: str):
    try:
        data = load_data()
        for sector in data["sectors"]:
            if sector["id"] == sector_id:
                return sector
        return {"error": "Sector not found"}
    except Exception as e:
        return {"error": str(e)}

@router.post("/readiness-score")
def get_readiness_score(payload: dict):
    try:
        sector_id     = payload.get("sector", "ev")
        capital_lakhs = float(payload.get("capital_lakhs", 10))
        employees     = int(payload.get("employees", 5))

        data   = load_data()
        sector = next(
            (s for s in data["sectors"] if s["id"] == sector_id),
            data["sectors"][0]
        )

        capital_score     = min(capital_lakhs / 100 * 40, 40)
        employee_score    = min(employees / 50 * 20, 20)
        infra_score       = sector["infrastructure_score"] * 0.3
        volatility_penalty = sector["volatility"] * 10

        raw_score   = capital_score + employee_score + infra_score - volatility_penalty
        final_score = max(10, min(95, round(raw_score)))

        gaps = []
        if capital_lakhs < 25:
            gaps.append("Increase capital base — consider CGTMSE collateral-free loan")
        if employees < 10:
            gaps.append("Expand workforce — target 10+ for Tier 2 supplier qualification")
        if sector["volatility"] > 0.30:
            gaps.append("High market volatility — start with Tier 3 supply before moving up")

        schemes_data    = load_schemes()
        matched_schemes = [
            s for s in schemes_data["schemes"]
            if sector_id in s["sector"]
            and capital_lakhs / 100 >= s["min_investment_cr"]
        ]

        return {
            "score":            final_score,
            "sector":           sector["name"],
            "gaps":             gaps,
            "matched_schemes":  matched_schemes[:3],
            "recommended_tier": "Tier 2" if final_score >= 60 else "Tier 3",
            "top_actions":      sector["actions"][:3]
        }
    except Exception as e:
        return {"error": str(e)}

@router.get("/schemes/{sector_id}")
def get_schemes(sector_id: str):
    try:
        schemes_data = load_schemes()
        matched = [s for s in schemes_data["schemes"] if sector_id in s["sector"]]
        return matched
    except Exception as e:
        return {"error": str(e)}