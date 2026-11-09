# imports
import os
import re
import shutil
import sqlite3
import unicodedata
from pathlib import Path
from PIL import Image
import pandas as pd

# config
BASE_DIR = Path(__file__).resolve().parent.parent
DB_PATHS = [BASE_DIR / "dev_database.db", BASE_DIR / "backend" / "dev_database.db"]
SOURCE_CAIRU = Path(r"C:\Users\USUARIO\Downloads\CAIRU")
SOURCE_CATALOGO_FOTOS = Path(r"C:\Users\USUARIO\Downloads\Resultado_Catalogo_Bicicletas\Resultado_Catalogo_Bicicletas\fotos_por_codigo")
EXCEL_CATALOGO = Path(r"C:\Users\USUARIO\Downloads\Resultado_Catalogo_Bicicletas\Resultado_Catalogo_Bicicletas\relatorio_bicicletas.xlsx")

DEST_BICICLETAS = BASE_DIR / "frontend" / "public" / "produtos" / "bicicletas"

# funções
def norm(txt: str) -> str:
    return "".join(c for c in unicodedata.normalize("NFKD", txt) if not unicodedata.combining(c)).upper()

def safe_name(txt: str) -> str:
    cleaned = re.sub(r"[^A-Za-z0-9]+", "-", norm(txt)).strip("-").lower()
    return cleaned or "item"

def otimizar_e_salvar(origem: Path, destino: Path):
    destino.parent.mkdir(parents=True, exist_ok=True)
    with Image.open(origem) as img:
        img_rgb = img.convert("RGB")
        w, h = img_rgb.size
        img_rgb.save(destino, "WEBP", quality=85)
    return destino.stat().st_size, w, h

def vincular_no_banco(conn, produto_ids, rel_url, alt_text, is_primary, sort_order, w, h, size):
    c = conn.cursor()
    for pid in produto_ids:
        if is_primary:
            c.execute("UPDATE product_images SET is_primary = 0 WHERE product_id = ?", (pid,))
        
        existe = c.execute("SELECT id FROM product_images WHERE product_id = ? AND url = ?", (pid, rel_url)).fetchone()
        if not existe:
            c.execute("""
                INSERT INTO product_images (product_id, storage_key, url, alt_text, sort_order, is_primary, width, height, file_size, mime_type, created_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'image/webp', CURRENT_TIMESTAMP)
            """, (pid, rel_url, rel_url, alt_text, sort_order, 1 if is_primary else 0, w, h, size))
        elif is_primary:
            c.execute("UPDATE product_images SET is_primary = 1 WHERE id = ?", (existe[0],))

def processar_bicicletas_cairu(conns):
    print("\n--- PROCESSANDO BICICLETAS CAIRU (PASTA CAIRU) ---")
    if not SOURCE_CAIRU.exists():
        print("Pasta CAIRU não encontrada.")
        return

    arquivos = sorted(list(SOURCE_CAIRU.glob("*.*")))
    total_processado = 0

    c0 = conns[0].cursor()
    for arq in arquivos:
        if arq.suffix.lower() not in {".png", ".jpg", ".jpeg", ".webp", ".jfif"}:
            continue

        nome = norm(arq.stem)
        for pfx in ["FBICICLETA", "ICICLETA", "BICICLETA", "TRICICLO"]:
            if nome.startswith(pfx):
                nome = nome[len(pfx):].strip()
                break

        base = re.sub(r"\(.*?\)", "", nome).strip()
        termos = [t for t in re.sub(r"[^A-Z0-9]+", " ", base).split() if len(t) > 1 and t not in ["CAIRU", "MTB", "REB"]]

        query = "SELECT id, sku, name FROM products WHERE name LIKE '%CAIRU%'"
        params = []
        for t in termos[:3]:
            query += " AND name LIKE ?"
            params.append(f"%{t}%")

        prods = c0.execute(query, params).fetchall()
        if not prods:
            print(f"[!] Sem match para: {arq.name}")
            continue

        p_ids = [p[0] for p in prods]
        nome_webp = "cairu-" + safe_name(arq.stem) + ".webp"
        dest_path = DEST_BICICLETAS / nome_webp
        file_size, w, h = otimizar_e_salvar(arq, dest_path)
        rel_url = f"/produtos/bicicletas/{nome_webp}"

        for conn in conns:
            vincular_no_banco(conn, p_ids, rel_url, prods[0][2], is_primary=True, sort_order=0, w=w, h=h, size=file_size)

        total_processado += 1
        print(f"[OK] {arq.name} -> {rel_url} vinculado a {len(p_ids)} produtos (Capa)")

    print(f"Total fotos de modelos Cairu processadas: {total_processado}")

def processar_catalogo_bicicletas(conns):
    print("\n--- PROCESSANDO FOTOS EXTRAÍDAS DO CATÁLOGO DE BICICLETAS ---")
    if not EXCEL_CATALOGO.exists() or not SOURCE_CATALOGO_FOTOS.exists():
        print("Arquivos de catálogo de bicicletas não encontrados.")
        return

    df = pd.read_excel(EXCEL_CATALOGO, sheet_name="Produtos encontrados")
    c0 = conns[0].cursor()
    total_processado = 0

    for _, row in df.iterrows():
        sku = str(row["Código"]).strip()
        ref = str(row["Ref. Fornecedor/Produto"]).strip()
        
        foto_path = SOURCE_CATALOGO_FOTOS / f"{ref}_catalogo-bicicleta.jpg"
        if not foto_path.exists():
            continue

        prods = c0.execute("SELECT id, name FROM products WHERE sku = ?", (sku,)).fetchall()
        if not prods:
            continue

        p_ids = [p[0] for p in prods]
        nome_webp = f"catalogo-cairu-ref-{ref}.webp"
        dest_path = DEST_BICICLETAS / nome_webp
        
        if not dest_path.exists():
            file_size, w, h = otimizar_e_salvar(foto_path, dest_path)
        else:
            file_size = dest_path.stat().st_size
            with Image.open(dest_path) as im:
                w, h = im.size

        rel_url = f"/produtos/bicicletas/{nome_webp}"

        for conn in conns:
            # Foto de catálogo como adicional/galeria (ou capa caso ainda não tenha)
            tem_capa = conn.cursor().execute("SELECT id FROM product_images WHERE product_id = ? AND is_primary = 1", (p_ids[0],)).fetchone()
            is_primary = False if tem_capa else True
            vincular_no_banco(conn, p_ids, rel_url, prods[0][1], is_primary=is_primary, sort_order=5, w=w, h=h, size=file_size)

        total_processado += 1

    print(f"Total fotos de catálogo vinculadas por SKU/Ref: {total_processado}")

# execução
if __name__ == "__main__":
    conns = [sqlite3.connect(p) for p in DB_PATHS]
    try:
        processar_bicicletas_cairu(conns)
        processar_catalogo_bicicletas(conns)
        for c in conns:
            c.commit()
        print("\n[SUCESSO] Processamento de Bicicletas concluído!")
    finally:
        for c in conns:
            c.close()

