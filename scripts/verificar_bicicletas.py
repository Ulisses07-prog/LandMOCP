# imports
import sqlite3
from pathlib import Path

# config
BASE_DIR = Path(__file__).resolve().parent.parent
DB_PATH = BASE_DIR / "dev_database.db"

# funções
def verificar():
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    
    testes_skus = ["3757", "3758", "3771", "3774", "3755", "3775", "4053", "4214", "3756"]
    for sku in testes_skus:
        prod = c.execute("SELECT id, sku, name FROM products WHERE sku = ?", (sku,)).fetchone()
        if not prod:
            continue
        pid, psku, pname = prod
        imgs = c.execute("SELECT url, is_primary, sort_order FROM product_images WHERE product_id = ? ORDER BY is_primary DESC, sort_order ASC", (pid,)).fetchall()
        print(f"\n==========================================")
        print(f"PRODUTO: {pname} (SKU: {psku} | ID: {pid})")
        print(f"TOTAL IMAGENS: {len(imgs)}")
        for img in imgs:
            print(f"  [{'CAPA' if img[1] else 'SEC '}] {img[0]}")

# execução
if __name__ == "__main__":
    verificar()

