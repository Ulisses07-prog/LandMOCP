from pathlib import Path
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from app.core.config import settings

db_url = settings.DATABASE_URL

# Ajustar connect_args e caminho absoluto para SQLite em dev
connect_args = {}
if db_url.startswith("sqlite"):
    connect_args = {"check_same_thread": False}
    if "./dev_database.db" in db_url:
        project_root = Path(__file__).resolve().parent.parent.parent.parent
        root_db = project_root / "dev_database.db"
        db_url = f"sqlite:///{root_db.as_posix()}"

engine = create_engine(db_url, connect_args=connect_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
