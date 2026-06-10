from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
import asyncio, json, random, math, time, sqlite3, pickle
from pathlib import Path
from pydantic import BaseModel

from app.database import get_db_connection
from app.auth import get_password_hash, verify_password, create_access_token, get_current_user

app = FastAPI(title="MedCarbon OS API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Load ML stats if trained ──────────────────────────────────────────────────
MODELS_PATH = Path(__file__).parent / "ml" / "models"
_stats = None
_rf_model = None
_rf_cols = None

def get_stats():
    global _stats
    if _stats is None:
        stats_file = MODELS_PATH / "stats.json"
        if stats_file.exists():
            with open(stats_file) as f:
                _stats = json.load(f)
    return _stats

def load_rf_model():
    global _rf_model, _rf_cols
    if _rf_model is None:
        model_path = MODELS_PATH / "rf_model.pkl"
        if model_path.exists():
            with open(model_path, "rb") as f:
                _rf_model, _rf_cols = pickle.load(f)
    return _rf_model, _rf_cols

# ── Schemas ──────────────────────────────────────────────────────────────────
class UserRegister(BaseModel):
    email: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str

class PredictRequest(BaseModel):
    electricity_facility: float
    fans_electricity: float
    cooling_electricity: float
    heating_electricity: float
    interior_lights_electricity: float
    interior_equipment_electricity: float
    gas_facility: float
    heating_gas: float
    interior_equipment_gas: float
    water_heater_gas: float
    hour: int
    day_of_year: int


# ── Helper: generate realistic emission value ─────────────────────────────────
def emission_at_hour(hour: int, noise: float = 0.0) -> float:
    base = 8 + math.sin((hour - 6) * math.pi / 12) * 4
    return max(3.0, round(base + noise, 2))

# ── Routes ────────────────────────────────────────────────────────────────────

@app.get("/")
def root():
    return {"service": "MedCarbon OS API", "status": "running", "version": "1.0.0"}

@app.get("/api/emissions/scopes")
def get_scopes():
    stats = get_stats()
    if stats:
        factor = 1 / 8760  # hourly → annual average chunk
        return {
            "scope1_gas":      round(stats["scope1_total"] * factor * 365 / 12, 1),
            "scope1_process":  round(stats["scope1_total"] * factor * 365 / 12 * 0.29, 1),
            "scope2_electricity": round(stats["scope2_total"] * factor * 365 / 12, 1),
            "scope2_hvac":     round(stats["scope2_total"] * factor * 365 / 12 * 0.37, 1),
            "scope3_pharma":   88.5,
            "scope3_waste":    22.3,
        }
    return {
        "scope1_gas": 42.4, "scope1_process": 12.1,
        "scope2_electricity": 128.9, "scope2_hvac": 48.2,
        "scope3_pharma": 88.5, "scope3_waste": 22.3,
    }

@app.get("/api/forecast/48h")
def get_forecast():
    stats = get_stats()
    if stats and "series" in stats:
        # Use last 48 hours of real data
        series = stats["series"][-48:]
        data = [
            {
                "hour": f"{i%24:02d}:00",
                "emissions": round(v, 3),
                "Random Forest": round(v * (0.95 + random.random() * 0.1), 3),
                "LSTM": round(v * (0.92 + random.random() * 0.1), 3),
                "XGBoost": round(v * (0.96 + random.random() * 0.08), 3),
            }
            for i, v in enumerate(series)
        ]
    else:
        data = [
            {
                "hour": f"{i%24:02d}:00",
                "emissions": emission_at_hour(i%24, (random.random()-0.5)*1.5),
                "Random Forest": emission_at_hour(i%24, (random.random()-0.5)*1.2),
                "LSTM": emission_at_hour(i%24, (random.random()-0.5)*2),
                "XGBoost": emission_at_hour(i%24, (random.random()-0.5)*1.0),
            }
            for i in range(48)
        ]
    return {"data": data, "model_confidence": {"rf": 94.2, "lstm": 89.5, "xgb": 91.8}}

@app.get("/api/telemetry/live")
def get_telemetry():
    hour = int(time.time() / 3600) % 24
    return {
        "GRID-INF-01": {"value": round(12.4 + (random.random()-0.5)*0.3, 2), "unit": "MWh", "status": "LIVE"},
        "AUX-GEN-02":  {"value": round(0.02 + random.random()*0.01, 3),    "unit": "kW",   "status": "STANDBY"},
        "GAS-STM-B4":  {"value": round(142 + (random.random()-0.3)*8, 1),  "unit": "PSI",  "status": "ANOMALY"},
        "WTR-POT-01":  {"value": round(82.5 + (random.random()-0.5)*2, 1), "unit": "m³/h", "status": "STABLE"},
        "HVAC-CHL-A":  {"value": round(4.2 + (random.random()-0.5)*0.3, 1),"unit": "°C",   "status": "LIVE"},
        "WTR-REC-FLT": {"value": round(92 + (random.random()-0.5)*1, 1),   "unit": "%",    "status": "OPTIMAL"},
        "GAS-AIR-MED": {"value": round(55.2 + (random.random()-0.5)*0.5,1),"unit": "PSI",  "status": "LIVE"},
        "SOL-PV-TOP":  {"value": round(428 * (0.9 + random.random()*0.2), 0),"unit": "kW", "status": "ACTIVE"},
        "GAS-LN2-VLT": {"value": -196,                                      "unit": "°C",   "status": "MONITORING"},
        "HEAT-REC-WHR":{"value": round(12.1 + (random.random()-0.5)*0.4,2),"unit": "GJ/d", "status": "LIVE"},
        "timestamp": time.strftime("%H:%M:%S UTC"),
        "carbon_intensity": round(242 + (random.random()-0.5)*10, 1),
    }

@app.get("/api/recommendations")
def get_recommendations():
    return {"recommendations": [
        {"id": "opt-1", "title": "Reschedule Elective Surgeries",  "savings_tco2e": 12.4, "roi_monthly": 4200, "priority": "High Priority",      "category": "CLINICAL OPS",     "difficulty": 3},
        {"id": "opt-2", "title": "HVAC Dynamic Setback",           "savings_tco2e": 8.2,  "roi_monthly": 2850, "priority": "Automation Ready",   "category": "INFRASTRUCTURE",   "difficulty": 2},
        {"id": "opt-3", "title": "Lighting Optimization",          "savings_tco2e": 5.7,  "roi_monthly": 1400, "priority": "Quick Win",          "category": "ENERGY",           "difficulty": 2},
        {"id": "opt-4", "title": "Low-Carbon Vendor Switch",       "savings_tco2e": 22.1, "roi_monthly": -500, "priority": "High Impact",        "category": "PROCUREMENT",      "difficulty": 3},
        {"id": "opt-5", "title": "Desflurane Elimination",        "savings_tco2e": 45.0, "roi_monthly": 1200, "priority": "Specialist Required","category": "CLINICAL",         "difficulty": 1},
    ]}

@app.get("/api/compliance/report")
def get_compliance():
    return {
        "overall_score": 83,
        "frameworks": {
            "GHG Protocol": {"score": 96, "status": "Compliant"},
            "ISO 14064":    {"score": 94, "status": "Compliant"},
            "SBTi 1.5C":    {"score": 75, "status": "On Track"},
            "WHO Climate":  {"score": 61, "status": "In Progress"},
            "UN SDGs":      {"score": 88, "status": "Aligned"},
        },
        "reporting_period": "Q1-Q2 2026",
        "institution": "Metro Health System",
    }

# ── WebSocket: live telemetry stream ──────────────────────────────────────────

@app.websocket("/ws/telemetry")
async def ws_telemetry(ws: WebSocket):
    await ws.accept()
    try:
        while True:
            data = get_telemetry()
            await ws.send_text(json.dumps(data))
            await asyncio.sleep(3)
    except WebSocketDisconnect:
        pass
    except Exception:
        pass

# ── Authentication Routes ──────────────────────────────────────────────────────

@app.post("/api/auth/register", response_model=TokenResponse)
def register(user: UserRegister):
    hashed = get_password_hash(user.password)
    try:
        with get_db_connection() as conn:
            conn.execute(
                "INSERT INTO users (email, password_hash) VALUES (?, ?)",
                (user.email, hashed)
            )
            conn.commit()
    except sqlite3.IntegrityError:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")
    
    token = create_access_token(data={"sub": user.email})
    return {"access_token": token, "token_type": "bearer"}

@app.post("/api/auth/login", response_model=TokenResponse)
def login(user: UserLogin):
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT password_hash FROM users WHERE email = ?", (user.email,))
        row = cursor.fetchone()
        if not row:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")
        
        db_hash = row["password_hash"]
        if not verify_password(user.password, db_hash):
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")
            
    token = create_access_token(data={"sub": user.email})
    return {"access_token": token, "token_type": "bearer"}

@app.get("/api/auth/me")
def get_me(current_user: str = Depends(get_current_user)):
    return {"email": current_user}

# ── Prediction Endpoint ────────────────────────────────────────────────────────

@app.post("/api/predict")
def predict_footprint(req: PredictRequest, current_user: str = Depends(get_current_user)):
    model, cols = load_rf_model()
    if model is None:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="ML model not loaded or trained yet")
    
    total_electricity = (
        req.electricity_facility +
        req.fans_electricity +
        req.cooling_electricity +
        req.heating_electricity +
        req.interior_lights_electricity +
        req.interior_equipment_electricity
    )
    total_gas = (
        req.gas_facility +
        req.heating_gas +
        req.interior_equipment_gas +
        req.water_heater_gas
    )
    
    # Scope 1 & 2 calculations matching pipeline.py
    scope1_tco2e = total_gas * 0.202 * (1 / 1000)
    scope2_tco2e = total_electricity * 0.386 * (1 / 1000)
    
    features = {
        'Electricity:Facility [kW](Hourly)': req.electricity_facility,
        'Fans:Electricity [kW](Hourly)': req.fans_electricity,
        'Cooling:Electricity [kW](Hourly)': req.cooling_electricity,
        'Heating:Electricity [kW](Hourly)': req.heating_electricity,
        'InteriorLights:Electricity [kW](Hourly)': req.interior_lights_electricity,
        'InteriorEquipment:Electricity [kW](Hourly)': req.interior_equipment_electricity,
        'Gas:Facility [kW](Hourly)': req.gas_facility,
        'Heating:Gas [kW](Hourly)': req.heating_gas,
        'InteriorEquipment:Gas [kW](Hourly)': req.interior_equipment_gas,
        'Water Heater:WaterSystems:Gas [kW](Hourly)': req.water_heater_gas,
        'total_electricity_kwh': total_electricity,
        'total_gas_kwh': total_gas,
        'hour': req.hour,
        'day_of_year': req.day_of_year
    }
    
    import pandas as pd
    X = pd.DataFrame([features])[cols]
    
    predicted_total = float(model.predict(X)[0])
    
    return {
        "predicted_total": round(predicted_total, 4),
        "scope1_calculated": round(scope1_tco2e, 4),
        "scope2_calculated": round(scope2_tco2e, 4),
        "total_electricity_kwh": round(total_electricity, 2),
        "total_gas_kwh": round(total_gas, 2)
    }

