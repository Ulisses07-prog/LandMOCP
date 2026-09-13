def test_create_and_list_category(client):
    # Criar categoria
    cat_payload = {
        "name": "Sala de Estar",
        "description": "Sofás, racks e mesas para sua sala",
        "sort_order": 1,
        "active": True
    }
    response = client.post("/api/v1/categories", json=cat_payload)
    assert response.status_code == 201
    created = response.json()["data"]
    assert created["name"] == "Sala de Estar"
    assert created["slug"] == "sala-de-estar"

    # Listar categorias
    list_res = client.get("/api/v1/categories")
    assert list_res.status_code == 200
    data = list_res.json()["data"]
    assert any(c["slug"] == "sala-de-estar" for c in data)

def test_get_category_by_slug(client):
    cat_payload = {
        "name": "Quarto e Colchões",
        "description": "Camas, colchões e guarda-roupas"
    }
    client.post("/api/v1/categories", json=cat_payload)

    response = client.get("/api/v1/categories/quarto-e-colchoes")
    assert response.status_code == 200
    data = response.json()["data"]
    assert data["slug"] == "quarto-e-colchoes"
    assert data["name"] == "Quarto e Colchões"
