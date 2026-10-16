# imports
import os
import sys
import shutil
import sqlite3
import unicodedata
import re
import pandas as pd
from pathlib import Path

# Configurar stdout para UTF-8 no Windows
if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8")

# config
BASE_DIR = Path(__file__).resolve().parent.parent
DIR_PRODUTOS = BASE_DIR / "Produtos"
DIR_QUANTIDADES = BASE_DIR / "Quantidades"
DB_ROOT = BASE_DIR / "dev_database.db"
DB_BACKEND = BASE_DIR / "backend" / "dev_database.db"

# funções
def get_latest_file(folder: Path, extensions=(".xlsx", ".xls")):
    files = [f for f in folder.glob("*") if f.suffix.lower() in extensions]
    if not files:
        return None
    return max(files, key=lambda f: f.stat().st_mtime)

def slugify(text: str) -> str:
    s = unicodedata.normalize("NFKD", str(text)).encode("ascii", "ignore").decode("ascii")
    s = re.sub(r"[^a-zA-Z0-9]+", "-", s.strip().lower()).strip("-")
    return s or "item"

def clean_str(val):
    if pd.isna(val) or val is None:
        return None
    s = str(val).strip()
    return s if s else None

def pipeline_atualizacao():
    print("=" * 65)
    print("🚀 INICIANDO ATUALIZAÇÃO COMPLETA COM AS PLANILHAS DE HOJE")
    print("=" * 65)

    planilha_produtos = get_latest_file(DIR_PRODUTOS)
    planilha_quantidades = get_latest_file(DIR_QUANTIDADES)

    if not planilha_produtos:
        print("[ERRO] Nenhuma planilha encontrada na pasta Produtos!")
        return
    if not planilha_quantidades:
        print("[ERRO] Nenhuma planilha encontrada na pasta Quantidades!")
        return

    print(f"📦 Planilha de Produtos:    {planilha_produtos.name}")
    print(f"📊 Relatório de Estoque:    {planilha_quantidades.name}")
    print("-" * 65)

    conn = sqlite3.connect(DB_ROOT)
    c = conn.cursor()

    # 1. SINCRONIZAR PRODUTOS E CADASTROS
    print("\n[1/5] Processando cadastro de produtos...")
    df_prod = pd.read_excel(planilha_produtos)
    if "Ativo" in df_prod.columns:
        df_prod = df_prod[df_prod["Ativo"].astype(str).str.lower().str.strip() == "sim"]

    print(f"  -> Total de produtos ativos na planilha: {len(df_prod)}")

    # Obter categorias existentes
    c.execute("SELECT id, slug FROM categories")
    cat_cache = {slug: _id for _id, slug in c.fetchall()}

    def get_or_create_cat(dept_name: str) -> int:
        name = (dept_name or "Móveis").strip().title()
        slug = slugify(name)
        if slug in cat_cache:
            return cat_cache[slug]
        c.execute("INSERT INTO categories (name, slug, sort_order, active) VALUES (?, ?, 10, 1)", (name, slug))
        new_id = c.lastrowid
        cat_cache[slug] = new_id
        return new_id

    # Carregar produtos existentes por SKU
    c.execute("SELECT id, sku FROM products WHERE sku IS NOT NULL")
    prod_cache = {str(sku).strip(): _id for _id, sku in c.fetchall()}

    inseridos = 0
    atualizados = 0

    for _, row in df_prod.iterrows():
        raw_code = row.get("Código")
        if pd.isna(raw_code):
            continue
        code = str(int(raw_code) if isinstance(raw_code, (int, float)) else raw_code).strip()
        if not code or code == "nan":
            continue

        dept = clean_str(row.get("Departamento")) or "Móveis"
        cat_id = get_or_create_cat(dept)

        name = clean_str(row.get("Descrição")) or f"Produto {code}"
        brand = clean_str(row.get("Marca"))
        group_name = clean_str(row.get("Grupo"))
        subgroup = clean_str(row.get("Subgrupo"))
        color = clean_str(row.get("Cor"))

        raw_price = row.get("Preço Padrão (R$)", 0.0)
        try:
            price = float(raw_price) if not pd.isna(raw_price) else 0.0
        except Exception:
            price = 0.0

        # Dimensões
        alt = clean_str(row.get("Altura"))
        lar = clean_str(row.get("Largura"))
        prof = clean_str(row.get("Profundidade"))
        dims = f"{alt} x {lar} x {prof} cm" if (alt and lar and prof) else None
        weight = clean_str(row.get("Peso Líquido")) or clean_str(row.get("Peso Bruto"))
        short_desc = clean_str(row.get("TAG e-commerce")) or group_name
        description = clean_str(row.get("Descrição e-commerce")) or clean_str(row.get("Descrição Complementar"))

        prod_id = prod_cache.get(code)
        if prod_id:
            c.execute("""
                UPDATE products
                SET name = ?, brand = ?, group_name = ?, subgroup = ?, color = ?,
                    price = ?, dimensions = ?, weight = ?, short_description = ?,
                    description = ?, category_id = ?, updated_at = datetime('now')
                WHERE id = ?
            """, (name, brand, group_name, subgroup, color, price, dims, f"{weight} kg" if weight else None,
                  short_desc, description, cat_id, prod_id))
            atualizados += 1
        else:
            slug = f"{slugify(name)}-{code}"[:190]
            c.execute("""
                INSERT INTO products (
                    sku, slug, category_id, name, brand, group_name, subgroup, color,
                    price, dimensions, weight, short_description, description,
                    availability, stock, status, is_featured, created_at, updated_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Sob Encomenda', 0, 'PUBLISHED', 0, datetime('now'), datetime('now'))
            """, (code, slug, cat_id, name, brand, group_name, subgroup, color, price, dims,
                  f"{weight} kg" if weight else None, short_desc, description))
            prod_cache[code] = c.lastrowid
            inseridos += 1

    conn.commit()
    print(f"  -> {atualizados} produtos atualizados e {inseridos} novos produtos inseridos.")

    # 2. ATUALIZAR ESTOQUES E PRONTA ENTREGA
    print("\n[2/5] Atualizando posição de estoque real...")
    df_quant = pd.read_excel(planilha_quantidades)
    estoque_atualizado = 0
    pronta_entrega = 0

    for _, row in df_quant.iterrows():
        raw_code = row.get("Código")
        if pd.isna(raw_code):
            continue
        code = str(int(raw_code) if isinstance(raw_code, (int, float)) else raw_code).strip()
        if not code or code == "nan":
            continue

        prod_id = prod_cache.get(code)
        if not prod_id:
            continue

        raw_stock = row.get("Estoque", 0)
        try:
            stock = int(float(str(raw_stock).replace(".", "").replace(",", "."))) if not pd.isna(raw_stock) else 0
        except Exception:
            stock = 0

        avail = "Pronta Entrega" if stock > 0 else "Sob Encomenda"
        if stock > 0:
            pronta_entrega += 1

        c.execute("UPDATE products SET stock = ?, availability = ? WHERE id = ?", (stock, avail, prod_id))
        estoque_atualizado += 1

    conn.commit()
    print(f"  -> Estoque atualizado para {estoque_atualizado} produtos ({pronta_entrega} com Pronta Entrega).")

    # 3. CONSOLIDAR GRADES E DUPLICATAS
    print("\n[3/5] Consolidando grades de produtos repetidos...")
    # Arquivar volumes
    c.execute("""
        UPDATE products 
        SET status = 'ARCHIVED'
        WHERE (name LIKE 'VOLUME %' OR name LIKE 'VOL. %' OR price < 10)
    """)

    c.execute("""
        SELECT trim(upper(name)) as nome_norm, count(*) as qtd
        FROM products
        WHERE status != 'ARCHIVED'
        GROUP BY trim(upper(name))
        HAVING qtd > 1
    """)
    grupos = c.fetchall()
    consolidados = 0

    for nome_norm, _ in grupos:
        c.execute("""
            SELECT id, sku, stock, availability
            FROM products
            WHERE trim(upper(name)) = ? AND status != 'ARCHIVED'
            ORDER BY id ASC
        """, (nome_norm,))
        itens = c.fetchall()
        if not itens:
            continue

        def score_mestre(item):
            _id, sku, stock, avail = item
            tem_hifen = 1 if (sku and "-" in str(sku)) else 0
            estoque = stock if (stock and stock > 0) else 0
            return (tem_hifen, -estoque, _id)

        itens_ord = sorted(itens, key=score_mestre)
        mestre_id = itens_ord[0][0]
        filhos_ids = [f[0] for f in itens_ord[1:]]

        estoque_total = sum((it[2] or 0) for it in itens)
        disp = "Pronta Entrega" if estoque_total > 0 else "Sob Encomenda"

        c.execute("UPDATE products SET stock = ?, availability = ?, status = 'PUBLISHED' WHERE id = ?", (estoque_total, disp, mestre_id))

        if filhos_ids:
            placeholders = ",".join("?" for _ in filhos_ids)
            c.execute(f"UPDATE products SET status = 'VARIATION' WHERE id IN ({placeholders})", filhos_ids)
            
            # Migrar imagens dos filhos para o mestre
            c.execute("SELECT url FROM product_images WHERE product_id = ?", (mestre_id,))
            urls_mestre = set(r[0] for r in c.fetchall())
            for f_id in filhos_ids:
                c.execute("SELECT storage_key, url, alt_text FROM product_images WHERE product_id = ?", (f_id,))
                for s_key, url, alt in c.fetchall():
                    if url not in urls_mestre:
                        urls_mestre.add(url)
                        c.execute("""
                            INSERT INTO product_images (product_id, storage_key, url, alt_text, sort_order, is_primary, created_at)
                            VALUES (?, ?, ?, ?, 1, 0, datetime('now'))
                        """, (mestre_id, s_key, url, alt))

        consolidados += 1

    conn.commit()
    conn.close()
    print(f"  -> {consolidados} grupos de grade consolidados com sucesso.")

    # 4. REAPLICAR FOTOS REAIS ACP
    print("\n[4/5] Garantindo vinculação de fotos reais aos produtos...")
    from sync_acp_images import sincronizar_catalogo
    sincronizar_catalogo()

    # 5. SINCRONIZAR BANCO COM BACKEND
    print("\n[5/5] Sincronizando banco SQLite com a pasta do Backend...")
    shutil.copy2(DB_ROOT, DB_BACKEND)
    print(f"  -> {DB_BACKEND} atualizado ({DB_BACKEND.stat().st_size} bytes).")

    print("\n" + "=" * 65)
    print("🎉 ATUALIZAÇÃO CONCLUÍDA COM SUCESSO!")
    print("=" * 65)

# execução
if __name__ == "__main__":
    pipeline_atualizacao()
