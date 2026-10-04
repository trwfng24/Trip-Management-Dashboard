from __future__ import annotations

from typing import TYPE_CHECKING
from uuid import UUID

from sqlalchemy import ForeignKey, String
from sqlalchemy.dialects.postgresql import UUID as PostgreSQLUUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base
from app.models.mixins import TimestampMixin

if TYPE_CHECKING:
    from app.models.trip import Trip


class Profile(TimestampMixin, Base):
    __tablename__ = "profiles"

    id: Mapped[UUID] = mapped_column(
        PostgreSQLUUID(as_uuid=True),
        ForeignKey("auth.users.id", ondelete="CASCADE"),
        primary_key=True,
    )
    display_name: Mapped[str] = mapped_column(String(120), nullable=False)

    trips: Mapped[list[Trip]] = relationship(back_populates="leader")
