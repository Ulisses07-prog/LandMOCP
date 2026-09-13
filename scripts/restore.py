# imports
import os
import sys
import tarfile
import argparse
from pathlib import Path

# config
BASE_DIR = Path(__file__).resolve().parent.parent
BACKEND_DIR = BASE_DIR / "backend"

# funções
def restore_backup(archive_path: str):
    tar_path = Path(archive_path)
    if not tar_path.exists():
        print(f"Arquivo não encontrado: {tar_path}")
        sys.exit(1)

    print(f"Restaurando backup de: {tar_path}")
    with tarfile.open(tar_path, "r:gz") as tar:
        for member in tar.getmembers():
            if member.name == "arruda.db":
                tar.extract(member, path=BACKEND_DIR)
                print("Banco de dados local restaurado.")
            elif member.name.startswith("uploads"):
                tar.extract(member, path=BACKEND_DIR / "media")
                print(f"Extraído: {member.name}")

    print("Restauração concluída com sucesso.")

# execução
if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Restaurar backup da Arruda Móveis")
    parser.add_argument("archive", help="Caminho do arquivo .tar.gz de backup")
    args = parser.parse_args()
    restore_backup(args.archive)
