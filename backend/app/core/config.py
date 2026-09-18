from typing import Literal

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "DiDiEms API"
    app_env: str = "development"

    db_host: str
    db_port: int = 5432
    db_name: str = "postgres"
    db_user: str
    db_password: str

    db_sslmode: Literal[
        "disable",
        "allow",
        "prefer",
        "require",
        "verify-ca",
        "verify-full",
    ] = "require"

    db_sslrootcert: str | None = None

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )


settings = Settings()
