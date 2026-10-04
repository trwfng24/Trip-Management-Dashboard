from dataclasses import dataclass
from typing import Annotated, Callable
from uuid import UUID

import httpx
from fastapi import Header

from app.common.errors import DomainError
from app.core.config import settings


@dataclass(frozen=True)
class CurrentUser:
    id: UUID


class AuthenticationError(DomainError):
    def __init__(self, status_code: int, code: str, message: str) -> None:
        self.status_code = status_code
        self.code = code
        self.message = message


def verify_access_token(
    authorization: str | None,
    http_get: Callable[..., httpx.Response] = httpx.get,
) -> CurrentUser:
    if not authorization or not authorization.startswith("Bearer "):
        raise AuthenticationError(401, "AUTHENTICATION_REQUIRED", "Cần đăng nhập để thực hiện thao tác này.")

    access_token = authorization.removeprefix("Bearer ").strip()
    if not access_token:
        raise AuthenticationError(401, "AUTHENTICATION_REQUIRED", "Cần đăng nhập để thực hiện thao tác này.")

    try:
        response = http_get(
            f"{settings.supabase_url.rstrip('/')}/auth/v1/user",
            headers={
                "apikey": settings.supabase_publishable_key,
                "Authorization": f"Bearer {access_token}",
            },
            timeout=settings.supabase_auth_timeout_seconds,
        )
    except httpx.RequestError as error:
        raise AuthenticationError(503, "AUTH_SERVICE_UNAVAILABLE", "Dịch vụ xác thực tạm thời không khả dụng.") from error

    if response.status_code != 200:
        raise AuthenticationError(401, "INVALID_ACCESS_TOKEN", "Phiên đăng nhập không hợp lệ hoặc đã hết hạn.")

    try:
        return CurrentUser(id=UUID(response.json()["id"]))
    except (KeyError, TypeError, ValueError) as error:
        raise AuthenticationError(401, "INVALID_ACCESS_TOKEN", "Phiên đăng nhập không hợp lệ hoặc đã hết hạn.") from error


def get_current_user(
    authorization: Annotated[str | None, Header()] = None,
) -> CurrentUser:
    return verify_access_token(authorization)
