from __future__ import annotations
from datetime import datetime
from typing import TYPE_CHECKING
from uuid import UUID
from sqlalchemy import CheckConstraint, DateTime, ForeignKey, Index, String, Text, text
from sqlalchemy.dialects.postgresql import UUID as PGUUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base
from app.models.mixins import TimestampMixin
if TYPE_CHECKING:
    from app.models.trip import Trip
    from app.models.trip_member import TripMember
class Opinion(TimestampMixin, Base):
    __tablename__ = "opinions"
    __table_args__ = (CheckConstraint("status in ('pending', 'approved')", name="ck_opinions_status"), Index("idx_opinions_trip_status_created", "trip_id", "status", "created_at", postgresql_ops={"created_at":"DESC"}), Index("idx_opinions_member", "member_id"))
    id: Mapped[UUID] = mapped_column(PGUUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()")); trip_id: Mapped[UUID] = mapped_column(PGUUID(as_uuid=True), ForeignKey("trips.id", ondelete="RESTRICT"), nullable=False); member_id: Mapped[UUID|None] = mapped_column(PGUUID(as_uuid=True), ForeignKey("trip_members.id", ondelete="RESTRICT")); content: Mapped[str] = mapped_column(Text, nullable=False); status: Mapped[str] = mapped_column(String(20), nullable=False, server_default=text("'pending'")); approved_at: Mapped[datetime|None] = mapped_column(DateTime(timezone=True))
    trip: Mapped[Trip] = relationship(); member: Mapped[TripMember|None] = relationship()
