# Azure Functions configuration for FastAPI backend

import azure.functions as func
import sys
import os
from pathlib import Path

# Add backend to path
sys.path.insert(0, str(Path(__file__).parent))

# Import FastAPI app from backend
from backend.main import app

async def main(req: func.HttpRequest, context: func.Context) -> func.HttpResponse:
    """
    HTTP trigger for FastAPI application.
    Routes all requests to the FastAPI app.
    """
    try:
        # Get the request path and route to FastAPI
        return await func.AsgiRequest(app).handle_async(req)
    except Exception as e:
        return func.HttpResponse(
            f"Error: {str(e)}",
            status_code=500
        )
