from typing import Generic, TypeVar, Optional, Any, List
from pydantic import BaseModel

DataT = TypeVar("DataT")

class MetaResponse(BaseModel):
    total: Optional[int] = None
    page: Optional[int] = None
    page_size: Optional[int] = None
    total_pages: Optional[int] = None

class ApiResponse(BaseModel, Generic[DataT]):
    data: DataT
    meta: Optional[MetaResponse] = None

class ErrorDetail(BaseModel):
    code: str
    message: str
    details: Optional[Any] = None

class ApiErrorResponse(BaseModel):
    error: ErrorDetail
