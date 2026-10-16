# imports
import sqlite3
import pandas as pd
from pathlib import Path

# config
BASE_DIR = Path(__file__).resolve().parent.parent
DB_PATH = BASE_DIR / "dev_database.db"
DIR_PRODUTOS = BASE_DIR / "Produtos"

def get_latest_excel(folder: Path):
    files = [f for f in folder.glob("*") if f.suffix.lower() in [".xlsx", ".xls"]]
    return max(files, key=lambda f: f.stat().st_mtime) if files else None

# funções
def populate_subgroups():
    excel_path = get_latest_excel(DIR_PRODUTOS)
    if not excel_path:
        print("[ERRO] Nenhuma planilha encontrada em Produtos!")
        return

    print(f"[1/3] Conectando ao banco {DB_PATH.name}...")
    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()

    # Adicionar colunas se não existirem
    cols = [r[1] for r in cur.execute("PRAGMA table_info(products)").fetchall()]
    if "group_name" not in cols:
        cur.execute("ALTER TABLE products ADD COLUMN group_name VARCHAR(100)")
    if "subgroup" not in cols:
        cur.execute("ALTER TABLE products ADD COLUMN subgroup VARCHAR(100)")
    conn.commit()

    print(f"[2/3] Lendo planilha de produtos: {excel_path.name}...")
    df = pd.read_excel(excel_path)

    updates = []
    for _, row in df.iterrows():
        raw_code = row.get("Código")
        if pd.isna(raw_code):
            continue
        code = str(int(raw_code) if isinstance(raw_code, (int, float)) else raw_code).strip()
        grp = str(row.get("Grupo", "")).strip() if not pd.isna(row.get("Grupo")) else None
        sub = str(row.get("Subgrupo", "")).strip() if not pd.isna(row.get("Subgrupo")) else None
        if sub or grp:
            updates.append((grp, sub, code))

    print(f"[3/3] Atualizando {len(updates)} produtos com seus subgrupos...")
    cur.executemany("UPDATE products SET group_name = ?, subgroup = ? WHERE sku = ?", updates)
    conn.commit()
    conn.close()
    print("[SUCESSO] Subgrupos populados no banco de dados!")

# execução
if __name__ == "__main__":
    populate_subgroups()
