import os
import sqlite3
from pathlib import Path
from contextlib import contextmanager

DB_PATH = Path(__file__).parent / "medcarbon.db"

class PostgresCursorWrapper:
    def __init__(self, cursor):
        self._cursor = cursor
        
    def execute(self, sql, params=None):
        sql = sql.replace("?", "%s")
        self._cursor.execute(sql, params)
        return self
        
    def fetchone(self):
        return self._cursor.fetchone()
        
    def fetchall(self):
        return self._cursor.fetchall()
        
    def __getattr__(self, name):
        return getattr(self._cursor, name)

class PostgresConnectionWrapper:
    def __init__(self, conn):
        self._conn = conn
        
    def cursor(self, *args, **kwargs):
        return PostgresCursorWrapper(self._conn.cursor(*args, **kwargs))
        
    def execute(self, sql, params=None):
        sql = sql.replace("?", "%s")
        cur = self._conn.cursor()
        cur.execute(sql, params)
        return PostgresCursorWrapper(cur)
        
    def commit(self):
        self._conn.commit()
        
    def rollback(self):
        self._conn.rollback()
        
    def close(self):
        self._conn.close()

    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        if exc_type:
            self._conn.rollback()
        else:
            self._conn.commit()

    def __getattr__(self, name):
        return getattr(self._conn, name)

@contextmanager
def get_db_connection():
    db_url = os.getenv("DATABASE_URL")
    if db_url:
        import psycopg2
        import psycopg2.extras
        # Fix render/supabase connection strings that use postgres:// instead of postgresql://
        if db_url.startswith("postgres://"):
            db_url = db_url.replace("postgres://", "postgresql://", 1)
        conn = psycopg2.connect(db_url, cursor_factory=psycopg2.extras.DictCursor)
        wrapper = PostgresConnectionWrapper(conn)
        try:
            yield wrapper
            wrapper.commit()
        except Exception:
            wrapper.rollback()
            raise
        finally:
            wrapper.close()
    else:
        conn = sqlite3.connect(DB_PATH)
        conn.row_factory = sqlite3.Row
        try:
            yield conn
            conn.commit()
        except Exception:
            conn.rollback()
            raise
        finally:
            conn.close()

def create_tables():
    db_url = os.getenv("DATABASE_URL")
    is_postgres = db_url is not None
    
    with get_db_connection() as conn:
        if is_postgres:
            conn.execute("""
                CREATE TABLE IF NOT EXISTS users (
                    id SERIAL PRIMARY KEY,
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
        else:
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
        if is_postgres:
            cursor.execute("SELECT column_name FROM information_schema.columns WHERE table_name='users'")
            columns = [row[0] for row in cursor.fetchall()]
        else:
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

# Initialize tables immediately upon import
create_tables()
print(f"📁 Database initialized (PostgreSQL={os.getenv('DATABASE_URL') is not None})")
