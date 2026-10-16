import os
from pathlib import Path
from sqlalchemy import create_engine, text
from sqlalchemy.orm import declarative_base, sessionmaker
from app.core.config import settings

def localizar_sqlite():
    base_dir = Path(__file__).resolve().parent
    candidates = [
        base_dir.parent.parent / "dev_database.db",          # backend/dev_database.db
        base_dir.parent.parent.parent / "dev_database.db",   # raiz/dev_database.db
        Path.cwd() / "dev_database.db",
        Path.cwd() / "backend" / "dev_database.db",
        Path.cwd().parent / "dev_database.db",
        Path("/opt/render/project/src/backend/dev_database.db"),
        Path("/opt/render/project/src/dev_database.db"),
    ]
    for cand in candidates:
        try:
            if cand.exists() and cand.is_file() and cand.stat().st_size > 50000:
                return cand
        except Exception:
            pass

    for root in [Path.cwd(), base_dir.parent.parent.parent]:
        try:
            for match in root.glob("**/dev_database.db"):
                if match.is_file() and match.stat().st_size > 50000:
                    return match
        except Exception:
            pass
    return None

db_url = settings.DATABASE_URL
connect_args = {}

# Se for Postgres ou se não começar com sqlite, testar se conecta; caso falhe, usar SQLite
usar_sqlite = False
if not db_url or db_url.startswith("sqlite"):
    usar_sqlite = True
else:
    try:
        test_engine = create_engine(db_url)
        with test_engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        engine = test_engine
        print(f"[DATABASE] Conectado ao banco remoto: {db_url.split('@')[-1]}")
    except Exception as e:
        print(f"[DATABASE WARNING] Falha ao conectar ao banco configurado ({e}). Forçando SQLite local...")
        usar_sqlite = True

if usar_sqlite:
    connect_args = {"check_same_thread": False}
    found_db = localizar_sqlite()
    if found_db:
        db_url = f"sqlite:///{found_db.resolve().as_posix()}"
        print(f"[DATABASE] Conectado ao banco SQLite: {found_db.resolve()} ({found_db.stat().st_size} bytes)")
    else:
        db_url = "sqlite:///./dev_database.db"
        print(f"[DATABASE WARNING] dev_database.db com dados não localizado. Usando: {db_url}")
    engine = create_engine(db_url, connect_args=connect_args)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
