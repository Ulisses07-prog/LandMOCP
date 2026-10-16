# imports
import sqlite3
import shutil
import os

# config
DB_PATHS = ["dev_database.db", "backend/dev_database.db"]
PUBLIC_PRODUTOS_DIR = "frontend/public/produtos"

# funções
def limpar_imagens_produtos():
    # 1. Limpar banco de dados
    for db_path in DB_PATHS:
        if os.path.exists(db_path):
            conn = sqlite3.connect(db_path)
            cur = conn.cursor()
            
            # Contar antes
            cur.execute("SELECT count(*) FROM product_images WHERE url LIKE '/produtos/%'")
            total_remover = cur.fetchone()[0]
            
            # Deletar
            cur.execute("DELETE FROM product_images WHERE url LIKE '/produtos/%'")
            conn.commit()
            
            # Contar restantes
            cur.execute("SELECT count(*) FROM product_images")
            restantes = cur.fetchone()[0]
            conn.close()
            print(f"[{db_path}] Removidos {total_remover} vínculos de imagens. Restantes no banco: {restantes}")
            
    # 2. Remover arquivos do disco em frontend/public/produtos
    if os.path.exists(PUBLIC_PRODUTOS_DIR):
        total_pastas = len(os.listdir(PUBLIC_PRODUTOS_DIR))
        shutil.rmtree(PUBLIC_PRODUTOS_DIR)
        print(f"Pasta {PUBLIC_PRODUTOS_DIR} removida com sucesso ({total_pastas} pastas de marcas).")
    else:
        print(f"Pasta {PUBLIC_PRODUTOS_DIR} já não existe.")

# execução
if __name__ == "__main__":
    limpar_imagens_produtos()
