# imports
import sqlite3
import pandas as pd
from pathlib import Path

# config
BASE_DIR = Path(__file__).resolve().parent.parent
DB_PATH = BASE_DIR / "dev_database.db"
EXCEL_CATALOGO = Path(r"C:\Users\USUARIO\Downloads\Resultado_Catalogo_Bicicletas\Resultado_Catalogo_Bicicletas\relatorio_bicicletas.xlsx")

# funções
def inspecionar():
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    prods = c.execute("SELECT id, sku, name FROM products WHERE name LIKE '%CAIRU%' ORDER BY name").fetchall()
    print(f"Total produtos Cairu: {len(prods)}")
    for p in prods:
        print(f"ID: {p[0]} | SKU: {p[1]} | NOME: {p[2]}")
        
    if EXCEL_CATALOGO.exists():
        df = pd.read_excel(EXCEL_CATALOGO, sheet_name="Produtos encontrados")
        print("\n--- PRODUTOS ENCONTRADOS NO EXCEL ---")
        for _, row in df.iterrows():
            print(f"Cod: {row['Código']} | Ref: {row['Ref. Fornecedor/Produto']} | Desc: {row['Descrição']}")

# execução
if __name__ == "__main__":
    inspecionar()

