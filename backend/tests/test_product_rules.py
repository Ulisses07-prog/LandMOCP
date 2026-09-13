from app.models.analytics import AuditLog
from app.services.product_service import ProductService

def test_product_rules_and_audit(client, db_session):
    # 1. Criar Categoria
    cat_res = client.post("/api/v1/categories", json={"name": "Sala de Jantar"})
    cat_id = cat_res.json()["data"]["id"]

    # 2. Criar Produto em DRAFT
    prod_payload = {
        "category_id": cat_id,
        "name": "Mesa de Jantar 6 Lugares Tampo de Vidro",
        "price": 1499.00,
        "dimensions": "160 x 90 x 78 cm"
    }
    create_res = client.post("/api/v1/products", json=prod_payload)
    assert create_res.status_code == 201
    prod_id = create_res.json()["data"]["id"]
    slug = create_res.json()["data"]["slug"]

    # 3. Tentar publicar SEM foto principal -> deve falhar com HTTP 400
    publish_fail = client.post(f"/api/v1/products/{prod_id}/publish")
    assert publish_fail.status_code == 400
    assert "PUBLISH_NO_PRIMARY_IMAGE" in publish_fail.json()["detail"]

    # 4. Adicionar foto principal ao produto
    ProductService.add_image(
        db=db_session,
        product_id=prod_id,
        storage_key="uploads/mesa_vidro_6l.webp",
        url="/media/uploads/mesa_vidro_6l.webp",
        alt_text="Mesa de jantar 6 lugares tampo de vidro",
        is_primary=True
    )

    # 5. Tentar publicar COM foto principal -> deve suceder com HTTP 200
    publish_ok = client.post(f"/api/v1/products/{prod_id}/publish")
    assert publish_ok.status_code == 200
    assert publish_ok.json()["data"]["status"] == "PUBLISHED"

    # 6. Consultar produto publicado por slug
    get_res = client.get(f"/api/v1/products/{slug}")
    assert get_res.status_code == 200
    assert len(get_res.json()["data"]["images"]) == 1
    assert get_res.json()["data"]["images"][0]["is_primary"] is True

    # 7. Arquivar produto (exclusão lógica)
    archive_res = client.post(f"/api/v1/products/{prod_id}/archive")
    assert archive_res.status_code == 200
    assert archive_res.json()["data"]["status"] == "ARCHIVED"

    # 8. Produto arquivado não deve mais aparecer no detalhe público
    get_archived = client.get(f"/api/v1/products/{slug}")
    assert get_archived.status_code == 404

    # 9. Verificar registros de auditoria em audit_logs
    audit_entries = db_session.query(AuditLog).filter(
        AuditLog.entity_type == "Product",
        AuditLog.entity_id == prod_id
    ).all()
    actions = [log.action for log in audit_entries]
    assert "CREATE" in actions
    assert "PUBLISH" in actions
    assert "ARCHIVE" in actions
