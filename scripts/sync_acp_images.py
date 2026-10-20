# imports
import os
import shutil
import sqlite3
import re
from pathlib import Path
from PIL import Image

# config
BASE_DIR = Path(__file__).resolve().parent.parent
ORIGEM_ACP = Path(r"C:\Users\USUARIO\Downloads\ACP")
DESTINO_FRONTEND = BASE_DIR / "frontend" / "public" / "produtos" / "acp"
DESTINO_MEDIA = BASE_DIR / "media" / "uploads" / "acp"
DB_PATHS = [BASE_DIR / "dev_database.db", BASE_DIR / "backend" / "dev_database.db"]

MODELOS_MAP = {
    "MAYA": "MAYA",
    "AGATA": "AGATA",
    "DEBORA": "DEBORA",
    "DEORA": "DEBORA",
    "ATHENA": "ATHENA",
    "ATHENAS": "ATHENA",
    "NICOLE": "NICOLE",
    "HELENA": "HELENA",
    "ISABELY": "ISABELY",
    "MELISSA": "MELISSA",
    "PAOLA": "PAOLLA",
    "PAOLLA": "PAOLLA",
    "DIANA": "DIANA",
    "RAYANE": "RAYANE",
    "NALU": "NALU",
    "IRIS": "IRIS",
    "LANA": "LANA",
    "EMILY": "EMILY",
    "JAMILE": "JAMILE",
    "CARLA": "CARLA",
    "BELLA": "BELLA",
    "WANESSA": "WANESSA",
    "SAMIRA": "SAMIRA",
    "AYLA": "AYLA",
    "NUBIA": "NUBIA",
    "OLIVIA": "OLIVIA",
    "HELOISA": "HELOISA",
    "CASSIA": "CASSIA",
    "LUNA": "LUNA",
    "MILENA": "MILENA",
    "CHANEL": "CHANEL",
    "ZARA": "ZARA",
    "JULIANA": "JULIANA",
    "GABRIELA": "GABRIELA"
}

# funções
def otimizar_e_salvar_webp(origem: Path, destino: Path, max_size=(1200, 1200)):
    try:
        with Image.open(origem) as img:
            img = img.convert("RGB")
            img.thumbnail(max_size, Image.Resampling.LANCZOS)
            destino.parent.mkdir(parents=True, exist_ok=True)
            img.save(destino, "WEBP", quality=84, optimize=True)
            return True
    except Exception as e:
        print(f"Erro ao processar imagem {origem.name}: {e}")
        return False

def extrair_metadados(nome_arquivo: str):
    nome_up = nome_arquivo.upper()
    modelo = None
    for chave, mod in MODELOS_MAP.items():
        if re.search(rf"\b{chave}\b", nome_up) or chave in nome_up:
            modelo = mod
            break

    if not modelo:
        return None, None, False

    portas = None
    if re.search(r"(?:09|9)[-_ ]*GAV", nome_up):
        portas = "09GAV"
    elif re.search(r"(?:06|6)[-_ ]*P(?:T|TS)", nome_up):
        portas = "06PTS"
    elif re.search(r"(?:04|4)[-_ ]*P(?:T|TS)", nome_up):
        portas = "04PTS"
    elif re.search(r"(?:03|3)[-_ ]*P(?:T|TS)", nome_up):
        portas = "03PTS"
    elif re.search(r"(?:02|2)[-_ ]*P(?:T|TS)", nome_up):
        portas = "02PTS"

    is_detalhe = any(tag in nome_up for tag in ["INTERNO", "INT_", "ABERTO", "TIRO2", "ESPELHO"])
    is_interno = any(tag in nome_up for tag in ["INTERNO", "INT_", "ABERTO"])

    return modelo, portas, (is_interno, is_detalhe)

def sincronizar_catalogo():
    DESTINO_FRONTEND.mkdir(parents=True, exist_ok=True)
    DESTINO_MEDIA.mkdir(parents=True, exist_ok=True)

    if not ORIGEM_ACP.exists():
        print(f"[ERRO] Pasta {ORIGEM_ACP} não encontrada!")
        return

    print(f"1. Convertendo imagens de {ORIGEM_ACP} para WebP...")
    arquivos = [f for f in ORIGEM_ACP.iterdir() if f.is_file() and f.suffix.lower() in [".jpg", ".jpeg", ".png"]]
    
    convertidos = 0
    for arq in arquivos:
        nome_limpo = re.sub(r"[^A-Za-z0-9_-]", "_", arq.stem).lower()
        nome_limpo = re.sub(r"_+", "_", nome_limpo).strip("_")
        nome_webp = f"{nome_limpo}.webp"
        dest_frontend = DESTINO_FRONTEND / nome_webp
        dest_media = DESTINO_MEDIA / nome_webp

        if not dest_frontend.exists():
            if otimizar_e_salvar_webp(arq, dest_frontend):
                shutil.copy2(dest_frontend, dest_media)
                convertidos += 1
        else:
            if not dest_media.exists():
                shutil.copy2(dest_frontend, dest_media)

    print(f"  -> {len(arquivos)} imagens avaliadas ({convertidos} novas convertidas para WebP).")

    # Mapear imagens existentes por modelo e portas
    mapa_imagens = {}
    arquivos_webp = [f for f in DESTINO_FRONTEND.iterdir() if f.is_file() and f.suffix.lower() == ".webp"]

    for arq in arquivos_webp:
        modelo, portas, flags = extrair_metadados(arq.name)
        if not modelo:
            continue

        chave = (modelo, portas)
        if chave not in mapa_imagens:
            mapa_imagens[chave] = []

        is_interno, is_detalhe = flags
        prioridade = 2 if is_interno else (1 if is_detalhe else 0)

        mapa_imagens[chave].append({
            "storage_key": f"produtos/acp/{arq.name}",
            "url": f"/produtos/acp/{arq.name}",
            "prioridade": prioridade,
            "nome": arq.name
        })

    # Atualizar SQLite
    for db_path in DB_PATHS:
        if not db_path.exists():
            continue

        print(f"\n2. Atualizando banco: {db_path}...")
        conn = sqlite3.connect(db_path)
        c = conn.cursor()

        c.execute("SELECT id, name FROM products WHERE name LIKE ?", ("%ACP%",))
        produtos = c.fetchall()

        atualizados = 0
        total_imagens = 0

        for prod_id, prod_nome in produtos:
            prod_up = prod_nome.upper()
            prod_modelo = None
            for chave, mod in MODELOS_MAP.items():
                if mod in prod_up:
                    prod_modelo = mod
                    break

            if not prod_modelo:
                continue

            # Buscar correspondência exata de portas
            prod_portas = None
            if "09GAV" in prod_up or "9GAV" in prod_up:
                prod_portas = "09GAV"
            elif "06PTS" in prod_up or "6 PTS" in prod_up or "06 PTS" in prod_up:
                prod_portas = "06PTS"
            elif "04PTS" in prod_up or "4 PTS" in prod_up or "04 PTS" in prod_up:
                prod_portas = "04PTS"
            elif "03PTS" in prod_up or "3 PTS" in prod_up or "03 PTS" in prod_up:
                prod_portas = "03PTS"
            elif "02PTS" in prod_up or "2 PTS" in prod_up or "02 PTS" in prod_up:
                prod_portas = "02PTS"

            candidatas = []
            if (prod_modelo, prod_portas) in mapa_imagens:
                candidatas.extend(mapa_imagens[(prod_modelo, prod_portas)])
            
            if not candidatas and (prod_modelo, None) in mapa_imagens:
                candidatas.extend(mapa_imagens[(prod_modelo, None)])

            if not candidatas:
                # Fallback: qualquer imagem do mesmo modelo
                for (m, p), imgs in mapa_imagens.items():
                    if m == prod_modelo:
                        candidatas.extend(imgs)

            if not candidatas:
                continue

            # Ordenar para que a foto externa do produto fechado seja a primária
            candidatas_ordenadas = sorted(candidatas, key=lambda x: (x["prioridade"], x["nome"]))

            # Evitar URLs duplicadas
            urls_vistas = set()
            selecionadas = []
            for item in candidatas_ordenadas:
                if item["url"] not in urls_vistas:
                    urls_vistas.add(item["url"])
                    selecionadas.append(item)
                if len(selecionadas) >= 5:
                    break

            if not selecionadas:
                continue

            # Substituir imagens do produto
            c.execute("DELETE FROM product_images WHERE product_id = ?", (prod_id,))
            for idx, item in enumerate(selecionadas):
                is_prim = 1 if idx == 0 else 0
                c.execute("""
                    INSERT INTO product_images (
                        product_id, storage_key, url, alt_text, sort_order, is_primary, created_at
                    ) VALUES (?, ?, ?, ?, ?, ?, datetime('now'))
                """, (
                    prod_id,
                    item["storage_key"],
                    item["url"],
                    f"{prod_nome} - {prod_modelo}",
                    idx,
                    is_prim
                ))
                total_imagens += 1

            atualizados += 1

        conn.commit()
        conn.close()
        print(f"  -> {atualizados} produtos ACP atualizados com {total_imagens} imagens vinculadas.")

    print("\n[OK] Sincronizacao concluida com sucesso!")

# execução
if __name__ == "__main__":
    sincronizar_catalogo()
