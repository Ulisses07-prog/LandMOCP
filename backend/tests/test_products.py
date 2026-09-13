from app.services.product_service import ProductService

def test_product_crud_and_lifecycle(client, db_session):
    # 1. Criar categoria para o produto
    cat_res = client.post("/api/v1/categories", json={"name": "Cozinha Planejada"})
    category_id = cat_res.json()["data"]["id"]

    # 2. Criar produto em DRAFT
    prod_payload = {
        "category_id": category_id,
        "name": "Armário de Cozinha Compacto 4 Portas",
        "price": 899.90,
        "short_description": "Excelente para espaços compactos",
        "dimensions": "120 x 180 x 45 cm",
        "status": "DRAFT"
    }
    prod_res = client.post("/api/v1/products", json=prod_payload)
    assert prod_res.status_code == 201
    prod_data = prod_res.json()["data"]
    product_id = prod_data["id"]
    assert prod_data["status"] == "DRAFT"
    assert prod_data["slug"] == "armario-de-cozinha-compacto-4-portas"

    # Adicionar imagem principal obrigatória para publicação
    ProductService.add_image(
        db=db_session,
        product_id=product_id,
        storage_key="uploads/armario_cozinha.webp",
        url="/media/uploads/armario_cozinha.webp",
        is_primary=True
    )

    # 3. Publicar produto
    pub_res = client.post(f"/api/v1/products/{product_id}/publish")
    assert pub_res.status_code == 200
    assert pub_res.json()["data"]["status"] == "PUBLISHED"
    assert pub_res.json()["data"]["published_at"] is not None

    # 4. Obter produto por slug
    get_res = client.get(f"/api/v1/products/{prod_data['slug']}")
    assert get_res.status_code == 200
    assert get_res.json()["data"]["name"] == "Armário de Cozinha Compacto 4 Portas"

    # 5. Duplicar produto
    dup_res = client.post(f"/api/v1/products/{product_id}/duplicate")
    assert dup_res.status_code == 200
    dup_data = dup_res.json()["data"]
    assert "Cópia" in dup_data["name"]
    assert dup_data["status"] == "DRAFT"
    assert dup_data["id"] != product_id
