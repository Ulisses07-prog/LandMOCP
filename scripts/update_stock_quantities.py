# imports
import sys
import pandas as pd
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
BACKEND_DIR = BASE_DIR / "backend"
sys.path.insert(0, str(BACKEND_DIR))

from app.core.database import SessionLocal
from app.models.product import Product

# config
DEFAULT_STOCK_FILE = BASE_DIR / "Quantidades" / "bd7c4d28-8b27-4f8b-b3bf-4b37faa21d08_relatorio_posicao_estoque_20260919100950_ulisses_arruda.xls"

# funções
def parse_price(val):
    if pd.isna(val) or val is None:
        return 0.0
    s = str(val).strip().replace(".", "").replace(",", ".")
    try:
        return float(s)
    except Exception:
        return 0.0

def update_stock(file_path: Path = DEFAULT_STOCK_FILE):
    if not file_path.exists():
        print(f"[ERRO] Arquivo de estoque não encontrado: {file_path}")
        return

    print(f"[1/3] Lendo relatório de estoque: {file_path.name}...")
    df = pd.read_excel(file_path)

    total_rows = len(df)
    print(f"[2/3] Total de registros no relatório: {total_rows}")

    db = SessionLocal()
    updated_count = 0
    in_stock_count = 0
    preorder_count = 0

    try:
        # Cache de produtos no banco por SKU para acesso instantâneo em memória
        db_products = {p.sku: p for p in db.query(Product).all() if p.sku}

        print("[3/3] Atualizando estoque e disponibilidade no banco de dados...")
        for _, row in df.iterrows():
            raw_code = row.get("Código")
            if pd.isna(raw_code):
                continue
            code = str(raw_code).strip()
            if not code or code == "nan":
                continue

            prod = db_products.get(code)
            if not prod:
                continue

            # Quantidade em estoque
            raw_stock = row.get("Estoque", 0)
            try:
                stock_qty = int(float(str(raw_stock).replace(".", "").replace(",", ".")))
            except Exception:
                stock_qty = 0

            # Preço unitário da venda (se informado e maior que zero)
            raw_price = row.get("Valor Unitário Venda")
            price_val = parse_price(raw_price)

            prod.stock = stock_qty
            if stock_qty > 0:
                prod.availability = "Pronta Entrega"
                in_stock_count += 1
            else:
                prod.availability = "Sob Encomenda"
                preorder_count += 1

            if price_val > 0 and (prod.price == 0 or prod.price is None):
                prod.price = price_val

            updated_count += 1
            if updated_count % 1000 == 0:
                db.commit()
                print(f"  -> Processados: {updated_count}/{total_rows}...")

        db.commit()
        print("\n[SUCESSO] Atualização de estoque concluída!")
        print("--------------------------------------------------")
        print(f"Produtos atualizados no banco: {updated_count}")
        print(f"Total com Pronta Entrega:      {in_stock_count}")
        print(f"Total Sob Encomenda:           {preorder_count}")
        print("--------------------------------------------------")
    finally:
        db.close()

# execução
if __name__ == "__main__":
    target = Path(sys.argv[1]) if len(sys.argv) > 1 else DEFAULT_STOCK_FILE
    update_stock(target)
