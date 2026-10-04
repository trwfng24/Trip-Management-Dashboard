from __future__ import annotations
from typing import TYPE_CHECKING
from uuid import UUID
from sqlalchemy import CheckConstraint, ForeignKey, Index, String, Text, text
from sqlalchemy.dialects.postgresql import UUID as PGUUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base
from app.models.mixins import TimestampMixin
if TYPE_CHECKING:
    from app.models.feedback_response import FeedbackResponse
    from app.models.trip import Trip
class FeedbackForm(TimestampMixin, Base):
    __tablename__ = "feedback_forms"
    __table_args__ = (CheckConstraint("status in ('draft', 'open', 'closed')", name="ck_feedback_forms_status"), Index("idx_feedback_forms_trip", "trip_id"))
    id: Mapped[UUID] = mapped_column(PGUUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()")); trip_id: Mapped[UUID] = mapped_column(PGUUID(as_uuid=True), ForeignKey("trips.id", ondelete="RESTRICT"), nullable=False); title: Mapped[str] = mapped_column(String(250), nullable=False); description: Mapped[str|None] = mapped_column(Text); external_url: Mapped[str|None] = mapped_column(Text); status: Mapped[str] = mapped_column(String(20), nullable=False, server_default=text("'draft'"))
    trip: Mapped[Trip] = relationship(); responses: Mapped[list[FeedbackResponse]] = relationship(back_populates="form")
