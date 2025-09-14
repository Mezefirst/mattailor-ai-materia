"""
MatTailor AI Backend - FastAPI Application
"""
import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn

# Initialize FastAPI app
app = FastAPI(
    title="MatTailor AI API",
    description="Intelligent Material Discovery Platform API",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS middleware
origins = os.getenv("CORS_ORIGINS", "http://localhost:3000,http://localhost:5173").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "MatTailor AI API",
        "version": "1.0.0",
        "status": "running",
        "environment": os.getenv("ENVIRONMENT", "development")
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "mattailor-ai-backend"}

@app.get("/api/materials")
async def get_materials():
    """Get materials from database"""
    # Placeholder implementation
    return {
        "materials": [],
        "count": 0,
        "message": "Materials endpoint - implementation needed"
    }

@app.post("/api/recommend")
async def recommend_materials(query: dict):
    """Recommend materials based on requirements"""
    # Placeholder implementation
    return {
        "recommendations": [],
        "query": query,
        "message": "Recommendation endpoint - implementation needed"
    }

@app.get("/api/materials-project/{material_id}")
async def get_material_from_mp(material_id: str):
    """Get material data from Materials Project API"""
    api_key = os.getenv("MP_API_KEY")
    if not api_key:
        raise HTTPException(status_code=503, detail="Materials Project API key not configured")
    
    # Placeholder implementation
    return {
        "material_id": material_id,
        "data": {},
        "source": "Materials Project",
        "message": "Materials Project integration - implementation needed"
    }

@app.get("/api/matweb/{material_name}")
async def get_material_from_matweb(material_name: str):
    """Get material data from MatWeb API"""
    api_key = os.getenv("MATWEBAPI_KEY")
    if not api_key:
        raise HTTPException(status_code=503, detail="MatWeb API key not configured")
    
    # Placeholder implementation
    return {
        "material_name": material_name,
        "data": {},
        "source": "MatWeb",
        "message": "MatWeb integration - implementation needed"
    }

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    reload = os.getenv("RELOAD", "false").lower() == "true"
    
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=port,
        reload=reload
    )