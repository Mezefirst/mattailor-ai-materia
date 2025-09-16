"""
MatTailor AI Backend - FastAPI Application
"""
import os
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from typing import Optional, List, Dict, Any
import uvicorn

# Import services
from services.database import MaterialDatabase
from services.recommender import MaterialRecommender
from models.material import MaterialQuery, Requirements

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

# Initialize services
material_db = MaterialDatabase()
recommender = MaterialRecommender()

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "MatTailor AI API",
        "version": "1.0.0",
        "status": "running",
        "environment": os.getenv("ENVIRONMENT", "development"),
        "features": {
            "local_database": True,
            "material_recommendation": True,
            "property_simulation": True,
            "external_apis": {
                "matweb": bool(os.getenv("MATWEBAPI_KEY")),
                "materials_project": bool(os.getenv("MP_API_KEY"))
            }
        }
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy", 
        "service": "mattailor-ai-backend",
        "database_materials": len(material_db.materials),
        "database_suppliers": len(material_db.suppliers)
    }

@app.get("/api/materials")
async def get_materials(
    category: Optional[str] = Query(None, description="Filter by material category"),
    limit: int = Query(50, description="Maximum number of results")
):
    """Get materials from local database"""
    try:
        filters = {}
        if category:
            filters['category'] = category
        
        materials = await material_db.query_materials(filters)
        limited_materials = materials[:limit]
        
        return {
            "materials": [material.dict() for material in limited_materials],
            "count": len(limited_materials),
            "total_available": len(materials),
            "source": "Local Database"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch materials: {str(e)}")

@app.post("/api/recommend")
async def recommend_materials(query: MaterialQuery):
    """Recommend materials based on requirements"""
    try:
        result = await recommender.recommend(query)
        return result.dict()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Recommendation failed: {str(e)}")

@app.get("/api/materials/{material_id}")
async def get_material_by_id(material_id: str):
    """Get specific material by ID"""
    try:
        material = await material_db.get_material_by_id(material_id)
        if not material:
            raise HTTPException(status_code=404, detail="Material not found")
        return material.dict()
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch material: {str(e)}")

@app.get("/api/search")
async def search_materials(
    q: str = Query(..., description="Search query"),
    category: Optional[str] = Query(None, description="Filter by category"),
    limit: int = Query(20, description="Maximum results")
):
    """Search materials by text query"""
    try:
        materials = await recommender.search_materials(q, category, limit)
        return {
            "materials": [material.dict() for material in materials],
            "count": len(materials),
            "query": q,
            "source": "Local Database"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Search failed: {str(e)}")

@app.get("/api/alternatives/{material_id}")
async def get_alternatives(material_id: str):
    """Find alternative materials similar to the given material"""
    try:
        alternatives = await recommender.find_alternatives(material_id, {})
        return {
            "alternatives": [material.dict() for material in alternatives],
            "reference_material_id": material_id,
            "count": len(alternatives),
            "source": "Local Database"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to find alternatives: {str(e)}")

@app.get("/api/suppliers")
async def get_suppliers(
    material_id: Optional[str] = Query(None, description="Filter by material ID"),
    region: Optional[str] = Query(None, description="Filter by region"),
    min_quantity: Optional[int] = Query(None, description="Minimum order quantity")
):
    """Get supplier information"""
    try:
        if material_id:
            suppliers = await recommender.get_suppliers(material_id, region, min_quantity)
        else:
            filters = {}
            if region:
                filters['location__icontains'] = region
            if min_quantity:
                filters['minimum_order__lte'] = min_quantity
            suppliers = await material_db.query_suppliers(filters)
        
        return {
            "suppliers": [supplier.dict() for supplier in suppliers],
            "count": len(suppliers),
            "filters": {
                "material_id": material_id,
                "region": region,
                "min_quantity": min_quantity
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch suppliers: {str(e)}")

# Optional external API endpoints (gracefully handle missing API keys)
@app.get("/api/materials-project/{material_id}")
async def get_material_from_mp(material_id: str):
    """Get material data from Materials Project API (if configured)"""
    api_key = os.getenv("MP_API_KEY")
    if not api_key:
        return {
            "message": "Materials Project API key not configured",
            "suggestion": "Using local database instead",
            "material_id": material_id,
            "fallback": True
        }
    
    # In a real implementation, this would call the Materials Project API
    return {
        "material_id": material_id,
        "data": {},
        "source": "Materials Project",
        "message": "Materials Project integration - implementation needed",
        "status": "placeholder"
    }

@app.get("/api/matweb/{material_name}")
async def get_material_from_matweb(material_name: str):
    """Get material data from MatWeb API (if configured)"""
    api_key = os.getenv("MATWEBAPI_KEY")
    if not api_key:
        return {
            "message": "MatWeb API key not configured",
            "suggestion": "Using local database instead",
            "material_name": material_name,
            "fallback": True
        }
    
    # In a real implementation, this would call the MatWeb API
    return {
        "material_name": material_name,
        "data": {},
        "source": "MatWeb",
        "message": "MatWeb integration - implementation needed",
        "status": "placeholder"
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