import datetime
from typing import Optional, Tuple
from sqlalchemy.orm import Session

from app.models.user import User, Role
from app.core.security import verify_password, get_password_hash, create_access_token
from app.schemas.auth import LoginRequest, UserCreate

class AuthService:
    @staticmethod
    def init_roles_and_admin(db: Session) -> None:
        """Inicializa papéis e usuário administrador inicial caso não existam."""
        roles_data = [
            ("admin", "Acesso total ao sistema e configurações"),
            ("gerente", "Gestão de produtos, categorias, ofertas e relatórios"),
            ("operador", "Cadastro e edição de produtos e fotos")
        ]
        
        for role_name, role_desc in roles_data:
            role = db.query(Role).filter(Role.name == role_name).first()
            if not role:
                role = Role(name=role_name, description=role_desc)
                db.add(role)
        db.commit()

        # Criar admin inicial se não houver usuários
        admin_count = db.query(User).count()
        if admin_count == 0:
            admin_role = db.query(Role).filter(Role.name == "admin").first()
            default_admin = User(
                name="Administrador Arruda",
                email="admin@arrudamoveis.com.br",
                password_hash=get_password_hash("admin123456"),
                role_id=admin_role.id,
                active=True,
            )
            db.add(default_admin)
            db.commit()

    @staticmethod
    def authenticate(db: Session, data: LoginRequest) -> Optional[User]:
        user = db.query(User).filter(User.email == data.email).first()
        if not user or not verify_password(data.password, user.password_hash):
            return None
        if not user.active:
            return None

        user.last_login_at = datetime.datetime.utcnow()
        db.commit()
        db.refresh(user)
        return user

    @staticmethod
    def create_user(db: Session, data: UserCreate) -> User:
        hashed_password = get_password_hash(data.password)
        user = User(
            name=data.name,
            email=data.email,
            password_hash=hashed_password,
            role_id=data.role_id,
            active=data.active,
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        return user
