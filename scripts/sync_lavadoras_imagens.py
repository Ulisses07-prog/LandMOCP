# imports
import os
import sys
import shutil
import sqlite3
import unicodedata
import re
from pathlib import Path
from PIL import Image

# Configuração de encoding UTF-8 no terminal Windows
if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8")

# config
BASE_DIR = Path(__file__).resolve().parent.parent
ORIGEM_LAVADORAS = Path(r"C:\Users\USUARIO\Downloads\LAVADORAS")
DESTINO_FRONTEND = BASE_DIR / "frontend" / "public" / "produtos" / "lavadoras"
DESTINO_MEDIA = BASE_DIR / "media" / "uploads" / "lavadoras"
DB_PATHS = [BASE_DIR / "dev_database.db", BASE_DIR / "backend" / "dev_database.db"]

# Mapeamento dos grupos de imagens para queries SQL dos produtos
MAPA_GRUPOS = {
    "BRASTEMP_BWF14": {
        "marca": "Brastemp",
        "sql_where": "UPPER(name) LIKE '%BRASTEMP%BWF14%'",
    },
    "CONSUL_CWB09": {
        "marca": "Consul",
        "sql_where": "UPPER(name) LIKE '%CONSUL%CWB09%'",
    },
    "CONSUL_CWB10": {
        "marca": "Consul",
        "sql_where": "UPPER(name) LIKE '%CONSUL%CWB10%'",
    },
    "CONSUL_CWH12": {
        "marca": "Consul",
        "sql_where": "UPPER(name) LIKE '%CONSUL%CWH12%' OR UPPER(name) = 'LAVADORA CONSUL 12KG'",
    },
    "CONSUL_CWH11": {
        "marca": "Consul",
        "sql_where": "UPPER(name) LIKE '%CONSUL%CWH11%'",
    },
    "ELECTROLUX_LED09": {
        "marca": "Electrolux",
        "sql_where": "UPPER(name) LIKE '%ELECTROLUX%LED09%'",
    },
    "ELECTROLUX_LAC09": {
        "marca": "Electrolux",
        "sql_where": "UPPER(name) LIKE '%ELECTROLUX%LAC09%'",
    },
    "MIDEA_MA512": {
        "marca": "Midea",
        "sql_where": "UPPER(name) LIKE '%MIDEA%MA512%'",
    },
    "MUELLER_MLT10B": {
        "marca": "Mueller",
        "sql_where": "UPPER(name) LIKE '%MUELLER%MLT10B%'",
    },
    "MUELLER_ALLEGRA_10KG": {
        "marca": "Mueller",
        "sql_where": "UPPER(name) LIKE '%MUELLER%ALLEGRA%10KG%'",
    },
    "MUELLER_FAMILY_LITE": {
        "marca": "Mueller",
        "sql_where": "UPPER(name) LIKE '%MUELLER%FAMILY LITE%'",
    },
    "MUELLER_MLA13": {
        "marca": "Mueller",
        "sql_where": "UPPER(name) LIKE '%MUELLER%MLA13%'",
    },
    "MUELLER_MLA15": {
        "marca": "Mueller",
        "sql_where": "UPPER(name) LIKE '%MUELLER%MLA15%'",
    },
    "MUELLER_POPMATIC_8KG": {
        "marca": "Mueller",
        "sql_where": "UPPER(name) LIKE '%MUELLER%POPMATIC%8KG%'",
    },
    "NEWMAQ_10K_CLEAN": {
        "marca": "Newmaq",
        "sql_where": "UPPER(name) LIKE '%NEWMAQ%10K%CLEAN%' OR UPPER(name) LIKE '%NEWMAQ%CLEAN%10KG%'",
    },
    "NEWMAQ_16KG": {
        "marca": "Newmaq",
        "sql_where": "UPPER(name) LIKE '%NEWMAQ%16KG%'",
    },
    "WANKE_10KG_COMFORT": {
        "marca": "Wanke",
        "sql_where": "UPPER(name) LIKE '%WANKE%10KG%CAT COMFORT%'",
    },
    "WANKE_12KG_COMFORT": {
        "marca": "Wanke",
        "sql_where": "UPPER(name) LIKE '%WANKE%12KG%CAT COMFORT%'",
    },
    "WANKE_15KG_PREMIUM": {
        "marca": "Wanke",
        "sql_where": "UPPER(name) LIKE '%WANKE%15KG%CAT PREMIUM%'",
    },
    "WANKE_20KG_PREMIUM": {
        "marca": "Wanke",
        "sql_where": "UPPER(name) LIKE '%WANKE%20KG%CAT PREMIUM%'",
    },
    "WANKE_PAOLA_10KG": {
        "marca": "Wanke",
        "sql_where": "UPPER(name) LIKE '%WANKE%PAOLA%10KG%'",
    },
    "LIBELL_10KG": {
        "marca": "Libell",
        "sql_where": "UPPER(name) LIKE '%LIBELL%10%0 KG%'",
    },
    "LIBELL_14KG": {
        "marca": "Libell",
        "sql_where": "UPPER(name) LIKE '%LIBELL%14%0 KG%'",
    }
}

# funções
def normalizar_texto(texto: str) -> str:
    nfkd = unicodedata.normalize('NFKD', texto)
    sem_acento = "".join([c for c in nfkd if not unicodedata.combining(c)])
    limpo = re.sub(r'[^a-zA-Z0-9_\-\.]', '_', sem_acento)
    return re.sub(r'_+', '_', limpo).strip('_')

def identificar_grupo(nome_arquivo: str) -> str:
    fl = nome_arquivo.lower()
    if 'bwf14' in fl:
        return 'BRASTEMP_BWF14'
    if 'cwb09' in fl:
        return 'CONSUL_CWB09'
    if 'cwb10' in fl:
        return 'CONSUL_CWB10'
    if 'cwh12' in fl or 'cwm12' in fl:
        return 'CONSUL_CWH12'
    if 'cwh11' in fl:
        return 'CONSUL_CWH11'
    if 'led09' in fl:
        return 'ELECTROLUX_LED09'
    if 'lac09' in fl:
        return 'ELECTROLUX_LAC09'
    if 'midea' in fl or 'ma512' in fl:
        return 'MIDEA_MA512'
    if 'mlt10b' in fl:
        return 'MUELLER_MLT10B'
    if 'allegra' in fl:
        return 'MUELLER_ALLEGRA_10KG'
    if 'family lite' in fl:
        return 'MUELLER_FAMILY_LITE'
    if 'mla13' in fl:
        return 'MUELLER_MLA13'
    if 'mla15' in fl:
        return 'MUELLER_MLA15'
    if 'popmatic' in fl:
        return 'MUELLER_POPMATIC_8KG'
    if 'newmaq' in fl and '16kg' in fl:
        return 'NEWMAQ_16KG'
    if 'newmaq' in fl and ('10k' in fl or 'clean' in fl):
        return 'NEWMAQ_10K_CLEAN'
    if 'wanke' in fl and 'paola' in fl:
        return 'WANKE_PAOLA_10KG'
    if 'wanke' in fl and '10kg' in fl:
        return 'WANKE_10KG_COMFORT'
    if 'wanke' in fl and '12kg' in fl:
        return 'WANKE_12KG_COMFORT'
    if 'wanke' in fl and '15kg' in fl:
        return 'WANKE_15KG_PREMIUM'
    if 'wanke' in fl and '20kg' in fl:
        return 'WANKE_20KG_PREMIUM'
    if 'libell-10kg' in fl:
        return 'LIBELL_10KG'
    if 'libell-14kg' in fl:
        return 'LIBELL_14KG'
    return None

def calcular_prioridade(nome_arquivo: str) -> int:
    nl = nome_arquivo.lower()
    
    # 0 = Imagem Frontal principal / Capa
    if "frontal" in nl:
        if "branco" in nl or "bco" in nl:
            return 0
        if "prata" in nl:
            return 1
        if "preto" in nl or "preta" in nl:
            return 2
        return 0
    if "capa" in nl or "principal" in nl or "vf2" in nl:
        return 0
    if "libell-10kg-220304" in nl and "(1)" not in nl:
        return 0
    if "libell-14kg-317773" in nl and "(1)" not in nl:
        return 0
    if "wanke 12kg" in nl and ")1.webp" in nl:
        return 0
    if "wanke paola 10kg (" in nl and ").webp" in nl:
        return 0

    # 10 = Ângulos 3/4 e lateral
    if "3_4" in nl or "lateral" in nl:
        return 10
    
    # 20 = Outras variações de cores / vistas externas
    if "prata" in nl:
        return 20
    if "preto" in nl or "preta" in nl:
        return 21
    if "branco" in nl:
        return 22

    # 30 = Aberta / interior / superior / cima
    if "aberta" in nl or "aberto" in nl or "interior" in nl or "desmonta" in nl or "cima" in nl or "superior" in nl:
        return 30

    # 40 = Detalhes, painel, botões, dimensões, filtro
    if "painel" in nl or "detalhe" in nl or "bot" in nl or "dimen" in nl or "filtro" in nl:
        return 40

    return 50

def otimizar_salvar_webp(origem: Path, destino: Path, max_size=(1200, 1200)):
    try:
        with Image.open(origem) as img:
            w, h = img.size
            destino.parent.mkdir(parents=True, exist_ok=True)
            
            # Se já for webp e não precisar redimensionar grande, salvar otimizando
            if img.format == "WEBP" and w <= max_size[0] and h <= max_size[1] and origem.suffix.lower() == ".webp":
                shutil.copy2(origem, destino)
            else:
                img_rgb = img.convert("RGB")
                img_rgb.thumbnail(max_size, Image.Resampling.LANCZOS)
                w, h = img_rgb.size
                img_rgb.save(destino, "WEBP", quality=86, optimize=True)

            tamanho = destino.stat().st_size
            return True, w, h, tamanho
    except Exception as e:
        print(f"Erro ao processar {origem.name}: {e}")
        return False, 0, 0, 0

def processar_e_vincular_lavadoras():
    if not ORIGEM_LAVADORAS.exists():
        print(f"[ERRO] Pasta de origem não encontrada: {ORIGEM_LAVADORAS}")
        return

    DESTINO_FRONTEND.mkdir(parents=True, exist_ok=True)
    DESTINO_MEDIA.mkdir(parents=True, exist_ok=True)

    arquivos_origem = sorted([f for f in ORIGEM_LAVADORAS.iterdir() if f.is_file()])
    print(f"1. Lendo {len(arquivos_origem)} arquivos de {ORIGEM_LAVADORAS}...\n")

    # Mapear imagens por grupo
    grupos_imagens = {}
    for arq in arquivos_origem:
        # Pular duplicatas óbvias como " (1).webp"
        if " (1)." in arq.name:
            continue
            
        grupo_id = identificar_grupo(arq.name)
        if not grupo_id:
            print(f"  [AVISO] Arquivo não mapeado: {arq.name}")
            continue

        nome_base = normalizar_texto(arq.stem)
        nome_webp = f"{nome_base}.webp"
        dest_front = DESTINO_FRONTEND / nome_webp
        dest_media = DESTINO_MEDIA / nome_webp

        # Otimizar e salvar no frontend e media
        ok, w, h, size = otimizar_salvar_webp(arq, dest_front)
        if ok:
            shutil.copy2(dest_front, dest_media)
        else:
            continue

        prio = calcular_prioridade(arq.name)
        if grupo_id not in grupos_imagens:
            grupos_imagens[grupo_id] = []

        grupos_imagens[grupo_id].append({
            "arquivo_origem": arq.name,
            "nome_webp": nome_webp,
            "storage_key": f"produtos/lavadoras/{nome_webp}",
            "url": f"/produtos/lavadoras/{nome_webp}",
            "prioridade": prio,
            "width": w,
            "height": h,
            "size": size
        })

    # Ordenar imagens de cada grupo
    for g, itens in grupos_imagens.items():
        itens.sort(key=lambda x: (x["prioridade"], x["nome_webp"]))

    print(f"2. {len(grupos_imagens)} grupos de modelos preparados com sucesso.")

    # Atualizar bancos de dados
    for db_path in DB_PATHS:
        if not db_path.exists():
            continue

        print(f"\n3. Sincronizando com banco: {db_path}...")
        conn = sqlite3.connect(db_path)
        c = conn.cursor()

        total_produtos_afetados = 0
        total_imagens_inseridas = 0

        for grupo_id, config in MAPA_GRUPOS.items():
            if grupo_id not in grupos_imagens:
                continue

            imagens = grupos_imagens[grupo_id]
            marca = config["marca"]
            sql_where = config["sql_where"]

            c.execute(f"SELECT id, name, sku FROM products WHERE {sql_where}")
            produtos = c.fetchall()

            if not produtos:
                print(f"  [AVISO] Nenhum produto no banco para grupo: {grupo_id}")
                continue

            for prod_id, prod_nome, prod_sku in produtos:
                # Atualizar marca se vazia ou genérica
                c.execute("""
                    UPDATE products 
                    SET brand = ? 
                    WHERE id = ? AND (brand IS NULL OR brand = '' OR brand = 'Não Cadastrado' OR brand = 'Outros')
                """, (marca, prod_id))

                # Limpar imagens antigas
                c.execute("DELETE FROM product_images WHERE product_id = ?", (prod_id,))

                # Inserir galeria completa com frontal como primária (sort_order = 0)
                for idx, img in enumerate(imagens):
                    is_prim = 1 if idx == 0 else 0
                    c.execute("""
                        INSERT INTO product_images (
                            product_id, storage_key, url, alt_text, sort_order, is_primary,
                            width, height, file_size, mime_type, created_at
                        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'image/webp', datetime('now'))
                    """, (
                        prod_id,
                        img["storage_key"],
                        img["url"],
                        f"{prod_nome} - Imagem {idx + 1}",
                        idx,
                        is_prim,
                        img["width"],
                        img["height"],
                        img["size"]
                    ))
                    total_imagens_inseridas += 1

                total_produtos_afetados += 1

        conn.commit()
        conn.close()
        print(f"  -> Concluído: {total_produtos_afetados} produtos atualizados com {total_imagens_inseridas} imagens vinculadas.")

    print("\n[SUCESSO] Todas as imagens de lavadoras foram processadas e vinculadas perfeitamente!")

# execução
if __name__ == "__main__":
    processar_e_vincular_lavadoras()
