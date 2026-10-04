from app.core.config import settings
from app.api.health import router as health_router
from app.common.errors import DomainError
from app.common.responses import ErrorResponse
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse

app = FastAPI(
    title=settings.app_name,
    version="0.1.0",
)


@app.exception_handler(DomainError)
async def handle_domain_error(_: Request, error: DomainError) -> JSONResponse:
    response = ErrorResponse(message=error.message, code=error.code)
    return JSONResponse(status_code=error.status_code, content=response.model_dump())


app.include_router(health_router)
