from sqlalchemy import Column, Table
from sqlalchemy.dialects.postgresql import UUID as PostgreSQLUUID
from sqlalchemy.orm import DeclarativeBase


class Base(DeclarativeBase):
    pass


# This reference table lets SQLAlchemy resolve the documented FK from
# public.profiles to the Supabase-managed auth.users table. It is excluded from
# Alembic autogeneration and is never created or altered by this application.
supabase_auth_users = Table(
    "users",
    Base.metadata,
    Column("id", PostgreSQLUUID(as_uuid=True), primary_key=True),
    schema="auth",
    info={"supabase_managed": True},
)
