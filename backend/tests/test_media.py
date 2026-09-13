import io
from PIL import Image
from app.services.auth_service import AuthService
from app.integrations.storage import get_media_storage
from app.models.product import ProductImage

def create_test_image_bytes(width=600, height=400, color="blue", format="JPEG") -> bytes:
    buf = io.BytesIO()
    img = Image.new("RGB", (width, height), color=color)
    img.save(buf, format=format)
    return buf.getvalue()

def test_media_pipeline_and_storage(client, db_session):
    # 1. Setup de autenticacao
    AuthService.init_roles_and_admin(db_session)
    login_res = client.post("/api/v1/auth/login", json={"email": "admin@arrudamoveis.com.br", "password": "admin123456"})
    token = login_res.json()["data"]["access_token"]
    auth_header = {"Authorization": f"Bearer {token}"}

    # 2. Upload de imagem JPEG real
    img_bytes = create_test_image_bytes(800, 600, color="navy", format="JPEG")
    files = [("files", ("sofa_teste.jpg", img_bytes, "image/jpeg"))]

    upload_res = client.post("/api/v1/media/upload", files=files, headers=auth_header)
    assert upload_res.status_code == 201
    media_list = upload_res.json()["data"]
    assert len(media_list) == 1
    media_item = media_list[0]
    media_id = media_item["id"]

    assert media_item["mime_type"] == "image/webp"
    assert media_item["storage_key"].endswith(".webp")
    assert media_item["width"] == 800
    assert media_item["height"] == 600

    # 3. Validar se o arquivo e thumbnail existem fisicamente no storage
    storage = get_media_storage()
    assert storage.exists(media_item["storage_key"]) is True
    thumb_key = media_item["storage_key"].replace(".webp", "_thumb.webp")
    assert storage.exists(thumb_key) is True

    # 4. Criar categoria e produto para testar associacao
    cat_res = client.post("/api/v1/categories", json={"name": "Estofados e Poltronas"})
    cat_id = cat_res.json()["data"]["id"]

    prod_res = client.post("/api/v1/products", json={
        "category_id": cat_id,
        "name": "Sofá 3 Lugares Retrátil",
        "price": 1999.00
    })
    prod_id = prod_res.json()["data"]["id"]

    # 5. Associar midia ao produto como foto principal
    assoc_res = client.post(
        f"/api/v1/media/{media_id}/associate",
        json={"product_id": prod_id, "is_primary": True, "alt_text": "Sofá azul marinho"},
        headers=auth_header
    )
    assert assoc_res.status_code == 201
    assert assoc_res.json()["data"]["is_primary"] is True

    # 6. Tentar deletar midia em uso deve falhar com HTTP 400
    del_fail = client.delete(f"/api/v1/media/{media_id}", headers=auth_header)
    assert del_fail.status_code == 400
    assert "em uso" in del_fail.json()["detail"]

    # 7. Testar envio de arquivo corrompido / falso (texto com extensao de imagem)
    fake_files = [("files", ("malicioso.jpg", b"arquivo de texto fingindo ser imagem", "image/jpeg"))]
    fake_upload = client.post("/api/v1/media/upload", files=fake_files, headers=auth_header)
    assert fake_upload.status_code == 400
    assert "não é uma imagem válida" in fake_upload.json()["detail"]

    # 8. Remover associacao do produto e deletar com sucesso
    db_session.query(ProductImage).filter(ProductImage.product_id == prod_id).delete()
    db_session.commit()

    del_ok = client.delete(f"/api/v1/media/{media_id}", headers=auth_header)
    assert del_ok.status_code == 204
    assert storage.exists(media_item["storage_key"]) is False
