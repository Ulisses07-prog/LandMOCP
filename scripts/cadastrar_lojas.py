# imports
import sqlite3
import os

# config
DB_PATHS = ["dev_database.db", "backend/dev_database.db"]

STORES_DATA = [
    {
        "name": "Arruda Móveis - Piripiri (Matriz)",
        "slug": "piripiri",
        "type": "Matriz",
        "city": "Piripiri",
        "state": "PI",
        "address": "Rua 18 de Setembro, 970 – Centro, CEP: 64.260-000",
        "whatsapp_number": "5586981268763",
        "latitude": -4.2719,
        "longitude": -41.7769,
        "sort_order": 1,
        "manager": "Alessandro"
    },
    {
        "name": "Arruda Móveis - Esperantina",
        "slug": "esperantina",
        "type": "Filial",
        "city": "Esperantina",
        "state": "PI",
        "address": "Rua Conrado Melo, nº 60 – Centro, CEP: 64.180-000",
        "whatsapp_number": "5586981906694",
        "latitude": -3.9016,
        "longitude": -42.2355,
        "sort_order": 2,
        "manager": "Fernando"
    },
    {
        "name": "Arruda Móveis - São José do Divino",
        "slug": "sao-jose-do-divino",
        "type": "Filial",
        "city": "São José do Divino",
        "state": "PI",
        "address": "Rua Manoel Divino, 265 – Centro, CEP: 64.245-000",
        "whatsapp_number": "5586981164886",
        "latitude": -3.8055,
        "longitude": -41.8286,
        "sort_order": 3,
        "manager": "Fco Côco"
    },
    {
        "name": "Arruda Móveis - Joaquim Pires",
        "slug": "joaquim-pires",
        "type": "Filial",
        "city": "Joaquim Pires",
        "state": "PI",
        "address": "Rua José Pereira, nº 231 – Centro, CEP: 64.170-000",
        "whatsapp_number": "5586981268763", # provisório matriz até celular próprio
        "latitude": -3.5042,
        "longitude": -42.1969,
        "sort_order": 4,
        "manager": "Dimas"
    },
    {
        "name": "Arruda Móveis - Murici dos Portelas",
        "slug": "murici-dos-portelas",
        "type": "Filial",
        "city": "Murici dos Portelas",
        "state": "PI",
        "address": "Av. Lira Portela, 442 – Centro, CEP: 64.175-000",
        "whatsapp_number": "5586981423758",
        "latitude": -3.3197,
        "longitude": -42.0886,
        "sort_order": 5,
        "manager": "Leandro"
    },
    {
        "name": "Arruda Móveis - Matias Olímpio",
        "slug": "matias-olimpio",
        "type": "Filial",
        "city": "Matias Olímpio",
        "state": "PI",
        "address": "Rua Francisco Maia, 230 – Centro, CEP: 64.150-000",
        "whatsapp_number": "5586981470568",
        "latitude": -3.7161,
        "longitude": -42.5486,
        "sort_order": 6,
        "manager": "Augusto"
    },
    {
        "name": "Arruda Móveis - São João do Arraial",
        "slug": "sao-joao-do-arraial",
        "type": "Filial",
        "city": "São João do Arraial",
        "state": "PI",
        "address": "Av. Vicente Augusto, 852 – Centro, CEP: 64.155-000",
        "whatsapp_number": "5586981551722",
        "latitude": -3.8189,
        "longitude": -42.4464,
        "sort_order": 7,
        "manager": "Isaias"
    },
    {
        "name": "Arruda Móveis - Batalha",
        "slug": "batalha",
        "type": "Filial",
        "city": "Batalha",
        "state": "PI",
        "address": "Av. Cel Messias Melo, 483 – Centro, CEP: 64.190-000",
        "whatsapp_number": "5586999605864",
        "latitude": -4.0264,
        "longitude": -42.0792,
        "sort_order": 8,
        "manager": "Keila"
    }
]

# funções
def setup_stores(db_path):
    if not os.path.exists(db_path):
        return
    
    conn = sqlite3.connect(db_path)
    cur = conn.cursor()
    
    # Criar tabela stores
    cur.execute('''
    CREATE TABLE IF NOT EXISTS stores (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name VARCHAR(100) NOT NULL,
        slug VARCHAR(100) UNIQUE NOT NULL,
        type VARCHAR(20) DEFAULT "Filial" NOT NULL,
        city VARCHAR(100) NOT NULL,
        state VARCHAR(2) DEFAULT "PI" NOT NULL,
        address TEXT,
        whatsapp_number VARCHAR(20) NOT NULL,
        latitude FLOAT,
        longitude FLOAT,
        is_active BOOLEAN DEFAULT 1 NOT NULL,
        sort_order INTEGER DEFAULT 0 NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL
    )
    ''')

    # Criar tabela salespeople
    cur.execute('''
    CREATE TABLE IF NOT EXISTS salespeople (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        store_id INTEGER NOT NULL,
        name VARCHAR(100) NOT NULL,
        whatsapp_number VARCHAR(20) NOT NULL UNIQUE,
        is_active BOOLEAN DEFAULT 1 NOT NULL,
        assignment_count INTEGER DEFAULT 0 NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
        FOREIGN KEY (store_id) REFERENCES stores (id) ON DELETE CASCADE
    )
    ''')

    for s in STORES_DATA:
        cur.execute('''
        INSERT INTO stores (name, slug, type, city, state, address, whatsapp_number, latitude, longitude, is_active, sort_order, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, datetime('now'), datetime('now'))
        ON CONFLICT(slug) DO UPDATE SET
            name = excluded.name,
            type = excluded.type,
            city = excluded.city,
            state = excluded.state,
            address = excluded.address,
            whatsapp_number = excluded.whatsapp_number,
            latitude = excluded.latitude,
            longitude = excluded.longitude,
            sort_order = excluded.sort_order,
            is_active = 1,
            updated_at = datetime('now')
        ''', (
            s["name"], s["slug"], s["type"], s["city"], s["state"],
            s["address"], s["whatsapp_number"], s["latitude"], s["longitude"], s["sort_order"]
        ))
        
        cur.execute("SELECT id FROM stores WHERE slug = ?", (s["slug"],))
        store_id = cur.fetchone()[0]
        
        # Inserir gerente como vendedor inicial
        cur.execute('''
        INSERT INTO salespeople (store_id, name, whatsapp_number, is_active, assignment_count, created_at, updated_at)
        VALUES (?, ?, ?, 1, 0, datetime('now'), datetime('now'))
        ON CONFLICT(whatsapp_number) DO UPDATE SET
            store_id = excluded.store_id,
            name = excluded.name,
            is_active = 1,
            updated_at = datetime('now')
        ''', (store_id, f"Gerente {s['manager']}", s["whatsapp_number"]))

    conn.commit()
    conn.close()
    print(f"Lojas e gerentes configurados em: {db_path}")

# execução
if __name__ == "__main__":
    for db in DB_PATHS:
        setup_stores(db)
