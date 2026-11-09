# imports
import os
import re
import shutil
import sqlite3
import unicodedata
from pathlib import Path
from PIL import Image

# config
BASE_DIR = Path(__file__).resolve().parent.parent
DB_PATHS = [BASE_DIR / "dev_database.db", BASE_DIR / "backend" / "dev_database.db"]
SOURCE_FOGOES = Path(r"C:\Users\USUARIO\Downloads\fogoes")
SOURCE_COOKTOPS = Path(r"C:\Users\USUARIO\Downloads\Coocktop")

DEST_FOGOES = BASE_DIR / "frontend" / "public" / "produtos" / "fogoes"
DEST_COOKTOPS = BASE_DIR / "frontend" / "public" / "produtos" / "cooktops"

# funções
def norm(txt: str) -> str:
    return "".join(c for c in unicodedata.normalize("NFKD", txt) if not unicodedata.combining(c)).upper()

def safe_name(txt: str) -> str:
    cleaned = re.sub(r"[^A-Za-z0-9]+", "-", norm(txt)).strip("-").lower()
    return cleaned or "item"

def classificar_imagem(filename: str):
    f_upper = norm(filename)
    # Se contiver boca, mesa, lateral, tampo, forno, medidas, detalhe, aberta, chama, não é capa
    is_secundaria = any(w in f_upper for w in [
        "BOCA", "MESA", "LATERAL", "TAMPO", "FORNO", "MEDIDAS", "DETALHE", 
        "ABERTA", "CHAMA", "BALCAO", "PIA", "ACNENDEDOR", "ACENDEDOR"
    ])
    # Se contiver fronte, frente, frontal e não for secundária, é capa prioritária
    is_capa = ("FRONT" in f_upper or "FRENTE" in f_upper) and not is_secundaria
    return is_capa, is_secundaria

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
        # Se for primary, desmarca as outras para esse produto
        if is_primary:
            c.execute("UPDATE product_images SET is_primary = 0 WHERE product_id = ?", (pid,))
        
        # Verifica se já existe
        existe = c.execute("SELECT id FROM product_images WHERE product_id = ? AND url = ?", (pid, rel_url)).fetchone()
        if not existe:
            c.execute("""
                INSERT INTO product_images (product_id, storage_key, url, alt_text, sort_order, is_primary, width, height, file_size, mime_type, created_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'image/webp', CURRENT_TIMESTAMP)
            """, (pid, rel_url, rel_url, alt_text, sort_order, 1 if is_primary else 0, w, h, size))

def processar_fogoes(conns):
    print("\n--- PROCESSANDO FOGÕES ---")
    if not SOURCE_FOGOES.exists():
        print("Pasta fogoes não encontrada.")
        return

    # Mapeamento do modelo nas fotos para a busca no banco
    regras = [
        ("COLISEUM PLUS", lambda: ("SELECT id, name FROM products WHERE name LIKE '%COLISEUM PLUS%'", ())),
        ("MONACO TOP GLASS (PRETO)", lambda: ("SELECT id, name FROM products WHERE name LIKE '%MONACO TOP GLASS%' AND name LIKE '%4B%'", ())),
        ("5B MONACO TOP GLASS", lambda: ("SELECT id, name FROM products WHERE name LIKE '%MONACO TOP GLASS%' AND name LIKE '%5B%'", ())),
        ("5B MONACO PLUS (BRANCO)", lambda: ("SELECT id, name FROM products WHERE name LIKE '%MONACO PLUS%' AND name LIKE '%5B%'", ())),
        ("5B MONACO PLUS (PRETO)", lambda: ("SELECT id, name FROM products WHERE name LIKE '%MONACO PLUS%' AND name LIKE '%5B%'", ())),
        ("BRASLAR SIRIUS 4 BC", lambda: ("SELECT id, name FROM products WHERE name LIKE '%BRASLAR%SIRIUS 4 BC%' AND name NOT LIKE '%PLUS%'", ())),
        ("BRASLAR SIRIUS 5BC", lambda: ("SELECT id, name FROM products WHERE name LIKE '%BRASLAR%SIRIUS 5BC%' AND name NOT LIKE '%PLUS%'", ())),
        ("BRASLAR SIRIUS PLUS 4BC", lambda: ("SELECT id, name FROM products WHERE name LIKE '%BRASLAR%SIRIUS PLUS 4BC%'", ())),
        ("BRASLAR SIRIUS PLUS 5BC", lambda: ("SELECT id, name FROM products WHERE name LIKE '%BRASLAR%SIRIUS PLUS 5BC%'", ())),
        ("AGATA 05 BCS 5062", lambda: ("SELECT id, name FROM products WHERE name LIKE '%AGATA%5062%'", ())),
        ("CARIBE 04 BCS GLASS", lambda: ("SELECT id, name FROM products WHERE name LIKE '%CARIBE 04 BCS GLASS%'", ())),
    ]

    arquivos = sorted(list(SOURCE_FOGOES.glob("*.*")))
    total_processado = 0

    for arq in arquivos:
        if arq.suffix.lower() not in {".png", ".jpg", ".jpeg", ".webp"}:
            continue

        nome_f = norm(arq.name)
        matched_rule = None
        for tag, sql_fn in regras:
            if tag in nome_f:
                matched_rule = sql_fn
                break

        if not matched_rule:
            print(f"[!] Sem regra específica para: {arq.name}")
            continue

        query, params = matched_rule()
        c0 = conns[0].cursor()
        prods = c0.execute(query, params).fetchall()
        if not prods:
            print(f"[!] Nenhum produto encontrado no banco para: {arq.name}")
            continue

        p_ids = [p[0] for p in prods]
        is_capa, is_sec = classificar_imagem(arq.name)
        sort_order = 0 if is_capa else 10

        nome_webp = safe_name(arq.stem) + ".webp"
        dest_path = DEST_FOGOES / nome_webp
        file_size, w, h = otimizar_e_salvar(arq, dest_path)
        rel_url = f"/produtos/fogoes/{nome_webp}"

        for conn in conns:
            vincular_no_banco(conn, p_ids, rel_url, prods[0][1], is_capa, sort_order, w, h, file_size)

        total_processado += 1
        print(f"[OK] {arq.name} -> {rel_url} (Capa={is_capa}) vinculado a {len(p_ids)} produtos")

    print(f"Total fogões processados: {total_processado}")

def processar_cooktops(conns):
    print("\n--- PROCESSANDO COOKTOPS ---")
    if not SOURCE_COOKTOPS.exists():
        print("Pasta Coocktop não encontrada.")
        return

    regras = [
        ("BRASTEMP 5BCS", lambda: ("SELECT id, name FROM products WHERE sku = '1501' OR name LIKE '%BRASTEMP 5BCS MESA VIDRO PTO%'", ())),
        ("CDO60AEUNA", lambda: ("SELECT id, name FROM products WHERE sku = '1502' OR name LIKE '%CDO60AEUNA%'", ())),
        ("REALCE 4B", lambda: ("SELECT id, name FROM products WHERE sku = '4826' OR name = 'COOKTOP REALCE 4B'", ())),
        ("5B MEGA CHAMA", lambda: ("SELECT id, name FROM products WHERE sku = '4825' OR name = 'COOKTOP REALCE 5B'", ())),
        ("TRIPLA CHAMA", lambda: ("SELECT id, name FROM products WHERE sku = '4824' OR name LIKE '%TRIPLA CHAMA%'", ())),
    ]

    arquivos = sorted(list(SOURCE_COOKTOPS.glob("*.*")))
    total_processado = 0

    for arq in arquivos:
        if arq.suffix.lower() not in {".png", ".jpg", ".jpeg", ".webp", ".jfif"}:
            continue

        nome_f = norm(arq.name)
        matched_rule = None
        for tag, sql_fn in regras:
            if tag in nome_f:
                matched_rule = sql_fn
                break

        if not matched_rule:
            print(f"[!] Sem regra específica para: {arq.name}")
            continue

        query, params = matched_rule()
        c0 = conns[0].cursor()
        prods = c0.execute(query, params).fetchall()
        if not prods:
            print(f"[!] Nenhum produto encontrado no banco para: {arq.name}")
            continue

        p_ids = [p[0] for p in prods]
        is_capa, is_sec = classificar_imagem(arq.name)
        sort_order = 0 if is_capa else 10

        nome_webp = safe_name(arq.stem) + ".webp"
        dest_path = DEST_COOKTOPS / nome_webp
        file_size, w, h = otimizar_e_salvar(arq, dest_path)
        rel_url = f"/produtos/cooktops/{nome_webp}"

        for conn in conns:
            vincular_no_banco(conn, p_ids, rel_url, prods[0][1], is_capa, sort_order, w, h, file_size)

        total_processado += 1
        print(f"[OK] {arq.name} -> {rel_url} (Capa={is_capa}) vinculado a {len(p_ids)} produtos")

    print(f"Total cooktops processados: {total_processado}")

# execução
if __name__ == "__main__":
    conns = [sqlite3.connect(p) for p in DB_PATHS]
    try:
        processar_fogoes(conns)
        processar_cooktops(conns)
        for c in conns:
            c.commit()
        print("\n[SUCESSO] Todos os vínculos foram gravados nos bancos dev_database.db e backend/dev_database.db!")
    finally:
        for c in conns:
            c.close()

