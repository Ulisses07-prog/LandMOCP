# imports
import sys
import os
from pathlib import Path

# config
sys.path.insert(0, str(Path(__file__).resolve().parent.parent / "backend"))
from app.core.database import SessionLocal, engine, Base
from app.core.security import get_password_hash
from app.models.user import User, Role
from app.models.category import Category
from app.models.product import Product, ProductImage
from app.models.setting import Setting
import app.models  # carrega todos os modelos

# funções
def seed():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        # 1. Roles
        roles_data = ["admin", "gerente", "operador"]
        role_map = {}
        for r_name in roles_data:
            role = db.query(Role).filter(Role.name == r_name).first()
            if not role:
                role = Role(name=r_name)
                db.add(role)
                db.flush()
            role_map[r_name] = role

        # 2. Admin User
        admin_user = db.query(User).filter(User.email == "admin@arrudamoveis.com.br").first()
        if not admin_user:
            admin_user = User(
                name="Administrador Arruda",
                email="admin@arrudamoveis.com.br",
                password_hash=get_password_hash("ArrudaAdmin2026!"),
                role_id=role_map["admin"].id,
                active=True
            )
            db.add(admin_user)
            db.flush()
            print("Usuário admin criado com sucesso.")

        # 3. Settings Globais
        settings_data = {
            "WHATSAPP_NUMBER": "5581999999999",
            "STORE_NAME": "Arruda Móveis Eletro",
            "ANNOUNCEMENT_TEXT": "Super Saldão de Móveis e Eletro com até 40% OFF!"
        }
        for k, v in settings_data.items():
            st = db.query(Setting).filter(Setting.key == k).first()
            if not st:
                db.add(Setting(key=k, value=v))
        db.flush()

        # 4. Departamentos Oficiais Arruda Móveis
        categories_data = [
            ("Móveis para Sala", "moveis-para-sala", "Sofás, racks, painéis e mesas de centro."),
            ("Móveis para Quarto", "moveis-para-quarto", "Guarda-roupas, camas box, cabeceiras e cômodas."),
            ("Cozinha & Sala de Jantar", "cozinha-sala-de-jantar", "Armários de cozinha, gabinetes e conjuntos de mesa."),
            ("Eletrodomésticos", "eletrodomesticos", "Geladeiras, fogões, lavadoras e micro-ondas."),
            ("Eletroportáteis", "eletroportateis", "Air fryers, liquidificadores, batedeiras e cafeteiras."),
            ("TV & Áudio", "tv-e-audio", "Smart TVs 4K, soundbars e caixas amplificadas."),
            ("Telefonia & Informática", "telefonia-e-informatica", "Smartphones, tablets e acessórios."),
            ("Ar & Climatização", "ar-e-climatizacao", "Ar-condicionado split e ventiladores."),
            ("Decoração & Utilidades", "decoracao-e-utilidades", "Tapetes, iluminação e utensílios domésticos.")
        ]

        cat_map = {}
        for name, slug, desc in categories_data:
            cat = db.query(Category).filter(Category.slug == slug).first()
            if not cat:
                cat = Category(name=name, slug=slug, description=desc, active=True)
                db.add(cat)
                db.flush()
            cat_map[slug] = cat

        # 5. Produtos de Demonstração (com imagem principal para cumprir regra de negócio)
        demo_products = [
            {
                "name": "Sofá Retrátil e Reclinável 3 Lugares Veludo",
                "slug": "sofa-retratil-reclinavel-3-lugares-veludo",
                "sku": "ARR-SOF-001",
                "category_slug": "moveis-para-sala",
                "price": 1899.90,
                "promo_price": 1599.90,
                "short_description": "Sofá 3 lugares com assento retrátil e encosto reclinável em tecido veludo premium.",
                "description": "Estrutura 100% madeira de eucalipto reflorestada, molas espirais e espuma D-28 hipoalergênica.",
                "brand": "Arruda Estofados",
                "is_featured": True,
                "image_url": "/images/mock-sofa.webp"
            },
            {
                "name": "Guarda-Roupa Casal 6 Portas com Espelho",
                "slug": "guarda-roupa-casal-6-portas-com-espelho",
                "sku": "ARR-GDR-002",
                "category_slug": "moveis-para-quarto",
                "price": 1499.00,
                "promo_price": 1299.00,
                "short_description": "Amplo espaço interno com gavetas telescópicas e espelho central.",
                "description": "Fabricado em MDP reforçado, pintura UV de alta resistência e corrediças metálicas.",
                "brand": "Arruda Móveis",
                "is_featured": True,
                "image_url": "/images/mock-quarto.webp"
            },
            {
                "name": "Smart TV 55 Polegadas 4K UHD HDR",
                "slug": "smart-tv-55-polegadas-4k-uhd-hdr",
                "sku": "ARR-TV-003",
                "category_slug": "tv-e-audio",
                "price": 2799.00,
                "promo_price": 2399.00,
                "short_description": "Smart TV com inteligência artificial, Bluetooth e comando de voz.",
                "description": "Resolução 4K de alta definição, processador Crystal e sistema operacional rápido.",
                "brand": "Samsung",
                "is_featured": True,
                "image_url": "/images/mock-tv.webp"
            },
            {
                "name": "Geladeira Frost Free Duplex 375L Inox",
                "slug": "geladeira-frost-free-duplex-375l-inox",
                "sku": "ARR-GEL-004",
                "category_slug": "eletrodomesticos",
                "price": 3299.00,
                "promo_price": 2899.00,
                "short_description": "Refrigerador frost free duplex com acabamento evox e baixo consumo energético.",
                "description": "Capacidade de 375 litros, painel touch eletrônico externo e prateleiras reversíveis.",
                "brand": "Brastemp",
                "is_featured": True,
                "image_url": "/images/mock-geladeira.webp"
            }
        ]

        for p_data in demo_products:
            prod = db.query(Product).filter(Product.slug == p_data["slug"]).first()
            if not prod:
                prod = Product(
                    name=p_data["name"],
                    slug=p_data["slug"],
                    sku=p_data["sku"],
                    category_id=cat_map[p_data["category_slug"]].id,
                    price=p_data["price"],
                    promo_price=p_data["promo_price"],
                    short_description=p_data["short_description"],
                    description=p_data["description"],
                    brand=p_data["brand"],
                    status="PUBLISHED",
                    is_featured=p_data["is_featured"],
                )
                db.add(prod)
                db.flush()

                # Adiciona foto principal para cumprir regra de negócio
                img = ProductImage(
                    product_id=prod.id,
                    storage_key=p_data["image_url"],
                    url=p_data["image_url"],
                    alt_text=prod.name,
                    is_primary=True,
                    sort_order=0
                )
                db.add(img)

        db.commit()
        print("Seed concluído com sucesso!")
    except Exception as e:
        db.rollback()
        print(f"Erro no seed: {e}")
        raise e
    finally:
        db.close()

# execução
if __name__ == "__main__":
    seed()
