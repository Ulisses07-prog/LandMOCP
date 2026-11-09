# imports
import os
import sys
import re
import unicodedata
import shutil
import sqlite3
import pandas as pd
from pathlib import Path

# config
BASE_DIR = Path(__file__).resolve().parent.parent
PRODUTOS_DIR = BASE_DIR / "Produtos"
QUANTIDADES_DIR = BASE_DIR / "Quantidades"
DB_PATHS = [BASE_DIR / "backend" / "dev_database.db", BASE_DIR / "dev_database.db"]

# funções
def norm(txt: str) -> str:
    return "".join(c for c in unicodedata.normalize("NFKD", str(txt)) if not unicodedata.combining(c)).upper()

def slugify(text: str) -> str:
    s = unicodedata.normalize("NFKD", str(text)).encode("ascii", "ignore").decode("ascii")
    s = re.sub(r"[^a-zA-Z0-9]+", "-", s.strip().lower()).strip("-")
    return s or "item"

def parse_float(val):
    if pd.isna(val) or val is None:
        return 0.0
    if isinstance(val, (int, float)):
        return float(val)
    s = str(val).strip().replace("R$", "").replace(" ", "")
    if "," in s and "." in s:
        s = s.replace(".", "").replace(",", ".")
    elif "," in s:
        s = s.replace(",", ".")
    try:
        return float(s)
    except Exception:
        return 0.0

def parse_int(val):
    if pd.isna(val) or val is None:
        return 0
    if isinstance(val, (int, float)):
        return int(val)
    s = str(val).strip().replace(".", "").replace(",", ".")
    try:
        return int(float(s))
    except Exception:
        return 0

def clean_str(val):
    if pd.isna(val) or val is None:
        return None
    s = str(val).strip()
    return s if s and s.lower() != "nan" else None

def encontrar_arquivo_mais_recente(diretorio: Path, extensoes=(".xlsx", ".xls")):
    arquivos = [f for f in diretorio.glob("*.*") if f.suffix.lower() in extensoes and not f.name.startswith("~$")]
    if not arquivos:
        return None
    return max(arquivos, key=lambda f: f.stat().st_mtime)

def get_or_create_categoria(c, nome_dept, cache):
    nome = (nome_dept or "Geral").strip().title()
    slug = slugify(nome)
    if slug in cache:
        return cache[slug]
    
    row = c.execute("SELECT id FROM categories WHERE slug = ?", (slug,)).fetchone()
    if row:
        cat_id = row[0]
    else:
        c.execute("INSERT INTO categories (name, slug, active, created_at) VALUES (?, ?, 1, CURRENT_TIMESTAMP)", (nome, slug))
        cat_id = c.lastrowid
    cache[slug] = cat_id
    return cat_id

def atualizar_catalogo():
    file_produtos = encontrar_arquivo_mais_recente(PRODUTOS_DIR)
    file_quantidades = encontrar_arquivo_mais_recente(QUANTIDADES_DIR)
    
    print(f"[ARQUIVOS DETECTADOS]")
    print(f"  Planilha Produtos:    {file_produtos.name if file_produtos else 'Nenhum'}")
    print(f"  Planilha Quantidades: {file_quantidades.name if file_quantidades else 'Nenhum'}")
    
    if not file_produtos or not file_quantidades:
        print("[ERRO] Arquivos necessários não encontrados!")
        return

    # Usar a cópia do backend como principal e depois espelhar
    primary_db = DB_PATHS[0]
    conn = sqlite3.connect(primary_db)
    c = conn.cursor()
    
    cat_cache = {}
    
    # 1. Carregar planilha de Produtos
    print(f"\n[1/3] Processando planilha de Produtos: {file_produtos.name}...")
    df_p = pd.read_excel(file_produtos)
    
    novos_prods = 0
    atualizados_p = 0
    
    # Obter todos os SKUs existentes
    existentes = {str(r[1]): r[0] for r in c.execute("SELECT id, sku FROM products WHERE sku IS NOT NULL").fetchall()}
    
    for _, row in df_p.iterrows():
        raw_code = row.get("Código")
        if pd.isna(raw_code):
            continue
        code = str(int(raw_code) if isinstance(raw_code, (int, float)) else raw_code).strip()
        if not code or code == "nan":
            continue
            
        name = clean_str(row.get("Descrição")) or f"Produto {code}"
        dept = clean_str(row.get("Departamento")) or "Móveis"
        cat_id = get_or_create_categoria(c, dept, cat_cache)
        
        price = parse_float(row.get("Preço Padrão (R$)"))
        stock = parse_int(row.get("Estoque"))
        avail = "Pronta Entrega" if stock > 0 else "Sob Encomenda"
        
        brand = clean_str(row.get("Marca"))
        color = clean_str(row.get("Cor"))
        
        alt = clean_str(row.get("Altura"))
        lar = clean_str(row.get("Largura"))
        prof = clean_str(row.get("Profundidade"))
        dims = f"{alt} x {lar} x {prof} cm" if (alt and lar and prof) else None
        
        weight_val = clean_str(row.get("Peso Líquido")) or clean_str(row.get("Peso Bruto"))
        weight = f"{weight_val} kg" if weight_val else None
        
        short_desc = clean_str(row.get("TAG e-commerce")) or clean_str(row.get("Grupo"))
        description = clean_str(row.get("Descrição e-commerce")) or clean_str(row.get("Descrição Complementar"))
        
        group_name = clean_str(row.get("Grupo"))
        subgroup = clean_str(row.get("Subgrupo"))
        
        if code in existentes:
            # Atualiza apenas valores e atributos, sem deletar referências
            pid = existentes[code]
            c.execute("""
                UPDATE products 
                SET price = CASE WHEN ? > 0 THEN ? ELSE price END,
                    stock = ?,
                    availability = ?,
                    name = COALESCE(?, name),
                    brand = COALESCE(?, brand),
                    color = COALESCE(?, color),
                    dimensions = COALESCE(?, dimensions),
                    weight = COALESCE(?, weight),
                    description = COALESCE(?, description),
                    short_description = COALESCE(?, short_description),
                    group_name = COALESCE(?, group_name),
                    subgroup = COALESCE(?, subgroup),
                    category_id = ?,
                    updated_at = CURRENT_TIMESTAMP
                WHERE id = ?
            """, (price, price, stock, avail, name, brand, color, dims, weight, description, short_desc, group_name, subgroup, cat_id, pid))
            atualizados_p += 1
        else:
            # Cria novo produto
            slug_base = f"{slugify(name)}-{code}"[:190]
            # Garantir slug unico se necessario
            slug_count = c.execute("SELECT count(*) FROM products WHERE slug = ?", (slug_base,)).fetchone()[0]
            if slug_count > 0:
                slug_base = f"{slug_base}-{code}"[:190]

            c.execute("""
                INSERT INTO products (
                    sku, slug, category_id, name, brand, short_description, 
                    description, price, dimensions, weight, color, stock, 
                    availability, is_featured, status, group_name, subgroup,
                    created_at, updated_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 'PUBLISHED', ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
            """, (code, slug_base, cat_id, name[:200], brand, short_desc, description, price, dims, weight, color, stock, avail, group_name, subgroup))
            existentes[code] = c.lastrowid
            novos_prods += 1

    conn.commit()
    print(f"  -> Produtos existentes atualizados: {atualizados_p}")
    print(f"  -> Novos produtos cadastrados:       {novos_prods}")

    # 2. Carregar planilha de Quantidades (Estoque detalhado atual)
    print(f"\n[2/3] Processando planilha de Quantidades: {file_quantidades.name}...")
    df_q = pd.read_excel(file_quantidades)
    
    atualizados_q = 0
    for _, row in df_q.iterrows():
        raw_code = row.get("Código")
        if pd.isna(raw_code):
            continue
        code = str(int(raw_code) if isinstance(raw_code, (int, float)) else raw_code).strip()
        if not code or code == "nan":
            continue
            
        stock = parse_int(row.get("Estoque"))
        avail = "Pronta Entrega" if stock > 0 else "Sob Encomenda"
        venda_price = parse_float(row.get("Valor Unitário Venda"))
        
        if code in existentes:
            pid = existentes[code]
            if venda_price > 0:
                c.execute("""
                    UPDATE products 
                    SET stock = ?,
                        availability = ?,
                        price = CASE WHEN (price = 0 OR price IS NULL) THEN ? ELSE price END,
                        updated_at = CURRENT_TIMESTAMP
                    WHERE id = ?
                """, (stock, avail, venda_price, pid))
            else:
                c.execute("""
                    UPDATE products 
                    SET stock = ?,
                        availability = ?,
                        updated_at = CURRENT_TIMESTAMP
                    WHERE id = ?
                """, (stock, avail, pid))
            atualizados_q += 1

    conn.commit()
    print(f"  -> Quantidades de estoque sincronizadas: {atualizados_q}")

    # Estatísticas Finais
    total_prods = c.execute("SELECT count(*) FROM products").fetchone()[0]
    pronta_ent = c.execute("SELECT count(*) FROM products WHERE availability = 'Pronta Entrega'").fetchone()[0]
    sob_enc = c.execute("SELECT count(*) FROM products WHERE availability = 'Sob Encomenda'").fetchone()[0]
    com_preco = c.execute("SELECT count(*) FROM products WHERE price > 0").fetchone()[0]
    
    conn.close()

    # Sincronizar para o banco da raiz
    print(f"\n[3/3] Espelhando banco sincronizado para {DB_PATHS[1].name}...")
    shutil.copy2(primary_db, DB_PATHS[1])
    
    print("\n[RESUMO DA ATUALIZAÇÃO]")
    print(f"Total de produtos no catálogo:   {total_prods}")
    print(f"Produtos com preço cadastrado:   {com_preco}")
    print(f"Itens com Pronta Entrega:        {pronta_ent}")
    print(f"Itens Sob Encomenda:             {sob_enc}")
    print("Sincronização 100% concluída com sucesso!")

# execução
if __name__ == "__main__":
    atualizar_catalogo()
