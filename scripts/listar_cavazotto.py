import sqlite3
import os

db_path = "backend/dev_database.db"
if not os.path.exists(db_path):
    print("Banco não encontrado:", db_path)
    exit(1)

conn = sqlite3.connect(db_path)
cursor = conn.cursor()
cursor.execute("SELECT id, name, sku, slug FROM products WHERE name LIKE '%CAVAZOTTO%'")
rows = cursor.fetchall()
print(f"Total Cavazotto encontrados: {len(rows)}")
for r in rows:
    print(r)
