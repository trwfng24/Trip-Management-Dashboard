class DomainError(Exception):
    """Lỗi nghiệp vụ có thể trả về an toàn cho API client."""

    status_code = 500
    code = "INTERNAL_ERROR"
    message = "Đã xảy ra lỗi hệ thống."


class DatabaseUnavailableError(DomainError):
    status_code = 503
    code = "DATABASE_UNAVAILABLE"
    message = "Không thể kết nối cơ sở dữ liệu."
