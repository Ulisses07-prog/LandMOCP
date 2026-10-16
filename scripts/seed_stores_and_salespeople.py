"""
Script para popular o banco de dados com as 8 lojas da Arruda Móveis Eletro
e vendedores genéricos para cada loja.

Coordenadas aproximadas das cidades do Piauí:
- Piripiri: -4.2089, -41.9514
- São José do Divino: -4.1833, -42.0333
- Batalha: -4.0167, -41.9333
- Esperantina: -3.9167, -42.3833
- Joaquim Pires: -3.8833, -42.0667
- Murici dos Portelas: -4.1500, -41.8667
- São João do Arraial: -3.9333, -42.1833
- Matias Olimpio: -3.8667, -41.9500
"""

import sys
import os

# Adicionar o diretório backend ao path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'backend'))

from sqlalchemy.orm import Session
from app.core.database import SessionLocal, engine, Base
from app.models.store import Store
from app.models.salesperson import Salesperson

def seed_stores_and_salespeople(force_recreate=False):
    """Cria as 8 lojas e vendedores genéricos"""
    
    # Criar tabelas se não existirem
    Base.metadata.create_all(bind=engine)
    
    db: Session = SessionLocal()
    
    try:
        # Verificar se já existem lojas
        existing_stores = db.query(Store).count()
        if existing_stores > 0:
            if force_recreate:
                print(f"[!] Forcando recriacao - {existing_stores} lojas existentes serao removidas.")
                # Deletar dados existentes
                db.query(Salesperson).delete()
                db.query(Store).delete()
                db.commit()
                print("[OK] Dados existentes removidos.")
            else:
                print(f"[!] Ja existem {existing_stores} lojas no banco. Use --force para recriar.")
                return
        
        # Dados das 8 lojas
        stores_data = [
            {
                "name": "Piripiri",
                "slug": "piripiri",
                "type": "Matriz",
                "city": "Piripiri",
                "state": "PI",
                "address": "Rua Principal, 123 - Centro",
                "whatsapp_number": "5586999999001",
                "latitude": -4.2089,
                "longitude": -41.9514,
                "is_active": True,
                "sort_order": 1,
            },
            {
                "name": "São José do Divino",
                "slug": "sao-jose-do-divino",
                "type": "Filial",
                "city": "São José do Divino",
                "state": "PI",
                "address": "Av. Central, 456 - Centro",
                "whatsapp_number": "5586999999002",
                "latitude": -4.1833,
                "longitude": -42.0333,
                "is_active": True,
                "sort_order": 2,
            },
            {
                "name": "Batalha",
                "slug": "batalha",
                "type": "Filial",
                "city": "Batalha",
                "state": "PI",
                "address": "Rua do Comércio, 789 - Centro",
                "whatsapp_number": "5586999999003",
                "latitude": -4.0167,
                "longitude": -41.9333,
                "is_active": True,
                "sort_order": 3,
            },
            {
                "name": "Esperantina",
                "slug": "esperantina",
                "type": "Filial",
                "city": "Esperantina",
                "state": "PI",
                "address": "Rua das Flores, 321 - Centro",
                "whatsapp_number": "5586999999004",
                "latitude": -3.9167,
                "longitude": -42.3833,
                "is_active": True,
                "sort_order": 4,
            },
            {
                "name": "Joaquim Pires",
                "slug": "joaquim-pires",
                "type": "Filial",
                "city": "Joaquim Pires",
                "state": "PI",
                "address": "Av. Brasil, 654 - Centro",
                "whatsapp_number": "5586999999005",
                "latitude": -3.8833,
                "longitude": -42.0667,
                "is_active": True,
                "sort_order": 5,
            },
            {
                "name": "Murici dos Portelas",
                "slug": "murici-dos-portelas",
                "type": "Filial",
                "city": "Murici dos Portelas",
                "state": "PI",
                "address": "Rua Principal, 987 - Centro",
                "whatsapp_number": "5586999999006",
                "latitude": -4.1500,
                "longitude": -41.8667,
                "is_active": True,
                "sort_order": 6,
            },
            {
                "name": "São João do Arraial",
                "slug": "sao-joao-do-arraial",
                "type": "Filial",
                "city": "São João do Arraial",
                "state": "PI",
                "address": "Praça Central, 159 - Centro",
                "whatsapp_number": "5586999999007",
                "latitude": -3.9333,
                "longitude": -42.1833,
                "is_active": True,
                "sort_order": 7,
            },
            {
                "name": "Matias Olimpio",
                "slug": "matias-olimpio",
                "type": "Filial",
                "city": "Matias Olimpio",
                "state": "PI",
                "address": "Rua da Matriz, 753 - Centro",
                "whatsapp_number": "5586999999008",
                "latitude": -3.8667,
                "longitude": -41.9500,
                "is_active": True,
                "sort_order": 8,
            },
        ]
        
        # Criar lojas
        created_stores = []
        for store_data in stores_data:
            store = Store(**store_data)
            db.add(store)
            created_stores.append(store)
        
        db.commit()
        print(f"[OK] {len(created_stores)} lojas criadas com sucesso!")
        
        # Criar vendedores genéricos para cada loja
        # Piripiri (Matriz) terá 10 vendedores, as demais terão 5 cada
        salespeople_count = {
            "piripiri": 10,
            "sao-jose-do-divino": 5,
            "batalha": 5,
            "esperantina": 5,
            "joaquim-pires": 5,
            "murici-dos-portelas": 5,
            "sao-joao-do-arraial": 5,
            "matias-olimpio": 5,
        }
        
        total_salespeople = 0
        for store in created_stores:
            count = salespeople_count.get(store.slug, 5)
            
            for i in range(1, count + 1):
                salesperson = Salesperson(
                    store_id=store.id,
                    name=f"Vendedor {i} - {store.name}",
                    whatsapp_number=f"5586999999{store.id:02d}{i:02d}",
                    is_active=True,
                    assignment_count=0,
                )
                db.add(salesperson)
                total_salespeople += 1
        
        db.commit()
        print(f"[OK] {total_salespeople} vendedores criados com sucesso!")
        
        # Exibir resumo
        print("\n" + "="*60)
        print("RESUMO DAS LOJAS CRIADAS")
        print("="*60)
        for store in created_stores:
            sp_count = len([s for s in store.salespeople])
            print(f"[+] {store.name} ({store.type})")
            print(f"   Slug: {store.slug}")
            print(f"   WhatsApp: {store.whatsapp_number}")
            print(f"   Vendedores: {sp_count}")
            print(f"   Coordenadas: {store.latitude}, {store.longitude}")
            print()
        
        print("="*60)
        print("[OK] Seed concluido com sucesso!")
        print("="*60)
        
    except Exception as e:
        db.rollback()
        print(f"[ERRO] Erro ao criar seed: {e}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    import sys
    force = "--force" in sys.argv
    seed_stores_and_salespeople(force_recreate=force)
