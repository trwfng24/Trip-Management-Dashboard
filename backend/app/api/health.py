from fastapi import APIRouter

from app.common.messages import HEALTHY_SERVICE_MESSAGE
from app.common.responses import ErrorResponse, SuccessResponse
from app.schemas.health import HealthData
from app.services.health_service import check_database_connection

router = APIRouter(tags=["Health"])


@router.get(
    "/health",
    response_model=SuccessResponse[HealthData],
    responses={503: {"model": ErrorResponse}},
)
def health_check() -> SuccessResponse[HealthData]:
    check_database_connection()
    return SuccessResponse(
        message=HEALTHY_SERVICE_MESSAGE,
        data=HealthData(status="ok", database="connected"),
    )
