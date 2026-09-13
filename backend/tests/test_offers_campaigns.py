import datetime
from app.services.auth_service import AuthService
from app.models.product import Product

def test_offers_and_campaigns_flow(client, db_session):
    # 1. Autenticar usuário admin
    AuthService.init_roles_and_admin(db_session)
    login_res = client.post("/api/v1/auth/login", json={"email": "admin@arrudamoveis.com.br", "password": "admin123456"})
    token = login_res.json()["data"]["access_token"]
    auth_header = {"Authorization": f"Bearer {token}"}

    # 2. Criar Categoria e Produto base
    cat_res = client.post("/api/v1/categories", json={"name": "Eletrodomésticos"})
    cat_id = cat_res.json()["data"]["id"]

    prod_res = client.post("/api/v1/products", json={
        "category_id": cat_id,
        "name": "Geladeira Frost Free Duplex 400L",
        "price": 3000.00
    })
    prod_id = prod_res.json()["data"]["id"]

    now = datetime.datetime.utcnow()
    tomorrow = now + datetime.timedelta(days=1)
    next_week = now + datetime.timedelta(days=7)
    yesterday = now - datetime.timedelta(days=1)

    # 3. Validar rejeição de preço promocional >= preço original
    invalid_price_res = client.post("/api/v1/offers", json={
        "product_id": prod_id,
        "promo_price": 3500.00,
        "starts_at": now.isoformat(),
        "ends_at": next_week.isoformat()
    }, headers=auth_header)
    assert invalid_price_res.status_code == 400
    assert "estritamente menor" in invalid_price_res.json()["detail"]

    # 4. Validar rejeição de datas invertidas
    invalid_dates_res = client.post("/api/v1/offers", json={
        "product_id": prod_id,
        "promo_price": 2400.00,
        "starts_at": next_week.isoformat(),
        "ends_at": tomorrow.isoformat()
    }, headers=auth_header)
    assert invalid_dates_res.status_code == 400
    assert "não pode ser posterior" in invalid_dates_res.json()["detail"]

    # 5. Criar oferta válida (3000 -> 2400 = 20% desconto)
    valid_offer_res = client.post("/api/v1/offers", json={
        "product_id": prod_id,
        "promo_price": 2400.00,
        "starts_at": yesterday.isoformat(),
        "ends_at": next_week.isoformat(),
        "featured": True
    }, headers=auth_header)
    assert valid_offer_res.status_code == 201
    offer_data = valid_offer_res.json()["data"]
    offer_id = offer_data["id"]
    assert offer_data["discount_percent"] == 20
    assert offer_data["status"] == "ACTIVE"

    # Verificar se o produto refletiu o promo_price
    db_session.expire_all()
    prod_in_db = db_session.query(Product).filter(Product.id == prod_id).first()
    assert float(prod_in_db.promo_price) == 2400.00

    # 6. Listar ofertas públicas
    public_offers = client.get("/api/v1/offers")
    assert public_offers.status_code == 200
    assert any(o["id"] == offer_id for o in public_offers.json()["data"])

    # 7. Criar segundo produto para associar a campanha
    prod2_res = client.post("/api/v1/products", json={
        "category_id": cat_id,
        "name": "Micro-ondas 30L Espelhado",
        "price": 699.00
    })
    prod2_id = prod2_res.json()["data"]["id"]

    # 8. Criar Campanha promocional com ambos os produtos
    campaign_res = client.post("/api/v1/campaigns", json={
        "name": "Semana do Eletro Arruda",
        "description": "Renove sua cozinha com descontos imperdíveis",
        "starts_at": now.isoformat(),
        "ends_at": next_week.isoformat(),
        "product_ids": [prod_id, prod2_id]
    }, headers=auth_header)
    assert campaign_res.status_code == 201
    camp_data = campaign_res.json()["data"]
    assert camp_data["slug"] == "semana-do-eletro-arruda"
    assert len(camp_data["products"]) == 2

    # 9. Consultar campanha por slug
    get_camp = client.get(f"/api/v1/campaigns/{camp_data['slug']}")
    assert get_camp.status_code == 200
    assert get_camp.json()["data"]["name"] == "Semana do Eletro Arruda"

    # 10. Deletar oferta e verificar que promo_price no produto foi resetado
    del_offer = client.delete(f"/api/v1/offers/{offer_id}", headers=auth_header)
    assert del_offer.status_code == 204

    db_session.expire_all()
    prod_reset = db_session.query(Product).filter(Product.id == prod_id).first()
    assert prod_reset.promo_price is None
