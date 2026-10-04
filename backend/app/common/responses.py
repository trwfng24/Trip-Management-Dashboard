from typing import Generic, TypeVar

from pydantic import BaseModel

DataT = TypeVar("DataT")


class SuccessResponse(BaseModel, Generic[DataT]):
    message: str
    data: DataT


class ErrorResponse(BaseModel):
    message: str
    code: str
    details: dict[str, str] | None = None
