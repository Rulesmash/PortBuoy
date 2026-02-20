from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
import os

app = FastAPI(title="PortBuoy Backend")
from pathlib import Path

# Setup templates directory
BASE_DIR = Path(__file__).resolve().parent
templates_path = BASE_DIR / "frontend" / "templates"
templates = Jinja2Templates(directory=str(templates_path))

@app.get("/", response_class=HTMLResponse)
async def read_index(request: Request):
    return templates.TemplateResponse(request=request, name="index.html")

@app.get("/login", response_class=HTMLResponse)
async def read_login(request: Request):
    return templates.TemplateResponse(request=request, name="login.html")

@app.get("/admin", response_class=HTMLResponse)
async def read_admin(request: Request):
    return templates.TemplateResponse(request=request, name="admin_dashboard.html")

@app.get("/driver", response_class=HTMLResponse)
async def read_driver(request: Request):
    return templates.TemplateResponse(request=request, name="driver_portal.html")

@app.get("/booking", response_class=HTMLResponse)
async def read_booking(request: Request):
    return templates.TemplateResponse(request=request, name="booking_manager.html")

@app.get("/esg", response_class=HTMLResponse)
async def read_esg(request: Request):
    return templates.TemplateResponse(request=request, name="esg_analytics.html")
