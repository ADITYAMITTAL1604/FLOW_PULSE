from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.copilot import router as copilot_router
from routes.opportunity import router as opportunity_router
import os

app = FastAPI(title="FlowPulse API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(copilot_router, prefix="/api")
app.include_router(opportunity_router, prefix="/api")

@app.get("/")
def root():
    base = os.path.dirname(os.path.abspath(__file__))
    data_path = os.path.join(os.path.dirname(base), "data", "fdi_data.json")
    return {
        "status": "FlowPulse API running",
        "base_dir": base,
        "data_path": data_path,
        "data_exists": os.path.exists(data_path)
    }

@app.get("/debug")
def debug():
    base = os.path.dirname(os.path.abspath(__file__))
    parent = os.path.dirname(base)
    return {
        "backend_dir": base,
        "parent_dir": parent,
        "parent_contents": os.listdir(parent),
    }