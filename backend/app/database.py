import sqlite3
from pathlib import Path

DB_PATH = Path(__file__).parent / "medcarbon.db"

def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def create_tables():
    with get_db_connection() as conn:
        conn.execute("""
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                email TEXT UNIQUE NOT NULL,
                password_hash TEXT NOT NULL,
                full_name TEXT,
                role TEXT,
                institution TEXT,
                address TEXT,
                facility_name TEXT,
                department TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        # Safety migration: Add columns to existing tables if missing
        cursor = conn.cursor()
        cursor.execute("PRAGMA table_info(users)")
        columns = [row[1] for row in cursor.fetchall()]
        
        new_cols = {
            "full_name": "TEXT",
            "role": "TEXT",
            "institution": "TEXT",
            "address": "TEXT",
            "facility_name": "TEXT",
            "department": "TEXT"
        }
        for col_name, col_type in new_cols.items():
            if col_name not in columns:
                conn.execute(f"ALTER TABLE users ADD COLUMN {col_name} {col_type}")
        conn.commit()

# Initialize tables immediately upon import or via manual call
create_tables()
print(f"📁 Database initialized at {DB_PATH}")
