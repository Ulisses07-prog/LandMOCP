# imports
import os
import sys
import unicodedata
import re
import pandas as pd
from pathlib import Path

# Adicionar diretório do backend ao sys.path
BASE_DIR = Path(__file__).resolve().parent.parent
BACKEND_DIR = BASE_DIR / "backend"
sys.path.insert(0, str(BACKEND_DIR))

from app.core.database import SessionLocal
from app.models.category import Category
from app.models.product import Product

# config
DEFAULT_EXCEL_PATH = BASE_DIR / "Produtos" / "tabela de produtos.xlsx"

# funções
def slugify(text: str) -> str:
    s = unicodedata.normalize("NFKD", str(text)).encode("ascii", "ignore").decode("ascii")
    s = re.sub(r"[^a-zA-Z0-9]+", "-", s.strip().lower()).strip("-")
    return s or "item"

def clean_str(val):
    if pd.isna(val) or val is None:
        return None
    s = str(val).strip()
    return s if s else None

def get_or_create_category(db, dept_name: str, cache: dict) -> Category:
    name = (dept_name or "Geral").strip().title()
    slug = slugify(name)
    if slug in cache:
        return cache[slug]

    cat = db.query(Category).filter(Category.slug == slug).first()
    if not cat:
        cat = Category(name=name, slug=slug, active=True)
        db.add(cat)
        db.commit()
        db.refresh(cat)
    cache[slug] = cat
    return cat

def sync_catalog(file_path: Path = DEFAULT_EXCEL_PATH):
    if not file_path.exists():
        print(f"[ERRO] Arquivo não encontrado: {file_path}")
        return

    print(f"[1/4] Lendo planilha: {file_path.name}...")
    df = pd.read_excel(file_path)

    # Filtrar apenas ativos
    if "Ativo" in df.columns:
        df = df[df["Ativo"].astype(str).str.lower().str.strip() == "sim"]

    total = len(df)
    print(f"[2/4] Total de itens ativos identificados: {total}")

    db = SessionLocal()
    categories_cache = {}
    created_count = 0
    updated_count = 0
    pronta_entrega = 0
    sob_encomenda = 0

    try:
        # Cache de produtos existentes por SKU para busca em memória rápida
        existing_products = {p.sku: p for p in db.query(Product).all() if p.sku}

        print("[3/4] Sincronizando catálogo no banco de dados...")
        for idx, row in df.iterrows():
            raw_code = row.get("Código")
            if pd.isna(raw_code):
                continue
            code = str(int(raw_code) if isinstance(raw_code, (int, float)) else raw_code).strip()
            if not code or code == "nan":
                continue

            dept = clean_str(row.get("Departamento")) or "Móveis"
            cat = get_or_create_category(db, dept, categories_cache)

            name = clean_str(row.get("Descrição")) or f"Produto {code}"
            
            # Preço
            raw_price = row.get("Preço Padrão (R$)", 0.0)
            try:
                price = float(raw_price) if not pd.isna(raw_price) else 0.0
            except Exception:
                price = 0.0

            # Estoque
            raw_stock = row.get("Estoque", 0)
            try:
                stock = int(raw_stock) if not pd.isna(raw_stock) else 0
            except Exception:
                stock = 0

            # Disponibilidade automática conforme o estoque da loja
            if stock > 0:
                availability = "Pronta Entrega"
                pronta_entrega += 1
            else:
                availability = "Sob Encomenda"
                sob_encomenda += 1

            brand = clean_str(row.get("Marca"))
            color = clean_str(row.get("Cor"))

            # Dimensões
            alt = clean_str(row.get("Altura"))
            lar = clean_str(row.get("Largura"))
            prof = clean_str(row.get("Profundidade"))
            dims = f"{alt} x {lar} x {prof} cm" if (alt and lar and prof) else None

            weight = clean_str(row.get("Peso Líquido")) or clean_str(row.get("Peso Bruto"))
            short_desc = clean_str(row.get("TAG e-commerce")) or clean_str(row.get("Grupo"))
            description = clean_str(row.get("Descrição e-commerce")) or clean_str(row.get("Descrição Complementar"))

            prod = existing_products.get(code)
            if not prod:
                slug_base = f"{slugify(name)}-{code}"[:190]
                prod = Product(
                    sku=code,
                    slug=slug_base,
                    category_id=cat.id,
                    name=name[:200],
                    brand=brand[:100] if brand else None,
                    short_description=short_desc[:500] if short_desc else None,
                    description=description,
                    price=price,
                    dimensions=dims[:100] if dims else None,
                    weight=f"{weight} kg" if weight else None,
                    color=color[:100] if color else None,
                    stock=stock,
                    availability=availability,
                    status="PUBLISHED",  # Todos disponíveis no catálogo
                )
                db.add(prod)
                existing_products[code] = prod
                created_count += 1
            else:
                # Atualização contínua de preço, estoque e status
                prod.price = price
                prod.stock = stock
                prod.availability = availability
                prod.status = "PUBLISHED"
                if brand:
                    prod.brand = brand[:100]
                if color:
                    prod.color = color[:100]
                if dims:
                    prod.dimensions = dims[:100]
                if description:
                    prod.description = description
                updated_count += 1

            # Commit em lotes a cada 500 registros para velocidade
            if (created_count + updated_count) % 500 == 0:
                db.commit()
                print(f"  -> Processados: {created_count + updated_count}/{total}...")

        db.commit()
        print("\n[4/4] [SUCESSO] Sincronização concluída!")
        print(f"----------------------------------------")
        print(f"Novos produtos cadastrados: {created_count}")
        print(f"Produtos atualizados:      {updated_count}")
        print(f"Total com Pronta Entrega:   {pronta_entrega}")
        print(f"Total Sob Encomenda:        {sob_encomenda}")
        print(f"----------------------------------------")
    finally:
        db.close()

# execução
if __name__ == "__main__":
    target = Path(sys.argv[1]) if len(sys.argv) > 1 else DEFAULT_EXCEL_PATH
    sync_catalog(target)
