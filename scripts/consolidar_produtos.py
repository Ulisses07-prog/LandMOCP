# imports
import os
import sys
import shutil
import sqlite3
from pathlib import Path

if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8")

# config
DB_PATHS = [Path("dev_database.db"), Path("backend/dev_database.db")]

# funções
def consolidar_banco(db_path: Path):
    if not db_path.exists():
        return

    # 1. Backup de segurança
    backup_path = db_path.with_name(f"{db_path.stem}_backup.db")
    shutil.copy2(db_path, backup_path)
    print(f"✔ Backup criado: {backup_path}")

    conn = sqlite3.connect(db_path)
    c = conn.cursor()

    # 2. Arquivar itens que são volumes de transporte ou resíduos sem preço
    c.execute("""
        UPDATE products 
        SET status = 'ARCHIVED'
        WHERE (name LIKE 'VOLUME %' OR name LIKE 'VOL. %' OR price < 10)
          AND status != 'ARCHIVED'
    """)
    volumes_arquivados = c.rowcount
    print(f"✔ Volumes e resíduos arquivados: {volumes_arquivados}")

    # 3. Encontrar todos os nomes com mais de uma variação
    c.execute("""
        SELECT trim(upper(name)) as nome_norm, count(*) as qtd
        FROM products
        WHERE status = 'PUBLISHED'
        GROUP BY trim(upper(name))
        HAVING qtd > 1
    """)
    grupos_duplicados = c.fetchall()
    print(f"✔ Encontrados {len(grupos_duplicados)} grupos de produtos com variações duplicadas.")

    total_consolidados = 0
    total_variacoes_ocultas = 0

    for nome_norm, qtd in grupos_duplicados:
        # Buscar todas as variações desse produto
        c.execute("""
            SELECT id, sku, price, stock, availability
            FROM products
            WHERE trim(upper(name)) = ? AND status = 'PUBLISHED'
            ORDER BY id ASC
        """, (nome_norm,))
        itens = c.fetchall()

        if not itens:
            continue

        # Escolher o produto mestre:
        # 1º prioridade: SKU sem hífen (ex: 3715 em vez de 3715-1)
        # 2º prioridade: maior estoque
        # 3º prioridade: menor ID
        def score_mestre(item):
            _id, sku, price, stock, avail = item
            tem_hifen = 1 if (sku and "-" in str(sku)) else 0
            estoque = stock if (stock and stock > 0) else 0
            return (tem_hifen, -estoque, _id)

        itens_ordenados = sorted(itens, key=score_mestre)
        mestre = itens_ordenados[0]
        filhos = itens_ordenados[1:]

        mestre_id = mestre[0]
        filhos_ids = [f[0] for f in filhos]

        # Somar o estoque total de todas as variações
        estoque_total = sum((it[3] or 0) for it in itens)
        disponibilidade = "Pronta Entrega" if estoque_total > 0 else "Sob Encomenda"

        # Atualizar mestre com o estoque consolidado
        c.execute("""
            UPDATE products
            SET stock = ?, availability = ?
            WHERE id = ?
        """, (estoque_total, disponibilidade, mestre_id))

        # Migrar todas as imagens dos filhos para o mestre (sem duplicar URLs)
        c.execute("SELECT url FROM product_images WHERE product_id = ?", (mestre_id,))
        urls_existentes = set(r[0] for r in c.fetchall())

        for f_id in filhos_ids:
            c.execute("SELECT storage_key, url, alt_text FROM product_images WHERE product_id = ?", (f_id,))
            imgs_filho = c.fetchall()
            for storage_key, url, alt_text in imgs_filho:
                if url not in urls_existentes:
                    urls_existentes.add(url)
                    c.execute("""
                        INSERT INTO product_images (product_id, storage_key, url, alt_text, sort_order, is_primary, created_at)
                        VALUES (?, ?, ?, ?, 1, 0, datetime('now'))
                    """, (mestre_id, storage_key, url, alt_text))

        # Marcar os filhos como 'VARIATION' para não aparecerem duplicados no catálogo
        placeholders = ",".join("?" for _ in filhos_ids)
        c.execute(f"UPDATE products SET status = 'VARIATION' WHERE id IN ({placeholders})", filhos_ids)

        total_consolidados += 1
        total_variacoes_ocultas += len(filhos_ids)

    conn.commit()
    conn.close()
    print(f"✔ {total_consolidados} produtos consolidados com sucesso.")
    print(f"✔ {total_variacoes_ocultas} variações ocultadas do catálogo principal.")

# execução
if __name__ == "__main__":
    for db in DB_PATHS:
        print(f"\n--- Processando: {db} ---")
        consolidar_banco(db)
