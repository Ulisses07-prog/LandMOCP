from app.services.auth_service import AuthService
from app.services.product_service import ProductService

def test_analytics_and_dashboard(client, db_session):
    # 1. Setup de autenticacao
    AuthService.init_roles_and_admin(db_session)
    login_res = client.post("/api/v1/auth/login", json={"email": "admin@arrudamoveis.com.br", "password": "admin123456"})
    token = login_res.json()["data"]["access_token"]
    auth_header = {"Authorization": f"Bearer {token}"}

    # 2. Criar produto e publicar
    cat_res = client.post("/api/v1/categories", json={"name": "Poltronas Decorativas"})
    cat_id = cat_res.json()["data"]["id"]

    prod_res = client.post("/api/v1/products", json={
        "category_id": cat_id,
        "name": "Poltrona Opala Pés Palito",
        "price": 499.00
    })
    prod_id = prod_res.json()["data"]["id"]

    ProductService.add_image(
        db=db_session,
        product_id=prod_id,
        storage_key="uploads/poltrona.webp",
        url="/media/uploads/poltrona.webp",
        is_primary=True
    )
    client.post(f"/api/v1/products/{prod_id}/publish")

    # 3. Disparar eventos de telemetria publica
    # Visualizacao de pagina
    client.post("/api/v1/analytics/events", json={"event_type": "PAGE_VIEW", "session_hash": "abc123session"})
    # Visualizacao de produto
    client.post("/api/v1/analytics/events", json={"event_type": "PRODUCT_VIEW", "product_id": prod_id, "session_hash": "abc123session"})
    client.post("/api/v1/analytics/events", json={"event_type": "PRODUCT_VIEW", "product_id": prod_id, "session_hash": "xyz789session"})
    # Clique em WhatsApp
    client.post("/api/v1/analytics/events", json={"event_type": "WHATSAPP_CLICK", "product_id": prod_id, "session_hash": "abc123session"})

    # 4. Acesso ao dashboard sem token deve falhar com 401
    unauth_dash = client.get("/api/v1/analytics/dashboard")
    assert unauth_dash.status_code == 401

    # 5. Acesso ao dashboard autenticado como admin
    dash_res = client.get("/api/v1/analytics/dashboard?period_days=7", headers=auth_header)
    assert dash_res.status_code == 200
    stats = dash_res.json()["data"]

    assert stats["published_products"] >= 1
    assert stats["total_views"] >= 3  # 1 PAGE_VIEW + 2 PRODUCT_VIEW
    assert stats["total_whatsapp_clicks"] >= 1
    assert len(stats["top_products"]) >= 1
    assert stats["top_products"][0]["product_id"] == prod_id
    assert stats["top_products"][0]["views"] == 2
    assert stats["top_products"][0]["whatsapp_clicks"] == 1
