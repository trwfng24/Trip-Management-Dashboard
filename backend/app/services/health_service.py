from sqlalchemy import text
from sqlalchemy.exc import SQLAlchemyError

from app.common.errors import DatabaseUnavailableError
from app.db.session import engine


def check_database_connection() -> None:
    try:
        with engine.connect() as connection:
            connection.execute(text("select 1"))
    except SQLAlchemyError as error:
        raise DatabaseUnavailableError from error
