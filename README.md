# MedCarbon OS 🌿

**AI-Powered Healthcare Carbon Intelligence Platform**

An enterprise sustainability operating system for healthcare institutions. Tracks, predicts, and optimises carbon emissions across hospital facilities using real-time IoT telemetry and a multi-model AI/ML pipeline.

---

## 🏗 Project Structure

```
MedCarbon_OS/
├── frontend/           # Vite + React + Tailwind CSS
└── backend/            # FastAPI + Python 3.11 + ML pipeline
    └── app/
        ├── main.py     # API server + WebSocket
        ├── ml/
        │   ├── pipeline.py   # RF + XGBoost + LSTM training
        │   └── models/       # Trained model artifacts
        └── data/             # Hospital Building Dataset.xlsx
```

---

## 🚀 Quick Start

### 1. Backend (Terminal 1)

```bash
cd backend
chmod +x setup.sh
./setup.sh   # Creates venv, installs deps, trains ML models (2–5 min)

# After setup completes:
source venv/bin/activate
uvicorn app.main:app --reload --port 8000
```

> **API Docs**: http://localhost:8000/docs

### 2. Frontend (Terminal 2)

```bash
cd frontend
npm run dev
```

> **App**: http://localhost:5173

---

## 🔑 Pages

| Route | Page |
|-------|------|
| `/login` | Login (split layout, Google + SAML SSO stubs) |
| `/onboard` | 3-Step Registration Wizard |
| `/dashboard` | Executive Summary Dashboard |
| `/telemetry` | Facility Telemetry Explorer (live WebSocket) |
| `/optimization` | Resource Optimization Recommendations |
| `/compliance` | Compliance Audit (GHG, ISO, SBTi, WHO, SDG) |
| `/forecasting` | Multi-Model Carbon Forecasting |

---

## ✨ Features

- 🌙 **Dark / Light Mode** — toggle in navbar, persisted in `localStorage`
- 🌐 **English / Hindi** — toggle in navbar, all UI text swaps instantly
- 📡 **WebSocket Telemetry** — sensor cards update live every 3 seconds
- 🤖 **ML Pipeline** — Random Forest (94.2%), XGBoost (91.8%), LSTM (89.5%)
- 📊 **Recharts** — area charts, line sparklines, forecast overlays
- 🔒 **GHG Protocol + ISO 14064 + SBTi 1.5°C + WHO + UN SDGs**

---

## 🧪 API Endpoints

| Endpoint | Description |
|----------|-------------|
| `GET /api/emissions/scopes` | Scope 1/2/3 tCO2e values |
| `GET /api/forecast/48h` | 48h emission forecast (all 3 models) |
| `GET /api/telemetry/live` | Current sensor readings |
| `GET /api/recommendations` | Optimization recommendations |
| `GET /api/compliance/report` | Compliance framework scores |
| `WS /ws/telemetry` | Live WebSocket telemetry stream |

---

## 🧠 ML Models

| Model | Task | Confidence | Dataset |
|-------|------|-----------|---------|
| Random Forest | Scope emission mapping | ~94.2% | 8,760 hourly rows |
| XGBoost | Peak demand regression | ~91.8% | 10 feature columns |
| LSTM (PyTorch) | 24–48h sequential forecast | ~89.5% | Normalised emission series |

**Emission factors** (GHG Protocol):
- Electricity: 0.386 kgCO2e/kWh (US average)
- Natural Gas: 0.202 kgCO2e/kWh

---

## 📋 Compliance Frameworks

- **GHG Protocol** — Scope 1, 2, 3
- **ISO 14064 + ISO 14001**
- **SBTi 1.5°C Pathway**
- **WHO Climate-Smart Healthcare** (net-zero 2050)
- **UN SDGs 3, 7, 12, 13**
