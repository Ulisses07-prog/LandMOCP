# imports
import os
import sys
import shutil
import tarfile
from datetime import datetime
from pathlib import Path

# config
BACKUP_DIR = Path(__file__).resolve().parent.parent / "backups"
MEDIA_DIR = Path(__file__).resolve().parent.parent / "backend" / "media" / "uploads"
DB_FILE = Path(__file__).resolve().parent.parent / "backend" / "arruda.db"

# funções
def create_backup():
    BACKUP_DIR.mkdir(parents=True, exist_ok=True)
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    target_archive = BACKUP_DIR / f"arruda_backup_{timestamp}.tar.gz"

    print(f"Iniciando backup em: {target_archive}")
    with tarfile.open(target_archive, "w:gz") as tar:
        # 1. Backup de banco SQLite se existir localmente
        if DB_FILE.exists():
            tar.add(DB_FILE, arcname="arruda.db")
            print("Banco de dados local adicionado ao backup.")
        
        # 2. Backup dos arquivos de mídia
        if MEDIA_DIR.exists():
            tar.add(MEDIA_DIR, arcname="uploads")
            print("Pasta de uploads adicionada ao backup.")

    print(f"Backup concluído com sucesso: {target_archive}")
    return str(target_archive)

# execução
if __name__ == "__main__":
    create_backup()
