# imports
import os
import re
import sqlite3
from pathlib import Path
from PIL import Image

# config
DIR_CAVAZOTTO = Path("frontend/public/images/products/cavazotto")
DB_PATHS = [Path("backend/dev_database.db"), Path("dev_database.db")]

# funções
def converter_para_webp(caminho_origem: Path) -> Path:
    """Converte e otimiza imagens para WebP se ainda estiverem em JPG"""
    if caminho_origem.suffix.lower() == ".webp":
        return caminho_origem
    destino_webp = caminho_origem.with_suffix(".webp")
    if not destino_webp.exists():
        img = Image.open(caminho_origem).convert("RGB")
        img.save(destino_webp, "WEBP", quality=90)
    return destino_webp

def classificar_imagem(nome_arquivo: str):
    nome = nome_arquivo.lower()
    
    tipo = None
    if "cama" in nome:
        tipo = "CAMA"
    elif "cozinha" in nome or "armario" in nome:
        tipo = "COZINHA"
    elif "comoda" in nome:
        tipo = "COMODA"
    elif "multiuso" in nome:
        tipo = "MULTIUSO"
    elif "roupeiro" in nome:
        tipo = "ROUPEIRO"
    elif "cabeceira" in nome or "criado" in nome:
        tipo = "CABECEIRA"

    modelo = None
    for m in ["grecia", "berlim", "berlin", "brasil", "santiago", "nova", "paris", "bogota", "dublin", "vegas"]:
        if m in nome:
            modelo = "BERLIM" if m == "berlin" else m.upper()
            break

    # Quantidade de portas
    portas = None
    m_pts = re.search(r'(\d+)\s*[-_]?(?:pts|portas|p|pt)', nome)
    if m_pts:
        portas = int(m_pts.group(1))

    # Gavetas (especialmente para cômodas)
    gavetas = None
    m_gav = re.search(r'(\d+)\s*[-_]?gav', nome)
    if m_gav:
        gavetas = int(m_gav.group(1))

    subtipo = None
    if "sapateira" in nome or "sapateiro" in nome:
        subtipo = "SAPATEIRA"
    elif "capelinha" in nome:
        subtipo = "CAPELINHA"
    elif "casal" in nome:
        subtipo = "CASAL"
    elif "solteiro" in nome:
        subtipo = "SOLTEIRO"

    # Ângulo (Ambiente = frontal/externo, Fundo-Interno = interno/aberto)
    is_interno = 1 if "fundo-interno" in nome else 0

    return {
        "arquivo": nome_arquivo,
        "tipo": tipo,
        "modelo": modelo,
        "portas": portas,
        "gavetas": gavetas,
        "subtipo": subtipo,
        "is_interno": is_interno
    }

def mapear_produto_banco(nome_produto: str):
    nome = nome_produto.upper()
    
    tipo = None
    if "CAMA" in nome:
        tipo = "CAMA"
    elif "COZINHA" in nome or "ARMARIO" in nome:
        tipo = "COZINHA"
    elif "COMODA" in nome:
        tipo = "COMODA"
    elif "MULTIUSO" in nome:
        tipo = "MULTIUSO"
    elif "ROUPEIRO" in nome:
        tipo = "ROUPEIRO"
    elif "CABECEIRA" in nome or "CRIADO" in nome:
        tipo = "CABECEIRA"

    modelo = None
    for m in ["GRECIA", "BERLIM", "BERLIN", "BRASIL", "SANTIAGO", "NOVA", "PARIS", "BOGOTA", "DUBLIN", "VEGAS"]:
        if m in nome:
            modelo = "BERLIM" if m == "BERLIN" else m
            break

    portas = None
    m_pts = re.search(r'(\d+)\s*[-_]?(?:PTS|PORTAS|P|PT)', nome)
    if m_pts:
        portas = int(m_pts.group(1))

    gavetas = None
    m_gav = re.search(r'(\d+)\s*[-_]?GAV', nome)
    if m_gav:
        gavetas = int(m_gav.group(1))

    subtipo = None
    if "SAPATEIR" in nome:
        subtipo = "SAPATEIRA"
    elif "CAPELINHA" in nome:
        subtipo = "CAPELINHA"
    elif "CASAL" in nome:
        subtipo = "CASAL"
    elif "SOLT" in nome:
        subtipo = "SOLTEIRO"

    return {
        "tipo": tipo,
        "modelo": modelo,
        "portas": portas,
        "gavetas": gavetas,
        "subtipo": subtipo
    }

def vincular_cavazotto():
    print("=" * 65)
    print("INICIANDO VINCULACAO ESTRITA DAS IMAGENS CAVAZOTTO")
    print("=" * 65)

    if not DIR_CAVAZOTTO.exists():
        print(f"[-] Diretorio {DIR_CAVAZOTTO} nao encontrado!")
        return

    # 1. Catalogar e converter todas as imagens da pasta
    banco_imagens = []
    for f in DIR_CAVAZOTTO.iterdir():
        if f.is_file() and f.suffix.lower() == ".webp":
            info = classificar_imagem(f.name)
            info["url"] = f"/images/products/cavazotto/{f.name}"
            banco_imagens.append(info)

    print(f"[+] Total de imagens WebP catalogadas: {len(banco_imagens)}")

    # 2. Conectar aos bancos e vincular a cada produto
    for db_path in DB_PATHS:
        if not db_path.exists():
            continue

        print(f"\n[*] Atualizando banco de dados: {db_path}")
        conn = sqlite3.connect(db_path)
        c = conn.cursor()

        # Buscar todos os produtos Cavazotto que nao sejam pecas avulsas
        c.execute("""
            SELECT id, name, sku FROM products 
            WHERE name LIKE '%CAVAZOTTO%' 
              AND name NOT LIKE 'PORTA %' 
              AND name NOT LIKE 'KIT %' 
              AND name NOT LIKE 'PAINEL %'
        """)
        produtos = c.fetchall()
        print(f"  -> Total de produtos Cavazotto (moveis principais): {len(produtos)}")

        total_vinculados = 0
        total_imagens_inseridas = 0

        for prod_id, prod_name, sku in produtos:
            p_meta = mapear_produto_banco(prod_name)
            
            # Buscar imagens compativeis
            candidatas = []
            for img in banco_imagens:
                # Regra 1: Tipo deve bater
                if p_meta["tipo"] and img["tipo"] and p_meta["tipo"] != img["tipo"]:
                    continue

                # Regra 2: Modelo deve bater (se ambos tiverem modelo definido)
                if p_meta["modelo"] and img["modelo"] and p_meta["modelo"] != img["modelo"]:
                    continue

                # Regra 3: Portas deve bater
                if p_meta["portas"] is not None and img["portas"] is not None:
                    if p_meta["portas"] != img["portas"]:
                        continue

                # Regra 4: Subtipo Sapateira deve bater estritamente
                is_prod_sapateira = (p_meta["subtipo"] == "SAPATEIRA")
                is_img_sapateira = (img["subtipo"] == "SAPATEIRA")
                if is_prod_sapateira != is_img_sapateira:
                    continue

                # Regra 5: Gavetas (especialmente para comodas)
                if p_meta["gavetas"] is not None and img["gavetas"] is not None:
                    if p_meta["gavetas"] != img["gavetas"]:
                        continue
                elif p_meta["gavetas"] is not None and img["gavetas"] is None and not is_img_sapateira:
                    continue

                # Regra 6: Solteiro vs Casal para camas
                if p_meta["tipo"] == "CAMA":
                    if p_meta["subtipo"] and img["subtipo"] and p_meta["subtipo"] != img["subtipo"]:
                        continue

                candidatas.append(img)

            if not candidatas:
                continue

            # Limpar imagens antigas desse produto
            c.execute("DELETE FROM product_images WHERE product_id = ?", (prod_id,))

            # Ordenar: Vista Externa/Ambiente primeiro (is_interno == 0), depois Interno (is_interno == 1)
            candidatas_ordenadas = sorted(candidatas, key=lambda x: (x["is_interno"], x["arquivo"]))

            # Inserir até 4 fotos por produto
            for idx, img in enumerate(candidatas_ordenadas[:4]):
                is_prim = 1 if idx == 0 else 0
                c.execute("""
                    INSERT INTO product_images (product_id, storage_key, url, alt_text, sort_order, is_primary, created_at)
                    VALUES (?, ?, ?, ?, ?, ?, datetime('now'))
                """, (
                    prod_id,
                    f"images/products/cavazotto/{img['arquivo']}",
                    img["url"],
                    f"{prod_name} - {img['arquivo'].split('.')[0]}",
                    idx,
                    is_prim
                ))
                total_imagens_inseridas += 1

            total_vinculados += 1

        conn.commit()
        conn.close()
        print(f"  -> [SUCESSO] {total_vinculados} produtos Cavazotto vinculados com {total_imagens_inseridas} fotos de alta resolução!")

# execução
if __name__ == "__main__":
    vincular_cavazotto()
