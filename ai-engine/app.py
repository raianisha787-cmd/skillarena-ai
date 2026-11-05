"""
SkillArena AI - FastAPI REST Microservice
Provides intelligent skill analysis and recommendation endpoints.
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Dict, List, Optional, Any
from engine import SkillGapAnalyzer, AdaptiveRoadmapGenerator, ROLE_BENCHMARKS

app = FastAPI(
    title="SkillArena AI - Analytical Intelligence Microservice",
    description="Cognitive skill gap diagnostic and personalized curriculum synthesis engine.",
    version="1.0.0"
)

# Enable CORS for Spring Boot backend and local web clients
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class EvaluationRequest(BaseModel):
    user_id: Optional[int] = 1
    target_role: Optional[str] = "Full-Stack Software Engineer"
    scores: Dict[str, float] = Field(
        default={
            "Data Structures & Algorithms": 70.0,
            "Java & Spring Boot Ecosystem": 62.0,
            "Relational Databases & SQL Optimization": 82.0,
            "Frontend Architecture & React.js": 58.0,
            "Cloud & DevOps (Docker/CI-CD)": 45.0,
            "AI/ML & Python Foundations": 60.0
        }
    )

class EvaluationResponse(BaseModel):
    target_role: str
    overall_readiness: float
    campus_percentile: float
    placement_probability_pct: float
    strengths: List[str]
    critical_gaps: List[str]
    domain_breakdown: List[Dict[str, Any]]
    personalized_roadmap: List[Dict[str, Any]]

@app.get("/")
def root():
    return {
        "service": "SkillArena AI Microservice",
        "status": "ONLINE",
        "version": "1.0.0",
        "supported_roles": list(ROLE_BENCHMARKS.keys())
    }

@app.get("/api/ai/health")
def health():
    return {"status": "HEALTHY", "engine": "ACTIVE"}

@app.post("/api/ai/diagnose", response_model=EvaluationResponse)
def diagnose_skills(payload: EvaluationRequest):
    try:
        analyzer = SkillGapAnalyzer(target_role=payload.target_role or "Full-Stack Software Engineer")
        evaluation = analyzer.evaluate(payload.scores)
        roadmap = AdaptiveRoadmapGenerator.generate_roadmap(evaluation)
        
        return {
            **evaluation,
            "personalized_roadmap": roadmap
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)
