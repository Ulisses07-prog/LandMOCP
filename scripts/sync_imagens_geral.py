# imports
import os
import sys
import shutil
import sqlite3
import re
from pathlib import Path
from PIL import Image

# Configuração de encoding UTF-8 no terminal Windows
if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8")

# config
DIR_IMAGENS_ORIGEM = Path(r"D:\imagens")
DIR_FRONTEND_PRODUTOS = Path("frontend/public/produtos")
DIR_MEDIA_UPLOADS = Path("media/uploads")
DB_PATHS = [Path("dev_database.db"), Path("backend/dev_database.db")]

# Stopwords que não devem ser usadas como tokens de busca
STOPWORDS = {
    "COM", "SEM", "PARA", "CASA", "FINAL", "AMBIENTE", "INTERNO", "INTERNA",
    "MEDIDAS", "OK", "COPIA", "EASY", "RESIZE", "DE", "DA", "DO", "EM",
    "BCO", "BC", "PT", "PTO", "PRETO", "BRANCO", "CINAMOMO", "NATURE", "OFF",
    "WHITE", "GRAFITE", "FOTO", "CATALOGO", "PAGINA", "REF", "NOVO", "01", "02"
}

# funções
def sanitizar_nome(texto: str) -> str:
    texto = texto.lower()
    texto = re.sub(r"[^a-z0-9_-]", "_", texto)
    return re.sub(r"_+", "_", texto).strip("_")

def extrair_tokens(nome_arquivo: str) -> list:
    stem = os.path.splitext(nome_arquivo)[0]
    # Quebra de camelCase
    s1 = re.sub(r'(.)([A-Z][a-z]+)', r'\1 \2', stem)
    s2 = re.sub(r'([a-z0-9])([A-Z])', r'\1 \2', s1)
    tokens_raw = re.split(r'[^a-zA-Z0-9]', s2)
    tokens = []
    for t in tokens_raw:
        t_up = t.upper().strip()
        if len(t_up) >= 3 and not t_up.isdigit() and t_up not in STOPWORDS:
            tokens.append(t_up)
    return tokens

def otimizar_salvar_webp(origem: Path, destino: Path, max_size=(1200, 1200)) -> bool:
    try:
        with Image.open(origem) as img:
            img = img.convert("RGB")
            img.thumbnail(max_size, Image.Resampling.LANCZOS)
            destino.parent.mkdir(parents=True, exist_ok=True)
            img.save(destino, "WEBP", quality=82, optimize=True)
            return True
    except Exception as e:
        print(f"Erro ao processar {origem.name}: {e}")
        return False

def sincronizar_todas_marcas():
    if not DIR_IMAGENS_ORIGEM.exists():
        print(f"[ERRO] Pasta {DIR_IMAGENS_ORIGEM} não encontrada.")
        return

    pastas_marcas = sorted([p for p in DIR_IMAGENS_ORIGEM.iterdir() if p.is_dir()])
    print(f"Iniciando sincronização de {len(pastas_marcas)} pastas de marcas em {DIR_IMAGENS_ORIGEM}...\n")

    conn = sqlite3.connect("dev_database.db")
    c = conn.cursor()

    total_fotos_convertidas = 0
    total_produtos_vinculados = 0

    for pasta in pastas_marcas:
        marca_nome = pasta.name.strip()
        marca_slug = sanitizar_nome(marca_nome)

        exts = (".jpg", ".jpeg", ".png", ".webp", ".avif")
        arquivos = []
        try:
            for entry in os.scandir(pasta):
                try:
                    if entry.is_file() and os.path.splitext(entry.name)[1].lower() in exts:
                        arquivos.append(Path(entry.path))
                except OSError:
                    # Arquivo ilegível/corrompido no disco D: ignorado com segurança
                    continue
        except OSError:
            print(f"[AVISO] Pasta {pasta.name} com erro de I/O no disco. Pulando...")
            continue

        if not arquivos:
            continue

        # Verificar se a marca possui produtos no catálogo
        c.execute("SELECT COUNT(*) FROM products WHERE name LIKE ? OR brand LIKE ?", (f"%{marca_nome}%", f"%{marca_nome}%"))
        qtd_banco = c.fetchone()[0]

        if qtd_banco == 0:
            continue

        print(f"Processando: {marca_nome} ({len(arquivos)} imagens | {qtd_banco} produtos no catálogo)...")

        pasta_front = DIR_FRONTEND_PRODUTOS / marca_slug
        pasta_media = DIR_MEDIA_UPLOADS / marca_slug
        pasta_front.mkdir(parents=True, exist_ok=True)
        pasta_media.mkdir(parents=True, exist_ok=True)

        for arq in arquivos:
            nome_limpo = sanitizar_nome(arq.stem)
            nome_webp = f"{nome_limpo}.webp"
            dest_front = pasta_front / nome_webp
            dest_media = pasta_media / nome_webp

            # Converte e salva se ainda não existir
            if not dest_front.exists():
                ok = otimizar_salvar_webp(arq, dest_front)
                if ok:
                    shutil.copy2(dest_front, dest_media)
                    total_fotos_convertidas += 1
            else:
                if not dest_media.exists():
                    shutil.copy2(dest_front, dest_media)

            url_publica = f"/produtos/{marca_slug}/{nome_webp}"
            storage_key = f"produtos/{marca_slug}/{nome_webp}"

            # Extração de tokens e casamento com produtos
            tokens = extrair_tokens(arq.name)

            # Buscar produtos correspondentes
            query = "SELECT id, name FROM products WHERE (name LIKE ? OR brand = ?)"
            params = [f"%{marca_nome}%", marca_nome]

            if tokens and not ("0000" in arq.name or "0001" in arq.name):
                # Busca por palavras-chave específicas do modelo
                query += " AND (" + " OR ".join(["name LIKE ?" for _ in tokens[:3]]) + ")"
                for t in tokens[:3]:
                    params.append(f"%{t}%")
            else:
                # É página de catálogo geral da marca
                query += " LIMIT 5"

            c.execute(query, params)
            prods_encontrados = c.fetchall()

            for prod_id, prod_nome in prods_encontrados:
                # Atualizar marca no banco
                c.execute("UPDATE products SET brand = ? WHERE id = ? AND (brand IS NULL OR brand = 'Não Cadastrado' OR brand = 'Outros')", (marca_nome, prod_id))

                # Verificar se já tem essa imagem vinculada
                c.execute("SELECT id FROM product_images WHERE product_id = ? AND url = ?", (prod_id, url_publica))
                if not c.fetchone():
                    c.execute("SELECT COUNT(*) FROM product_images WHERE product_id = ?", (prod_id,))
                    count_img = c.fetchone()[0]
                    is_prim = 1 if count_img == 0 else 0

                    c.execute("""
                        INSERT INTO product_images (product_id, storage_key, url, alt_text, sort_order, is_primary, created_at)
                        VALUES (?, ?, ?, ?, ?, ?, datetime('now'))
                    """, (prod_id, storage_key, url_publica, prod_nome, count_img, is_prim))
                    total_produtos_vinculados += 1

        conn.commit()

    conn.close()

    # Replicar alterações no banco do backend
    if DB_PATHS[1].exists():
        shutil.copy2("dev_database.db", DB_PATHS[1])
        print("dev_database.db replicado para backend/dev_database.db com sucesso.")

    print(f"\n[SUCESSO] Sincronização concluída!")
    print(f"-> Total de novas fotos otimizadas para WebP: {total_fotos_convertidas}")
    print(f"-> Total de imagens vinculadas aos produtos no catálogo: {total_produtos_vinculados}")

# execução
if __name__ == "__main__":
    sincronizar_todas_marcas()
