from pathlib import Path
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from app.core.config import settings

db_url = settings.DATABASE_URL

# Ajustar connect_args e caminho absoluto para SQLite em dev
connect_args = {}
if db_url.startswith("sqlite"):
    connect_args = {"check_same_thread": False}
    if "dev_database.db" in db_url:
        candidates = [
            Path(__file__).resolve().parent.parent.parent.parent / "dev_database.db",
            Path(__file__).resolve().parent.parent.parent / "dev_database.db",
            Path.cwd() / "dev_database.db",
            Path.cwd().parent / "dev_database.db",
        ]
        found_db = None
        for cand in candidates:
            if cand.exists():
                found_db = cand
                break
        if found_db:
            db_url = f"sqlite:///{found_db.resolve().as_posix()}"
        else:
            db_url = f"sqlite:///{candidates[0].resolve().as_posix()}"

engine = create_engine(db_url, connect_args=connect_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
