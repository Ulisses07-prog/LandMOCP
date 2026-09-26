from pathlib import Path
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from app.core.config import settings

db_url = settings.DATABASE_URL

# Ajustar connect_args e caminho absoluto para SQLite
connect_args = {}
if db_url.startswith("sqlite"):
    connect_args = {"check_same_thread": False}
    
    # Locais onde dev_database.db (com 12k produtos) pode estar
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
    found_db = None
    for cand in candidates:
        try:
            if cand.exists() and cand.is_file() and cand.stat().st_size > 50000:
                found_db = cand
                break
        except Exception:
            pass

    if not found_db:
        try:
            for root in [Path.cwd(), base_dir.parent.parent.parent]:
                for match in root.glob("**/dev_database.db"):
                    if match.is_file() and match.stat().st_size > 50000:
                        found_db = match
                        break
                if found_db:
                    break
        except Exception:
            pass

    if found_db:
        db_url = f"sqlite:///{found_db.resolve().as_posix()}"
        print(f"[DATABASE] Conectado ao banco: {found_db.resolve()} ({found_db.stat().st_size} bytes)")
    else:
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
