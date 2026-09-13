from fastapi import APIRouter, Depends, HTTPException, Response, Request, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import create_access_token
from app.core.deps import get_current_user, require_roles
from app.models.user import User
from app.schemas.auth import LoginRequest, TokenResponse, UserResponse, UserCreate
from app.schemas.common import ApiResponse
from app.services.auth_service import AuthService

router = APIRouter(prefix="/auth", tags=["Autenticação"])


@router.post("/login")
async def login(
    request: Request,
    response: Response,
    db: Session = Depends(get_db)
):
    content_type = request.headers.get("content-type", "")
    if "application/x-www-form-urlencoded" in content_type:
        form = await request.form()
        email = str(form.get("username") or "")
        password = str(form.get("password") or "")
        login_data = LoginRequest(email=email, password=password)
    else:
        body = await request.json()
        login_data = LoginRequest(**body)

    user = AuthService.authenticate(db, login_data)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="E-mail ou senha incorretos."
        )

    access_token = create_access_token(subject=user.id)
    
    # Cookie HttpOnly seguro para navegadores
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        secure=False,
        samesite="lax",
        max_age=60 * 60 * 24
    )

    user_out = UserResponse.model_validate(user).model_dump()

    # Retorna tanto na raiz (para o botão Authorize do Swagger UI) quanto em data (para o Frontend)
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "data": {
            "access_token": access_token,
            "token_type": "bearer",
            "user": user_out
        }
    }

@router.post("/logout", status_code=status.HTTP_200_OK)
def logout(response: Response):
    response.delete_cookie(key="access_token")
    return {"message": "Logout realizado com sucesso."}

@router.get("/me", response_model=ApiResponse[UserResponse])
def read_current_user(current_user: User = Depends(get_current_user)):
    return ApiResponse(data=UserResponse.model_validate(current_user))

@router.post("/users", response_model=ApiResponse[UserResponse], status_code=status.HTTP_201_CREATED)
def create_user(
    user_data: UserCreate,
    current_admin: User = Depends(require_roles("admin")),
    db: Session = Depends(get_db)
):
    existing = db.query(User).filter(User.email == user_data.email).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Já existe um usuário cadastrado com este e-mail."
        )
    new_user = AuthService.create_user(db, user_data)
    return ApiResponse(data=UserResponse.model_validate(new_user))
