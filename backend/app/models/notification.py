from __future__ import annotations
from datetime import datetime
from typing import TYPE_CHECKING
from uuid import UUID
from sqlalchemy import Boolean, DateTime, ForeignKey, Index, String, Text, text
from sqlalchemy.dialects.postgresql import UUID as PGUUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base
if TYPE_CHECKING:
    from app.models.profile import Profile
    from app.models.trip import Trip
class Notification(Base):
    __tablename__ = "notifications"
    __table_args__ = (Index("idx_notifications_user_read_created", "user_id", "is_read", "created_at", postgresql_ops={"created_at":"DESC"}), Index("idx_notifications_trip", "trip_id"))
    id: Mapped[UUID] = mapped_column(PGUUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()")); user_id: Mapped[UUID] = mapped_column(PGUUID(as_uuid=True), ForeignKey("profiles.id", ondelete="RESTRICT"), nullable=False); trip_id: Mapped[UUID] = mapped_column(PGUUID(as_uuid=True), ForeignKey("trips.id", ondelete="RESTRICT"), nullable=False); type: Mapped[str] = mapped_column(String(50), nullable=False); title: Mapped[str] = mapped_column(String(250), nullable=False); body: Mapped[str|None] = mapped_column(Text); is_read: Mapped[bool] = mapped_column(Boolean, nullable=False, server_default=text("false")); read_at: Mapped[datetime|None] = mapped_column(DateTime(timezone=True)); created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False, server_default=text("now()"))
    user: Mapped[Profile] = relationship(); trip: Mapped[Trip] = relationship()
