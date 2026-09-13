from datetime import datetime
from typing import Optional
import re
from pydantic import BaseModel, Field, ConfigDict, field_validator

EMAIL_REGEX = r"^[\w\.-]+@[\w\.-]+\.\w+$"

class RoleResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    description: Optional[str] = None

class UserBase(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: str = Field(..., max_length=255)
    active: bool = True

    @field_validator("email")
    @classmethod
    def validate_email_format(cls, v: str) -> str:
        clean_email = v.strip().lower()
        if not re.match(EMAIL_REGEX, clean_email):
            raise ValueError("Formato de e-mail inválido.")
        return clean_email

class UserCreate(UserBase):
    password: str = Field(..., min_length=6)
    role_id: int

class UserResponse(UserBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    role_id: int
    role: Optional[RoleResponse] = None
    created_at: datetime
    last_login_at: Optional[datetime] = None

class LoginRequest(BaseModel):
    email: str
    password: str

    @field_validator("email")
    @classmethod
    def validate_email_format(cls, v: str) -> str:
        clean_email = v.strip().lower()
        if not re.match(EMAIL_REGEX, clean_email):
            raise ValueError("Formato de e-mail inválido.")
        return clean_email

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse
