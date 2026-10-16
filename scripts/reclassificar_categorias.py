# imports
import sqlite3
import shutil
from pathlib import Path

# config
DB_PATHS = [Path("dev_database.db"), Path("backend/dev_database.db")]

# Mapeamento com prioridade hierárquica correta:
# 1. Grandes Grupos de Móveis (Base)
# 2. Utilidades e Decoração
# 3. Eletrodomésticos e Eletroportáteis
# 4. Telefonia e Informática
# 5. Ar & Climatização
# 6. TV & Áudio (Equipamentos de TV e Som, excluindo racks e painéis)
REGRAS = [
    # 1. Móveis para Quarto (Base)
    (2, """
        group_name = 'QUARTO'
        OR category_id = 10
        OR subgroup IN ('ROUPEIRO', 'ROUPEIROS', 'CAMA', 'CAMA BOX', 'COMODA', 'CABECEIRA BOX', 'BERCO', 'SAPATEIRA', 'COLCHAO')
        OR name LIKE '%ROUPEIRO%'
        OR name LIKE '%GUARDA-ROUPA%'
        OR name LIKE '%CAMA %'
        OR name LIKE '%COLCHAO%'
        OR name LIKE '%COMODA%'
        OR name LIKE '%CABECEIRA%'
        OR name LIKE '%BERCO%'
    """),

    # 2. Móveis para Sala (Base)
    (1, """
        group_name = 'SALA'
        OR category_id = 16
        OR subgroup IN ('RACK', 'PAINEL', 'ESTANTE', 'SOFA', 'POLTRONA', 'HOME', 'MESA DE CENTRO', 'APARADOR', 'BUFFET')
        OR name LIKE '%SOFA%'
        OR name LIKE '%RACK%'
        OR name LIKE '%PAINEL%'
        OR name LIKE '%POLTRONA%'
        OR name LIKE '%ESTANTE%'
    """),

    # 3. Cozinha & Sala de Jantar (Base)
    (3, """
        group_name = 'COZINHA'
        OR subgroup IN ('CONJ MESA', 'MESA MADEIRA/MDF', 'BALCAO', 'ARMARIO', 'COZINHA', 'CADEIRA', 'FRUTEIRA')
        OR name LIKE '%ARMARIO DE COZINHA%'
        OR name LIKE '%BALCAO%'
        OR name LIKE '%MESA DE JANTAR%'
        OR name LIKE '%CONJ MESA%'
    """),

    # 4. Decoração & Utilidades
    (9, """
        group_name IN ('UTENCILIOS', 'BICICLETA', 'MONTAINBIKE', 'INFANTIL', 'FERRAMENTAS', 'ACESSORIOS')
        OR category_id IN (12, 13, 15, 17, 18)
        OR subgroup IN ('BICICLETA', 'BICICLETAS', 'TRICICLO', 'PANELA', 'FAQUEIRO', 'MESA DE PLASTICO', 'CADEIRA DE PLASTICO', 'UTILIDADES')
    """),

    # 5. Eletrodomésticos
    (4, """
        group_name = 'ELETRODOMESTICOS'
        OR subgroup IN ('FOGAO', 'REFRIGERADOR', 'FREEZER', 'LAVADORA', 'LAVA-LOUCAS', 'BEBEDOURO', 'DEPURADOR', 'COIFA')
        OR name LIKE '%FOGAO%'
        OR name LIKE '%GELADEIRA%'
        OR name LIKE '%REFRIGERADOR%'
        OR name LIKE '%LAVADORA%'
        OR name LIKE '%FREEZER%'
    """),

    # 6. Eletroportáteis
    (5, """
        group_name IN ('ELETRO PORTATEIS', 'ELETROPORTATIL')
        OR subgroup IN ('LIQUIDIFICADOR', 'BATEDEIRA', 'SANDUICHEIRA', 'GRILL', 'CAFETEIRA', 'AIR FRYER', 'FRITADEIRA', 'FERRO', 'PANELA ELETRICA', 'ASPIRADOR', 'MIXER', 'MICROONDAS', 'FORNO ELETRICO')
        OR name LIKE '%LIQUIDIFICADOR%'
        OR name LIKE '%BATEDEIRA%'
        OR name LIKE '%SANDUICHEIRA%'
        OR name LIKE '%CAFETEIRA%'
        OR name LIKE '%AIR FRYER%'
        OR name LIKE '%FERRO DE PASSAR%'
        OR name LIKE '%PANELA ELETRICA%'
    """),

    # 7. Telefonia & Informática
    (7, """
        group_name IN ('TELEFONES', 'INFORMATICA')
        OR subgroup IN ('CELULAR', 'SMARTPHONE', 'TELEFONE', 'NOTEBOOK', 'TABLET', 'IMPRESSORA')
        OR name LIKE '%CELULAR%'
        OR name LIKE '%SMARTPHONE%'
        OR name LIKE '%NOTEBOOK%'
    """),

    # 8. Ar & Climatização
    (8, """
        subgroup IN ('VENTILADOR', 'AR CONDICIONADO', 'CLIMATIZADOR', 'CIRCULADOR')
        OR name LIKE '%VENTILADOR%'
        OR name LIKE '%AR CONDICIONADO%'
        OR name LIKE '%CLIMATIZADOR%'
        OR name LIKE '%CIRCULADOR DE AR%'
    """),

    # 9. TV & Áudio (Equipamentos de Imagem e Som reais)
    (6, """
        (
            subgroup IN ('TV', 'SMART TV', 'CAIXA DE SOM', 'SOM', 'HOMETHEATER', 'RECEPTOR', 'ANTENA', 'CONVERSOR')
            OR name LIKE '%TV %'
            OR name LIKE '%SMART TV%'
            OR name LIKE '%TELEVISOR%'
            OR name LIKE '%CAIXA DE SOM%'
            OR name LIKE '%CAIXA AMPLIFICADA%'
            OR name LIKE '%SOUNDBAR%'
            OR name LIKE '%MINI SYSTEM%'
        )
        AND name NOT LIKE '%RACK%'
        AND name NOT LIKE '%PAINEL%'
        AND name NOT LIKE '%BANCADA%'
        AND name NOT LIKE '%ESTANTE%'
        AND name NOT LIKE '%SUPORTE%'
    """)
]

# funções
def reclassificar_produtos():
    for db_path in DB_PATHS:
        if not db_path.exists():
            continue

        print(f"\nConectando em {db_path}...")
        conn = sqlite3.connect(db_path)
        c = conn.cursor()

        for cat_id, condicao in REGRAS:
            query = f"UPDATE products SET category_id = {cat_id} WHERE {condicao}"
            c.execute(query)
            qtd = c.rowcount
            print(f"  -> Categoria ID {cat_id}: {qtd} produtos classificados.")

        conn.commit()

        # Resumo final
        print("\nResultado por categoria nos 9 Departamentos Oficiais:")
        c.execute("""
            SELECT c.id, c.name, c.slug, COUNT(p.id)
            FROM categories c
            LEFT JOIN products p ON c.id = p.category_id
            WHERE c.id <= 9
            GROUP BY c.id, c.name, c.slug
            ORDER BY c.id
        """)
        for r in c.fetchall():
            print(f"  ID {r[0]}: {r[1]} ({r[2]}) -> {r[3]} produtos")

        conn.close()

# execução
if __name__ == "__main__":
    reclassificar_produtos()
