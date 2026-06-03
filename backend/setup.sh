#!/bin/bash
set -e

echo "🌿 MedCarbon OS — Backend Setup"
echo "================================"

# Create venv
echo "→ Creating Python 3.11 virtual environment..."
python3.11 -m venv venv
source venv/bin/activate

# Install deps
echo "→ Installing dependencies..."
pip install --upgrade pip -q
pip install -r requirements.txt -q

echo "→ Training ML models (this may take 2–5 minutes)..."
cd app && python -m ml.pipeline && cd ..

echo ""
echo "✅ Backend ready!"
echo "→ Start server: source venv/bin/activate && uvicorn app.main:app --reload --port 8000"
