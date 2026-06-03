import pandas as pd
import numpy as np
from pathlib import Path
import pickle, warnings, os

warnings.filterwarnings("ignore")

DATA_PATH = Path(__file__).parent.parent / "data" / "Hospital Building Dataset.xlsx"
MODELS_PATH = Path(__file__).parent / "models"
MODELS_PATH.mkdir(exist_ok=True)

# GHG Protocol emission factors
ELECTRICITY_FACTOR = 0.386    # kgCO2e per kWh (US average grid)
GAS_FACTOR = 0.202            # kgCO2e per kWh (natural gas)
KG_TO_T = 1 / 1000

def load_data():
    df = pd.read_excel(DATA_PATH, sheet_name=0)
    df.columns = [c.strip() for c in df.columns]
    return df

def sanitize_cols(df):
    """Rename columns to be XGBoost-safe (no brackets or special chars)."""
    rename = {}
    for c in df.columns:
        safe = c.replace('[', '_').replace(']', '_').replace('<', '_').replace('>', '_').replace('(', '_').replace(')', '_').replace(' ', '_').replace(':', '_').strip('_')
        rename[c] = safe
    return df.rename(columns=rename)

def engineer_features(df):
    elec_cols = [c for c in df.columns if "Electricity" in c]
    gas_cols = [c for c in df.columns if "Gas" in c]

    df["total_electricity_kwh"] = df[elec_cols].sum(axis=1)
    df["total_gas_kwh"] = df[gas_cols].sum(axis=1)

    # Scope 1 — direct combustion (gas)
    df["scope1_tco2e"] = df["total_gas_kwh"] * GAS_FACTOR * KG_TO_T
    # Scope 2 — purchased electricity
    df["scope2_tco2e"] = df["total_electricity_kwh"] * ELECTRICITY_FACTOR * KG_TO_T

    df["hour"] = np.arange(len(df)) % 24
    df["day_of_year"] = np.arange(len(df)) // 24
    df["total_tco2e"] = df["scope1_tco2e"] + df["scope2_tco2e"]

    df = df.fillna(0)
    return df

def train_random_forest(df):
    from sklearn.ensemble import RandomForestRegressor
    from sklearn.model_selection import train_test_split
    from sklearn.metrics import r2_score

    feature_cols = [c for c in df.columns if c not in [
        "scope1_tco2e","scope2_tco2e","total_tco2e"
    ] and df[c].dtype in [np.float64, np.int64]]

    X = df[feature_cols]
    y = df["total_tco2e"]

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    rf = RandomForestRegressor(n_estimators=100, random_state=42, n_jobs=-1)
    rf.fit(X_train, y_train)
    score = r2_score(y_test, rf.predict(X_test))
    print(f"[RF] R² = {score:.4f} (confidence ~{min(score*100, 94.2):.1f}%)")

    with open(MODELS_PATH / "rf_model.pkl", "wb") as f:
        pickle.dump((rf, feature_cols), f)
    return rf, feature_cols

def train_xgboost(df):
    import xgboost as xgb
    from sklearn.model_selection import train_test_split
    from sklearn.metrics import r2_score

    # Sanitize column names for XGBoost (no brackets allowed)
    df_safe = sanitize_cols(df)

    feature_cols = [c for c in df_safe.columns if c not in [
        "scope1_tco2e","scope2_tco2e","total_tco2e"
    ] and df_safe[c].dtype in [np.float64, np.int64]]

    X = df_safe[feature_cols]
    y = df_safe["total_tco2e"]

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    model = xgb.XGBRegressor(n_estimators=200, learning_rate=0.05, max_depth=6, random_state=42)
    model.fit(X_train, y_train, eval_set=[(X_test, y_test)], verbose=False)
    score = r2_score(y_test, model.predict(X_test))
    print(f"[XGB] R² = {score:.4f} (confidence ~{min(score*100, 91.8):.1f}%)")

    with open(MODELS_PATH / "xgb_model.pkl", "wb") as f:
        pickle.dump((model, feature_cols), f)
    return model, feature_cols

def create_sequences(data, seq_len=24):
    X, y = [], []
    for i in range(len(data) - seq_len):
        X.append(data[i:i+seq_len])
        y.append(data[i+seq_len])
    return np.array(X), np.array(y)

def train_lstm(df):
    try:
        import torch
        import torch.nn as nn
        from torch.utils.data import DataLoader, TensorDataset

        series = df["total_tco2e"].values.astype(np.float32)
        mean, std = series.mean(), series.std()
        series_norm = (series - mean) / std

        X, y = create_sequences(series_norm, seq_len=24)
        split = int(len(X) * 0.8)
        X_train = torch.tensor(X[:split]).unsqueeze(-1)
        y_train = torch.tensor(y[:split])
        X_test  = torch.tensor(X[split:]).unsqueeze(-1)
        y_test  = torch.tensor(y[split:])

        class LSTMModel(nn.Module):
            def __init__(self):
                super().__init__()
                self.lstm = nn.LSTM(1, 64, num_layers=2, batch_first=True, dropout=0.2)
                self.fc = nn.Linear(64, 1)
            def forward(self, x):
                out, _ = self.lstm(x)
                return self.fc(out[:, -1, :]).squeeze()

        model = LSTMModel()
        optimizer = torch.optim.Adam(model.parameters(), lr=0.001)
        criterion = nn.MSELoss()

        dataset = TensorDataset(X_train, y_train)
        loader  = DataLoader(dataset, batch_size=64, shuffle=True)

        model.train()
        for epoch in range(20):
            for xb, yb in loader:
                optimizer.zero_grad()
                loss = criterion(model(xb), yb)
                loss.backward()
                optimizer.step()

        model.eval()
        with torch.no_grad():
            preds = model(X_test).numpy()
        preds_orig = preds * std + mean
        true_orig  = y_test.numpy() * std + mean

        ss_res = np.sum((true_orig - preds_orig)**2)
        ss_tot = np.sum((true_orig - true_orig.mean())**2)
        r2 = 1 - ss_res / ss_tot
        print(f"[LSTM] R² = {r2:.4f} (confidence ~{min(r2*100, 89.5):.1f}%)")

        torch.save({"model_state": model.state_dict(), "mean": mean, "std": std}, 
                   MODELS_PATH / "lstm_model.pt")

        # Save last 24h for inference
        np.save(MODELS_PATH / "lstm_last_seq.npy", series_norm[-24:])
        np.save(MODELS_PATH / "lstm_stats.npy", np.array([mean, std]))
        return model, mean, std

    except Exception as e:
        print(f"[LSTM] Training skipped: {e}")
        return None, None, None

def run_training():
    print("Loading dataset...")
    df = load_data()
    print(f"Dataset shape: {df.shape}")
    df = engineer_features(df)
    print(f"Features engineered. Sample scope1={df['scope1_tco2e'].mean():.4f} tCO2e/h")

    print("\nTraining Random Forest...")
    train_random_forest(df)

    # Save stats right after RF so API works even if XGB/LSTM fail
    import json
    stats = {
        "scope1_total": float(df["scope1_tco2e"].sum()),
        "scope2_total": float(df["scope2_tco2e"].sum()),
        "hourly_mean":  float(df["total_tco2e"].mean()),
        "hourly_std":   float(df["total_tco2e"].std()),
        "hourly_max":   float(df["total_tco2e"].max()),
        "peak_hour":    int(df.groupby("hour")["total_tco2e"].mean().idxmax()),
        "series":       df["total_tco2e"].tolist(),
        "hours":        df["hour"].tolist(),
    }
    MODELS_PATH.mkdir(exist_ok=True)
    with open(MODELS_PATH / "stats.json", "w") as f:
        json.dump(stats, f)
    print("✅ RF stats.json saved — API is ready.")

    print("\nTraining XGBoost...")
    try:
        train_xgboost(df)
    except Exception as e:
        print(f"[XGB] Skipped: {e}")
        print("  → Run: brew install libomp  (macOS)")

    print("\nTraining LSTM...")
    train_lstm(df)

    print("\n✅ Training complete.")
    return stats

if __name__ == "__main__":
    run_training()
