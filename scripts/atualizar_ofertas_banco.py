# imports
import sqlite3
from pathlib import Path

# config
BASE_DIR = Path(__file__).resolve().parent.parent
DB_PATHS = [BASE_DIR / "dev_database.db", BASE_DIR / "backend" / "dev_database.db"]

OFERTAS = [
    ("%ELGIN%9.000BTUS%", 3175.0, 2499.9, "10x de R$ 269,88 nos cartões"),
    ("%CRD37%", 3999.9, 2899.9, "10x de R$ 339,99 nos cartões"),
    ("%AOC%32%", 1699.9, 999.9, "10x de R$ 144,49 nos cartões"),
    ("%TELASUL%DIAMANTE%", 1280.0, 899.9, "10x de R$ 108,57 nos cartões"),
    ("%BS07%", 1195.0, 799.9, "10x de R$ 101,58 nos cartões"),
    ("%REALCE%XODO%", 965.0, 679.9, "10x de R$ 82,03 nos cartões"),
    ("%WANKE%10KG%", 825.0, 555.0, "10x de R$ 70,13 nos cartões"),
    ("%TUBOART%CAMILLE%", 699.9, 499.9, "10x de R$ 59,49 nos cartões"),
    ("%MONDIAL%COLUNA%40%", 420.0, 295.0, "10x de R$ 35,70 nos cartões"),
    ("%MONDIAL%MESA%40%", 270.0, 199.9, "10x de R$ 24,19 nos cartões"),
    ("%ULTRA V-30%", 185.0, 135.0, "10x de R$ 16,33 nos cartões"),
]

# funções
def sincronizar_ofertas_banco():
    for db_path in DB_PATHS:
        conn = sqlite3.connect(db_path)
        c = conn.cursor()
        
        # Limpar promo_price de todos os outros produtos para que apenas os 11 oficiais apareçam na página de ofertas
        c.execute("UPDATE products SET promo_price = NULL, is_featured = 0")
        
        total_atualizados = 0
        for termo, de, por, condicao in OFERTAS:
            prods = c.execute("SELECT id, name FROM products WHERE name LIKE ?", (termo,)).fetchall()
            for pid, nome in prods:
                c.execute("""
                    UPDATE products 
                    SET price = ?, old_price = ?, promo_price = ?, payment_condition = ?, is_featured = 1 
                    WHERE id = ?
                """, (por, de, por, condicao, pid))
                total_atualizados += 1

        conn.commit()
        conn.close()
        print(f"[OK] {db_path.name}: {total_atualizados} produtos marcados com promo_price ativo.")

# execução
if __name__ == "__main__":
    sincronizar_ofertas_banco()

