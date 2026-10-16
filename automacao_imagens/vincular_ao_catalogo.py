# imports
import os
import sys
import shutil
import sqlite3
import re
from pathlib import Path

# Configurar stdout para UTF-8 no Windows
if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8")

# config
BASE_DIR = Path(__file__).resolve().parent.parent
DIR_IMAGENS = BASE_DIR / "frontend" / "public" / "produtos" / "acp"
DB_PATHS = [BASE_DIR / "dev_database.db", BASE_DIR / "backend" / "dev_database.db"]

# Mapeamento pré-processado das páginas de catálogo para velocidade e precisão absoluta
ESPECIFICACOES_PAGINAS = {
    # LANA
    "roupeiro_roupeirolana_00029.webp": {"modelo": "LANA", "portas": 6},
    "roupeiro_lana_00031.webp": {"modelo": "LANA", "portas": 4},
    "roupeiro_lana_00033.webp": {"modelo": "LANA", "portas": 3},
    # MAYA
    "roup_acp_maya_04p_branco.webp": {"modelo": "MAYA", "portas": 4},
    "roup_acp_maya_04p_cianooffwhite.webp": {"modelo": "MAYA", "portas": 4},
    "roup_acp_maya_04p_interno.webp": {"modelo": "MAYA", "portas": 4},
    "roup_acp_maya_04p_nature.webp": {"modelo": "MAYA", "portas": 4},
    "roup_acp_maya_06p_bc.webp": {"modelo": "MAYA", "portas": 6},
    "roup_acp_maya_06p_cianooffwhite.webp": {"modelo": "MAYA", "portas": 6},
    "roup_acp_maya_06p_interno.webp": {"modelo": "MAYA", "portas": 6},
    "roup_acp_maya_06p_nature.webp": {"modelo": "MAYA", "portas": 6},
    "roup_acp_maya_06p_nature_offwhite.webp": {"modelo": "MAYA", "portas": 6},
    # DEBORA
    "roupeiro_debora_00017.webp": {"modelo": "DEBORA", "portas": 6},
    "roupeiro_debora_00019.webp": {"modelo": "DEBORA", "portas": 4},
    "roupeiro_acp_debora_branco-2_easy-resize_com_.webp": {"modelo": "DEBORA", "portas": None},
    "roupeiro_acp_debora_cinamomo-5_easy-resize_com_.webp": {"modelo": "DEBORA", "portas": None},
    "roupeiro_acp_debora_cinamomo-off-3_easy-resize_com_.webp": {"modelo": "DEBORA", "portas": None},
    "roupeiro_acp_debora_nature-off-5_easy-resize_com_.webp": {"modelo": "DEBORA", "portas": None},
    # OLIVIA
    "roupeiro_olivia_00009.webp": {"modelo": "OLIVIA", "portas": 6},
    "roupeiro_olivia_00011.webp": {"modelo": "OLIVIA", "portas": 4},
    # SAMIRA
    "roupeiro_samira_00041.webp": {"modelo": "SAMIRA", "portas": 2},
    "roupeiro_acp_samira2p_c_esp_-_branco.webp": {"modelo": "SAMIRA", "portas": 2},
    "roupeiro_acp_samira2p_c_esp_-_brancolilas.webp": {"modelo": "SAMIRA", "portas": 2},
    "roupeiro_acp_samira2p_c_esp_interno.webp": {"modelo": "SAMIRA", "portas": 2},
    "roupeiro_acp_samira_02p_natureoffwhite.webp": {"modelo": "SAMIRA", "portas": 2},
    # NUBIA, WANESSA, NICOLE, HELOISA, CASSIA, EMILY, HELENA, MILENA, MELISSA, AYLA, ISABELY
    "roupeiro_nubia_00005.webp": {"modelo": "NUBIA", "portas": 6},
    "roupeiro_wanessa_00007.webp": {"modelo": "WANESSA", "portas": 2},
    "roupeiro-wanessa-02-pts-branco-com-espelho-ambientada.webp": {"modelo": "WANESSA", "portas": 2},
    "roupeiro-wanessa-02-pts-nature-com-espelho-ambientada.webp": {"modelo": "WANESSA", "portas": 2},
    "roupeiro-wanessa-02-pts-nature-grafite-interior.webp": {"modelo": "WANESSA", "portas": 2},
    "roupeiro-wanessa-02-pts-nature-off-white-com-espelho-ambientada.webp": {"modelo": "WANESSA", "portas": 2},
    "roupeiro_nicole_00013.webp": {"modelo": "NICOLE", "portas": 2},
    "roupeiro_heloisa_00015.webp": {"modelo": "HELOISA", "portas": 2},
    "roupeiro_cassia_00023.webp": {"modelo": "CASSIA", "portas": 6},
    "roupeiro_emily_00027.webp": {"modelo": "EMILY", "portas": 4},
    "roupeiro_helena_00035.webp": {"modelo": "HELENA", "portas": 2},
    "roupeiro_milena_00039.webp": {"modelo": "MILENA", "portas": 4},
    "roupeiro_melissa_00043.webp": {"modelo": "MELISSA", "portas": 2},
    "roupeiro_roupeiroayla_00037.webp": {"modelo": "AYLA", "portas": 2},
    "roupeiro_acp_isabely_4_-_cinamomooff_white.webp": {"modelo": "ISABELY", "portas": 4},
    "roupeiro_acp_isabely_4_p_-_branco.webp": {"modelo": "ISABELY", "portas": 4},
    "roupeiro_acp_isabely_4_p_-_naturyoff.webp": {"modelo": "ISABELY", "portas": 4},
    # COMODAS (DIANA, NALU, RAYANE)
    "comoda_diana_00045.webp": {"modelo": "DIANA", "gavetas": 5},
    "comoda_acp_diana_branco_easy-resize_com-5.webp": {"modelo": "DIANA", "gavetas": 5},
    "comoda_acp_diana_cinamomo-12_easy-resize_com_.webp": {"modelo": "DIANA", "gavetas": 5},
    "comoda_acp_diana_cinamomo-interno-1diana_easy-resize_com_.webp": {"modelo": "DIANA", "gavetas": 5},
    "comoda_acp_diana_cinamomo-off-white_easy-resize_com_.webp": {"modelo": "DIANA", "gavetas": 5},
    "comoda_acp_diana_natura-off-white_easy-resize_com_.webp": {"modelo": "DIANA", "gavetas": 5},
    "comoda_rayane_00047.webp": {"modelo": "RAYANE", "gavetas": 5},
    "comoda_nalu_00049.webp": {"modelo": "NALU", "gavetas": 8},
}

MODELOS_CONHECIDOS = [
    "CARLA", "BELLA", "DIANA", "MAYA", "WANESSA", "SAMIRA", "AYLA", "DEBORA", 
    "ISABELY", "NUBIA", "OLIVIA", "NICOLE", "HELOISA", "CASSIA", "LUNA", "EMILY", 
    "LANA", "HELENA", "MILENA", "MELISSA", "RAYANE", "NALU", "CHANEL", "IRIS", 
    "AGATA", "ZARA", "ATHENA"
]

# funções
def extrair_specs_produto(nome_produto: str):
    t = nome_produto.upper()
    
    # 1. Identificar modelo
    modelo_encontrado = None
    for mod in MODELOS_CONHECIDOS:
        if mod in t:
            modelo_encontrado = mod
            break

    # 2. Identificar portas
    m_p = re.search(r'(\d+)\s*(?:PTS|PTAS|PORTAS|P\b|PORTA)', t)
    portas = int(m_p.group(1)) if m_p else None

    # 3. Identificar gavetas
    m_g = re.search(r'(\d+)\s*(?:GAV|GAVETAS)', t)
    gav = int(m_g.group(1)) if m_g else None

    return {"modelo": modelo_encontrado, "portas": portas, "gavetas": gav}

def extrair_specs_imagem(nome_arquivo: str):
    if nome_arquivo in ESPECIFICACOES_PAGINAS:
        return ESPECIFICACOES_PAGINAS[nome_arquivo]

    t = nome_arquivo.upper()
    modelo = None
    for mod in MODELOS_CONHECIDOS:
        if mod in t:
            modelo = mod
            break

    m_p = re.search(r'(\d+)\s*(?:PTS|PTAS|PORTAS|P\b|PORTA)', t)
    portas = int(m_p.group(1)) if m_p else None

    m_g = re.search(r'(\d+)\s*(?:GAV|GAVETAS)', t)
    gav = int(m_g.group(1)) if m_g else None

    return {"modelo": modelo, "portas": portas, "gavetas": gav}

def vincular_imagens_estritas():
    print("=" * 65)
    print("🎯 VINCULANDO IMAGENS COM PRECISÃO DE MODELO + PORTAS + GAVETAS")
    print("=" * 65)

    if not DIR_IMAGENS.exists():
        print(f"[ERRO] Pasta {DIR_IMAGENS} não encontrada.")
        return

    arquivos = [f for f in DIR_IMAGENS.iterdir() if f.is_file() and f.suffix.lower() == ".webp"]
    print(f"Total de {len(arquivos)} imagens WebP disponíveis.")

    # Mapear imagens por modelo e especificações
    banco_imagens = []
    for arq in arquivos:
        specs = extrair_specs_imagem(arq.name)
        if specs["modelo"]:
            is_pagina = "catalogo" in arq.name.lower() or "pagina" in arq.name.lower() or bool(re.search(r'\d{5}', arq.name))
            banco_imagens.append({
                "arquivo": arq.name,
                "url": f"/produtos/acp/{arq.name}",
                "modelo": specs["modelo"],
                "portas": specs.get("portas"),
                "gavetas": specs.get("gavetas"),
                "is_pagina": is_pagina
            })

    for db_path in DB_PATHS:
        if not db_path.exists():
            continue

        print(f"\nProcessando banco: {db_path.name}...")
        conn = sqlite3.connect(db_path)
        c = conn.cursor()

        # Limpar vínculos antigos da ACP para reconstruir sem erros
        c.execute("""
            DELETE FROM product_images
            WHERE product_id IN (
                SELECT id FROM products WHERE name LIKE '%ACP%'
            )
        """)
        conn.commit()

        # Buscar todos os produtos ACP
        c.execute("SELECT id, sku, name FROM products WHERE name LIKE '%ACP%'")
        produtos = c.fetchall()

        vinculados = 0
        total_imagens = 0

        for prod_id, sku, nome_prod in produtos:
            p_specs = extrair_specs_produto(nome_prod)
            p_mod = p_specs["modelo"]
            p_portas = p_specs["portas"]
            p_gav = p_specs["gavetas"]

            if not p_mod:
                continue

            # Filtrar imagens candidatas estritamente compatíveis
            candidatas = []
            for img in banco_imagens:
                if img["modelo"] != p_mod:
                    continue

                # Se o produto tem número de portas definido, a imagem DEVE bater
                if p_portas is not None:
                    if img["portas"] is not None and img["portas"] != p_portas:
                        continue  # Rejeita 6 portas para produto de 4 portas!

                # Se o produto tem número de gavetas definido, a imagem DEVE bater
                if p_gav is not None:
                    if img["gavetas"] is not None and img["gavetas"] != p_gav:
                        continue

                candidatas.append(img)

            if not candidatas:
                continue

            # Ordenar: fotos individuais de produto primeiro, páginas de catálogo depois
            candidatas_ordenadas = sorted(candidatas, key=lambda x: (x["is_pagina"], x["arquivo"]))

            for idx, img_info in enumerate(candidatas_ordenadas[:4]):
                is_prim = 1 if idx == 0 else 0
                c.execute("""
                    INSERT INTO product_images (product_id, storage_key, url, alt_text, sort_order, is_primary, created_at)
                    VALUES (?, ?, ?, ?, ?, ?, datetime('now'))
                """, (
                    prod_id,
                    f"produtos/acp/{img_info['arquivo']}",
                    img_info["url"],
                    f"{nome_prod}",
                    idx,
                    is_prim
                ))
                total_imagens += 1

            vinculados += 1

        conn.commit()
        conn.close()
        print(f"  -> [OK] {vinculados} produtos ACP vinculados estritamente com {total_imagens} imagens.")

    print("\n" + "=" * 65)
    print("🎉 VINCULAÇÃO ESTRITA CONCLUÍDA SEM CONFLITO DE PORTAS!")
    print("=" * 65)

# execução
if __name__ == "__main__":
    vincular_imagens_estritas()
