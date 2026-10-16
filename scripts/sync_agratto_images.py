# imports
import os
import shutil
import sqlite3
import re
from pathlib import Path
from PIL import Image

# config
ORIGEM_AGRATTO = Path(r"D:\AGRATTO")
DESTINO_FRONTEND = Path("frontend/public/produtos/agratto")
DESTINO_MEDIA = Path("media/uploads/agratto")
DB_PATHS = [Path("dev_database.db"), Path("backend/dev_database.db")]

# Mapeamento dos produtos Agratto para as páginas e cortes do catálogo
MAPEAMENTO_PRODUTOS = [
    {
        "sku": "1041",
        "nome_busca": "CHURRASQUEIRA ELETRICA AGRATTO CH2-02",
        "pagina": 7,
        "tipo_corte": "metade_esquerda",
        "slug": "churrasqueira-eletrica-agratto-ch2-02"
    },
    {
        "sku": "3096",
        "nome_busca": "SANDUICHEIRA AGRATTO E GRILL SA-02 BLACK",
        "pagina": 5,
        "tipo_corte": "topo_direita",
        "slug": "sanduicheira-agratto-e-grill-sa-02-black"
    },
    {
        "sku": "3097",
        "nome_busca": "SANDUICHEIRA AGRATTO INOX 2 SID02 750W",
        "pagina": 5,
        "tipo_corte": "base_direita",
        "slug": "sanduicheira-agratto-inox-2-sid02-750w"
    },
    {
        "sku": "2444",
        "nome_busca": "PANELA DE PRESSAO AGRATTO ELETRICA 4,0L DIGI.PED02",
        "pagina": 9,
        "tipo_corte": "inteira",
        "slug": "panela-de-pressao-agratto-eletrica-4-0l-digi-ped02"
    },
    {
        "sku": "2464",
        "nome_busca": "PANELA ELETRICA AGRATTO DE ARROZ RISO PA 10XIC",
        "pagina": 10,
        "tipo_corte": "metade_esquerda",
        "slug": "panela-eletrica-agratto-de-arroz-riso-pa-10xic"
    },
    {
        "sku": "1658",
        "nome_busca": "FERRO AGRATTO A SECO FACILE FF-02",
        "pagina": 13,
        "tipo_corte": "topo",
        "slug": "ferro-agratto-a-seco-facile-ff-02"
    },
    {
        "sku": "1659",
        "nome_busca": "FERRO AGRATTO A VAPOR  VAPORE FV-02",
        "pagina": 13,
        "tipo_corte": "base",
        "slug": "ferro-agratto-a-vapor-vapore-fv-02"
    },
]

# funções
def otimizar_salvar(img: Image.Image, destino: Path, max_size=(1200, 1200)):
    destino.parent.mkdir(parents=True, exist_ok=True)
    img_conv = img.convert("RGB")
    img_conv.thumbnail(max_size, Image.Resampling.LANCZOS)
    img_conv.save(destino, "WEBP", quality=85, optimize=True)

def recortar_imagem(img: Image.Image, tipo: str) -> Image.Image:
    w, h = img.size
    if tipo == "metade_esquerda":
        return img.crop((0, 0, w // 2, h))
    elif tipo == "metade_direita":
        return img.crop((w // 2, 0, w, h))
    elif tipo == "topo_direita":
        return img.crop((w // 2, 0, w, int(h * 0.6)))
    elif tipo == "base_direita":
        return img.crop((w // 2, int(h * 0.4), w, h))
    elif tipo == "topo":
        return img.crop((0, 0, w, int(h * 0.55)))
    elif tipo == "base":
        return img.crop((0, int(h * 0.45), w, h))
    return img

def sincronizar_catalogo_agratto():
    DESTINO_FRONTEND.mkdir(parents=True, exist_ok=True)
    DESTINO_MEDIA.mkdir(parents=True, exist_ok=True)

    if not ORIGEM_AGRATTO.exists():
        print(f"[ERRO] Pasta de origem não encontrada: {ORIGEM_AGRATTO}")
        return

    print("1. Processando páginas completas do Catálogo Agratto...")
    paginas_imgs = {}
    for i in range(1, 18):
        nome_orig = f"Catálogo - Agratto Eletro - 2020.1_{i:05d}.jpg"
        caminho_orig = ORIGEM_AGRATTO / nome_orig
        if caminho_orig.exists():
            im = Image.open(caminho_orig)
            paginas_imgs[i] = im

            nome_webp = f"catalogo_agratto_pagina_{i:02d}.webp"
            dest_front = DESTINO_FRONTEND / nome_webp
            dest_med = DESTINO_MEDIA / nome_webp

            otimizar_salvar(im, dest_front)
            shutil.copy2(dest_front, dest_med)
            print(f"  [OK] Página {i:02d} otimizada -> {nome_webp}")

    print("\n2. Gerando fotos recortadas dos produtos específicos...")
    produtos_processados = []

    for item in MAPEAMENTO_PRODUTOS:
        pag_num = item["pagina"]
        if pag_num not in paginas_imgs:
            continue

        im_pag = paginas_imgs[pag_num]
        corte = recortar_imagem(im_pag, item["tipo_corte"])

        nome_corte = f"produto_{item['slug']}.webp"
        dest_corte_front = DESTINO_FRONTEND / nome_corte
        dest_corte_med = DESTINO_MEDIA / nome_corte

        otimizar_salvar(corte, dest_corte_front)
        shutil.copy2(dest_corte_front, dest_corte_med)
        print(f"  [OK] Foto do produto gerada: {nome_corte}")

        produtos_processados.append({
            "sku": item["sku"],
            "nome_busca": item["nome_busca"],
            "img_principal": {
                "storage_key": f"produtos/agratto/{nome_corte}",
                "url": f"/produtos/agratto/{nome_corte}",
                "alt": item["nome_busca"]
            },
            "img_catalogo": {
                "storage_key": f"produtos/agratto/catalogo_agratto_pagina_{pag_num:02d}.webp",
                "url": f"/produtos/agratto/catalogo_agratto_pagina_{pag_num:02d}.webp",
                "alt": f"Catálogo Oficial Agratto - Página {pag_num:02d}"
            }
        })

    print(f"\n3. Atualizando tabelas SQLite com as fotos da Agratto...")
    for db_path in DB_PATHS:
        if not db_path.exists():
            continue

        conn = sqlite3.connect(db_path)
        c = conn.cursor()
        total_atualizados = 0

        for prod in produtos_processados:
            c.execute("SELECT id, name FROM products WHERE sku = ? OR name LIKE ?", (prod["sku"], f"%{prod['sku']}%"))
            rows = c.fetchall()
            if not rows:
                c.execute("SELECT id, name FROM products WHERE name LIKE ?", (f"%{prod['nome_busca']}%",))
                rows = c.fetchall()

            for prod_id, prod_nome in rows:
                # Atualizar marca para AGRATTO
                c.execute("UPDATE products SET brand = 'AGRATTO' WHERE id = ?", (prod_id,))

                # Limpar imagens anteriores para evitar duplicações
                c.execute("DELETE FROM product_images WHERE product_id = ?", (prod_id,))

                # Inserir imagem 1 (Produto recortado - Principal)
                c.execute("""
                    INSERT INTO product_images (product_id, storage_key, url, alt_text, sort_order, is_primary, created_at)
                    VALUES (?, ?, ?, ?, 0, 1, datetime('now'))
                """, (
                    prod_id,
                    prod["img_principal"]["storage_key"],
                    prod["img_principal"]["url"],
                    prod["img_principal"]["alt"]
                ))

                # Inserir imagem 2 (Página completa do catálogo)
                c.execute("""
                    INSERT INTO product_images (product_id, storage_key, url, alt_text, sort_order, is_primary, created_at)
                    VALUES (?, ?, ?, ?, 1, 0, datetime('now'))
                """, (
                    prod_id,
                    prod["img_catalogo"]["storage_key"],
                    prod["img_catalogo"]["url"],
                    prod["img_catalogo"]["alt"]
                ))

                total_atualizados += 1
                print(f"  [OK] Produto ID {prod_id} ('{prod_nome}') atualizado com sucesso!")

        conn.commit()
        conn.close()
        print(f"-> Banco {db_path.name}: {total_atualizados} produtos atualizados.")

    print("\n[SUCESSO] Sincronização da Agratto concluída com sucesso!")

# execução
if __name__ == "__main__":
    sincronizar_catalogo_agratto()
