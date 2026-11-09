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
    return "".join(c for c in unicodedata.normalize("NFKD", str(txt)) if not unicodedata.combining(c)).upper()

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

def resetar_imagens_bicicletas(conns):
    print("-> Limpando fotos antigas de bicicletas no banco...")
    for conn in conns:
        c = conn.cursor()
        c.execute("DELETE FROM product_images WHERE url LIKE '/produtos/bicicletas/%'")
        conn.commit()

def extrair_criterios(nome_arquivo: str):
    n = norm(nome_arquivo)
    
    # Aro
    aro_match = re.search(r"A-(\d\d)", n)
    aro = aro_match.group(1) if aro_match else None
    
    # Genero
    genero = None
    if "MASC" in n or "BOY" in n:
        genero = "MASC"
    elif "FEM" in n or "GIRL" in n:
        genero = "FEM"
        
    # Marchas / Câmbio
    has_21m = bool(re.search(r"(21M|21\s*MARCHA|21\s*MARCHAS|21V)", n))
    has_18v = bool(re.search(r"(18V|18\s*MARCHA|18\s*MARCHAS)", n))
    
    # Cesta / Cestão
    has_cestao = "CESTAO" in n
    has_ct = bool(re.search(r"(C-CT|C/CT|CESTA\b)", n)) and not has_cestao
    
    # Suspensão
    has_susp = bool(re.search(r"(SUSP|C-SUSP|C/SUSP)", n))
    
    # Modelos chave
    modelos = [
        "FLASH", "BELLA", "STAR GIRL", "GENOVA", "SUPER BOY", "SUPER BARRA", 
        "FADINHA", "FLOWERS", "FLOWER", "RACER", "POTENZA", "MALAGA", "LOTUS", 
        "JUMPERBOY", "CHARM", "BLACK", "FIRE-WATER", "FIRE/WATER", "FIREWATER", "SPACE", 
        "SHARK", "CARGA PESAD", "CROSS FLASH", "PRINCESS", "UNICORN", "HONEY ANGEL",
        "MINI SEREIA", "PLAY KIDS", "YOU 3 BOY", "YOU 3 GIRL", "KIDS 3", "YOU BOY", "YOU GIRL"
    ]
    modelo_encontrado = None
    for m in modelos:
        m_norm = norm(m).replace("-", " ")
        n_clean = n.replace("-", " ")
        if m_norm in n_clean:
            modelo_encontrado = m
            break
            
    return {
        "aro": aro,
        "genero": genero,
        "has_21m": has_21m,
        "has_18v": has_18v,
        "has_cestao": has_cestao,
        "has_ct": has_ct,
        "has_susp": has_susp,
        "modelo": modelo_encontrado
    }

def produto_atende_criterios(prod_nome: str, crit: dict) -> bool:
    pn = norm(prod_nome)
    
    # 1. Aro
    if crit["aro"]:
        if f"A-{crit['aro']}" not in pn and f"A {crit['aro']}" not in pn and f"ARO {crit['aro']}" not in pn:
            return False
            
    # 2. Modelo
    if crit["modelo"]:
        mod = re.sub(r"[^A-Z0-9]+", " ", norm(crit["modelo"])).strip()
        pn_clean = re.sub(r"[^A-Z0-9]+", " ", pn).strip()
        if mod not in pn_clean and mod.replace(" ", "") not in pn_clean.replace(" ", ""):
            return False
            
    # 3. Gênero (se aplicável ao produto)
    if crit["genero"]:
        if crit["genero"] == "MASC" and ("FEM" in pn or "GIRL" in pn):
            return False
        if crit["genero"] == "FEM" and ("MASC" in pn or "BOY" in pn):
            return False
            
    # 4. Marchas / Câmbio (REGRA ESTRITA)
    prod_has_21m = bool(re.search(r"(21M|21\s*MARCHA|21\s*MARCHAS|21V)", pn))
    prod_has_18v = bool(re.search(r"(18V|18\s*MARCHA|18\s*MARCHAS)", pn))
    
    if crit["has_21m"] != prod_has_21m:
        return False
    if crit["has_18v"] != prod_has_18v:
        return False
        
    # 5. Cestão / Cesta
    prod_has_cestao = "CESTAO" in pn
    if crit["has_cestao"] != prod_has_cestao:
        return False
        
    # 6. Suspensão
    prod_has_susp = bool(re.search(r"(SUSP|C-SUSP|C/SUSP)", pn))
    if crit["has_susp"] != prod_has_susp:
        return False

    return True

def vincular(conns, produto_ids, rel_url, alt_text, sort_order, w, h, size):
    for conn in conns:
        c = conn.cursor()
        for pid in produto_ids:
            existe = c.execute("SELECT id FROM product_images WHERE product_id = ? AND url = ?", (pid, rel_url)).fetchone()
            if not existe:
                c.execute("""
                    INSERT INTO product_images (product_id, storage_key, url, alt_text, sort_order, is_primary, width, height, file_size, mime_type, created_at)
                    VALUES (?, ?, ?, ?, ?, 0, ?, ?, ?, 'image/webp', CURRENT_TIMESTAMP)
                """, (pid, rel_url, rel_url, alt_text, sort_order, w, h, size))

def ajustar_capas(conns):
    print("-> Ajustando fotos primárias (is_primary)...")
    for conn in conns:
        c = conn.cursor()
        pids = [r[0] for r in c.execute("SELECT DISTINCT product_id FROM product_images WHERE url LIKE '/produtos/bicicletas/%'").fetchall()]
        for pid in pids:
            c.execute("UPDATE product_images SET is_primary = 0 WHERE product_id = ?", (pid,))
            primeira = c.execute("SELECT id FROM product_images WHERE product_id = ? AND url LIKE '/produtos/bicicletas/%' ORDER BY sort_order ASC, id ASC LIMIT 1", (pid,)).fetchone()
            if primeira:
                c.execute("UPDATE product_images SET is_primary = 1 WHERE id = ?", (primeira[0],))
        conn.commit()

def processar():
    conns = [sqlite3.connect(p) for p in DB_PATHS]
    resetar_imagens_bicicletas(conns)
    
    c0 = conns[0].cursor()
    todos_cairu = c0.execute("SELECT id, sku, name FROM products WHERE name LIKE '%CAIRU%'").fetchall()
    print(f"Total produtos Cairu no banco: {len(todos_cairu)}")
    
    # 1. Pasta CAIRU
    arquivos_cairu = sorted(list(SOURCE_CAIRU.glob("*.*")))
    vinculados_cairu = 0
    
    for arq in arquivos_cairu:
        if arq.suffix.lower() not in {".png", ".jpg", ".jpeg", ".webp", ".jfif"}:
            continue
            
        crit = extrair_criterios(arq.stem)
        matched_ids = []
        matched_names = []
        
        for p in todos_cairu:
            if produto_atende_criterios(p[2], crit):
                matched_ids.append(p[0])
                matched_names.append(p[2])
                
        if not matched_ids:
            print(f"[SEM MATCH] {arq.name} | Criterios: {crit}")
            continue
            
        nome_webp = "cairu-" + safe_name(arq.stem) + ".webp"
        dest_path = DEST_BICICLETAS / nome_webp
        file_size, w, h = otimizar_e_salvar(arq, dest_path)
        rel_url = f"/produtos/bicicletas/{nome_webp}"
        
        vincular(conns, matched_ids, rel_url, matched_names[0], sort_order=10, w=w, h=h, size=file_size)
        vinculados_cairu += 1
        print(f"[OK] {arq.name} -> {len(matched_ids)} produtos correspondentes")

    # 2. Fotos do Catálogo Oficial por Código / Referência
    if EXCEL_CATALOGO.exists() and SOURCE_CATALOGO_FOTOS.exists():
        print("\n-> Processando fotos do catálogo oficial (Excel)...")
        df = pd.read_excel(EXCEL_CATALOGO, sheet_name="Produtos encontrados")
        vinculados_cat = 0
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
            # Foto de catálogo com prioridade máxima como capa principal (sort_order = 0)
            vincular(conns, p_ids, rel_url, prods[0][1], sort_order=0, w=w, h=h, size=file_size)
            vinculados_cat += 1
            
        print(f"Fotos de catálogo vinculadas: {vinculados_cat}")
        
    ajustar_capas(conns)
    for conn in conns:
        conn.commit()
        conn.close()
    print("\n-> Processamento concluído com sucesso!")

# execução
if __name__ == "__main__":
    processar()
