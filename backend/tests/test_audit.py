import pytest
from app.models.analytics import AuditLog
from app.services.audit_service import AuditService
from app.services.auth_service import AuthService

def test_list_audit_logs_unauthorized(client):
    response = client.get("/api/v1/admin/audit-logs")
    assert response.status_code == 401

def test_list_audit_logs_as_admin(client, db_session):
    # 1. Garantir que papéis e admin inicial existam
    AuthService.init_roles_and_admin(db_session)
    
    # 2. Login como admin
    login_res = client.post("/api/v1/auth/login", json={
        "email": "admin@arrudamoveis.com.br",
        "password": "admin123456"
    })
    assert login_res.status_code == 200
    token = login_res.json()["data"]["access_token"]

    # 3. Insere um log de auditoria
    AuditService.log_action(
        db=db_session,
        action="UPDATE",
        entity_type="Product",
        entity_id=1,
        metadata={"field": "test"}
    )
    
    # 4. Busca logs de auditoria
    response = client.get(
        "/api/v1/admin/audit-logs",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 200
    data = response.json()
    assert "items" in data
    assert data["total"] >= 1
    assert data["items"][0]["entity_type"] == "Product"
