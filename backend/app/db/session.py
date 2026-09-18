from app.core.config import settings
from sqlalchemy import create_engine
from sqlalchemy.engine import URL

database_url = URL.create(
    drivername="postgresql+psycopg",
    username=settings.db_user,
    password=settings.db_password,
    host=settings.db_host,
    port=settings.db_port,
    database=settings.db_name,
)

connect_args: dict[str, str] = {
    "sslmode": settings.db_sslmode,
}

if settings.db_sslrootcert:
    connect_args["sslrootcert"] = settings.db_sslrootcert

engine = create_engine(
    database_url,
    connect_args=connect_args,
    pool_pre_ping=True,
    pool_size=5,
    max_overflow=5,
)
