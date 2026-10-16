# imports
import os
import shutil
import sqlite3
import re
from pathlib import Path
from PIL import Image

# config
ORIGEM_ACP = Path(r"D:\ACP")
DESTINO_FRONTEND = Path("frontend/public/produtos/acp")
DESTINO_MEDIA = Path("media/uploads/acp")
DB_PATHS = [Path("dev_database.db"), Path("backend/dev_database.db")]

# Mapeamento de modelos ACP para busca no banco
MODELOS = [
    "CARLA", "BELLA", "DIANA", "MAYA", "WANESSA", "SAMIRA", "AYLA", "DEBORA", 
    "ISABELY", "NUBIA", "OLIVIA", "NICOLE", "HELOISA", "CASSIA", "LUNA", "EMILY", 
    "LANA", "HELENA", "MILENA", "MELISSA", "RAYANE", "NALU", "CHANEL", "IRIS", 
    "AGATA", "ZARA", "ATHENA"
]

# funções
def otimizar_e_salvar_webp(origem: Path, destino: Path, max_size=(1200, 1200)):
    try:
        with Image.open(origem) as img:
            img = img.convert("RGB")
            img.thumbnail(max_size, Image.Resampling.LANCZOS)
            destino.parent.mkdir(parents=True, exist_ok=True)
            img.save(destino, "WEBP", quality=82, optimize=True)
            return True
    except Exception as e:
        print(f"Erro ao processar imagem {origem.name}: {e}")
        return False

def extrair_modelo(nome_arquivo: str):
    nome_up = nome_arquivo.upper()
    for mod in MODELOS:
        if mod in nome_up:
            return mod
    return None

def sincronizar_catalogo():
    DESTINO_FRONTEND.mkdir(parents=True, exist_ok=True)
    DESTINO_MEDIA.mkdir(parents=True, exist_ok=True)

    print(f"1. Otimizando imagens de {ORIGEM_ACP} para WebP...")
    arquivos = [f for f in ORIGEM_ACP.iterdir() if f.is_file() and f.suffix.lower() in [".jpg", ".jpeg", ".png"]]
    
    imagens_processadas = {}
    for arq in arquivos:
        nome_limpo = re.sub(r"[^A-Za-z0-9_-]", "_", arq.stem).lower()
        nome_webp = f"{nome_limpo}.webp"
        dest_frontend = DESTINO_FRONTEND / nome_webp
        dest_media = DESTINO_MEDIA / nome_webp

        if not dest_frontend.exists():
            ok = otimizar_e_salvar_webp(arq, dest_frontend)
            if ok:
                shutil.copy2(dest_frontend, dest_media)
        else:
            if not dest_media.exists():
                shutil.copy2(dest_frontend, dest_media)

        modelo = extrair_modelo(arq.name)
        if modelo:
            if modelo not in imagens_processadas:
                imagens_processadas[modelo] = []
            
            # Priorizar imagens individuais de produto em vez de páginas completas do catálogo
            is_pagina_catalogo = "catalogo" in arq.name.lower() or "pagina" in arq.name.lower()
            url_publica = f"/produtos/acp/{nome_webp}"
            imagens_processadas[modelo].append({
                "storage_key": f"produtos/acp/{nome_webp}",
                "url": url_publica,
                "nome_original": arq.name,
                "is_pagina": is_pagina_catalogo
            })

    print(f"Total de {len(arquivos)} imagens otimizadas para WebP.")

    # 2. Atualizar Bancos SQLite
    for db_path in DB_PATHS:
        if not db_path.exists():
            continue

        print(f"\n2. Atualizando banco: {db_path}...")
        conn = sqlite3.connect(db_path)
        c = conn.cursor()

        produtos_atualizados = 0
        total_imagens_inseridas = 0

        for modelo, imgs in imagens_processadas.items():
            # Ordenar: fotos individuais primeiro, páginas de catálogo depois
            imgs_ordenadas = sorted(imgs, key=lambda x: (x["is_pagina"], x["nome_original"]))

            # Buscar produtos correspondentes no banco
            c.execute(
                "SELECT id, sku, name FROM products WHERE name LIKE ? AND name LIKE ?",
                ("%ACP%", f"%{modelo}%")
            )
            produtos = c.fetchall()

            for prod_id, sku, prod_nome in produtos:
                # Remover imagens antigas do produto
                c.execute("DELETE FROM product_images WHERE product_id = ?", (prod_id,))

                # Inserir as imagens vinculadas
                for idx, img_info in enumerate(imgs_ordenadas[:4]):  # até 4 imagens por produto
                    is_prim = 1 if idx == 0 else 0
                    c.execute("""
                        INSERT INTO product_images (
                            product_id, storage_key, url, alt_text, sort_order, is_primary, created_at
                        ) VALUES (?, ?, ?, ?, ?, ?, datetime('now'))
                    """, (
                        prod_id,
                        img_info["storage_key"],
                        img_info["url"],
                        f"{prod_nome} - {modelo}",
                        idx,
                        is_prim
                    ))
                    total_imagens_inseridas += 1

                produtos_atualizados += 1

        conn.commit()
        conn.close()
        print(f"-> {produtos_atualizados} produtos atualizados com {total_imagens_inseridas} imagens vinculadas.")

    print("\nSincronização 100% concluída!")

# execução
if __name__ == "__main__":
    sincronizar_catalogo()
