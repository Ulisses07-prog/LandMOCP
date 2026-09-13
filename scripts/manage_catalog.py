# imports
import sys
from pathlib import Path
from decimal import Decimal

# config
sys.path.insert(0, str(Path(__file__).resolve().parent.parent / "backend"))
from app.core.database import SessionLocal
from app.models.category import Category
from app.models.product import Product, ProductImage
from app.models.offer import Offer

# funções
def adicionar_produto(nome: str, slug: str, sku: str, cat_slug: str, preco: float, foto_url: str, promo: float = None, marca: str = "Arruda"):
    db = SessionLocal()
    try:
        cat = db.query(Category).filter(Category.slug == cat_slug).first()
        if not cat:
            print(f"Erro: Categoria '{cat_slug}' não encontrada.")
            return

        prod = Product(
            name=nome,
            slug=slug,
            sku=sku,
            category_id=cat.id,
            price=Decimal(str(preco)),
            promo_price=Decimal(str(promo)) if promo else None,
            brand=marca,
            status="PUBLISHED",
            is_featured=True,
            availability="Pronta Entrega"
        )
        db.add(prod)
        db.flush()

        img = ProductImage(
            product_id=prod.id,
            storage_key=foto_url,
            url=foto_url,
            alt_text=nome,
            is_primary=True,
            sort_order=0
        )
        db.add(img)

        if promo and promo < preco:
            desconto = int(((preco - promo) / preco) * 100)
            db.add(Offer(
                product_id=prod.id,
                promo_price=Decimal(str(promo)),
                discount_percent=desconto,
                starts_at="2026-01-01",
                ends_at="2026-12-31",
                active=True,
                status="ACTIVE"
            ))

        db.commit()
        print(f"✅ Produto cadastrado com sucesso: {nome} (ID: {prod.id})")
    except Exception as e:
        db.rollback()
        print(f"Erro: {e}")
    finally:
        db.close()

def alterar_preco(sku: str, novo_preco: float, novo_promo: float = None):
    db = SessionLocal()
    try:
        prod = db.query(Product).filter(Product.sku == sku).first()
        if not prod:
            print(f"Erro: Produto com SKU '{sku}' não encontrado.")
            return

        prod.price = Decimal(str(novo_preco))
        if novo_promo:
            prod.promo_price = Decimal(str(novo_promo))
        db.commit()
        print(f"✅ Preço atualizado: {prod.name} -> Normal: R$ {novo_preco} | Promo: R$ {novo_promo}")
    finally:
        db.close()

def listar_produtos():
    db = SessionLocal()
    try:
        produtos = db.query(Product).all()
        print("\n--- PRODUTOS CADASTRADOS NO CATÁLOGO ---")
        for p in produtos:
            print(f"ID: {p.id} | SKU: {p.sku} | {p.name} | R$ {p.price} (Promo: R$ {p.promo_price})")
    finally:
        db.close()

# execução
if __name__ == "__main__":
    # Exemplo 1: Listar produtos atuais
    listar_produtos()

    # Exemplo 2: Para cadastrar um novo produto, descomente abaixo:
    # adicionar_produto(
    #     nome="Mesa de Centro Espelhada Retangular",
    #     slug="mesa-de-centro-espelhada-retangular",
    #     sku="ARR-MES-005",
    #     cat_slug="moveis-para-sala",
    #     preco=499.00,
    #     promo=399.00,
    #     foto_url="/images/mock-sofa.webp"
    # )

    # Exemplo 3: Para alterar o preço de um produto existente pelo SKU:
    # alterar_preco(sku="ARR-SOF-001", novo_preco=1799.00, novo_promo=1499.00)
