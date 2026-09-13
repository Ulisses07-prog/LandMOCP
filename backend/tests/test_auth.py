from app.services.auth_service import AuthService
from app.models.user import Role, User

def test_auth_flow(client, db_session):
    # 1. Garantir que papéis e admin inicial existam
    AuthService.init_roles_and_admin(db_session)

    # 2. Login com credenciais válidas
    login_payload = {
        "email": "admin@arrudamoveis.com.br",
        "password": "admin123456"
    }
    response = client.post("/api/v1/auth/login", json=login_payload)
    assert response.status_code == 200
    data = response.json()["data"]
    assert "access_token" in data
    assert data["user"]["email"] == "admin@arrudamoveis.com.br"
    token = data["access_token"]

    # 3. Acessar /auth/me autenticado
    me_res = client.get(
        "/api/v1/auth/me",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert me_res.status_code == 200
    me_data = me_res.json()["data"]
    assert me_data["email"] == "admin@arrudamoveis.com.br"
    assert me_data["role"]["name"] == "admin"

    # 4. Acessar /auth/me sem token deve retornar 401
    unauth_res = client.get("/api/v1/auth/me")
    assert unauth_res.status_code == 401

    # 5. Login com senha errada deve retornar 401
    wrong_login = client.post(
        "/api/v1/auth/login",
        json={"email": "admin@arrudamoveis.com.br", "password": "senhaerrada"}
    )
    assert wrong_login.status_code == 401

    # 6. Admin cria usuário com papel de 'operador'
    operador_role = db_session.query(Role).filter(Role.name == "operador").first()
    new_user_payload = {
        "name": "João Operador",
        "email": "joao@arrudamoveis.com.br",
        "password": "operador123456",
        "role_id": operador_role.id,
        "active": True
    }
    create_user_res = client.post(
        "/api/v1/auth/users",
        json=new_user_payload,
        headers={"Authorization": f"Bearer {token}"}
    )
    assert create_user_res.status_code == 201
    assert create_user_res.json()["data"]["email"] == "joao@arrudamoveis.com.br"

    # 7. Operador faz login
    op_login = client.post(
        "/api/v1/auth/login",
        json={"email": "joao@arrudamoveis.com.br", "password": "operador123456"}
    )
    assert op_login.status_code == 200
    op_token = op_login.json()["data"]["access_token"]

    # 8. Operador tenta criar usuário (ação restrita a admin) -> deve retornar 403 Forbidden
    forbidden_res = client.post(
        "/api/v1/auth/users",
        json={
            "name": "Outro",
            "email": "outro@arrudamoveis.com.br",
            "password": "123456password",
            "role_id": operador_role.id
        },
        headers={"Authorization": f"Bearer {op_token}"}
    )
    assert forbidden_res.status_code == 403
    assert "Permissão negada" in forbidden_res.json()["detail"]

    # 9. Logout
    logout_res = client.post("/api/v1/auth/logout")
    assert logout_res.status_code == 200
