from __future__ import annotations
from datetime import datetime
from typing import Any, TYPE_CHECKING
from uuid import UUID
from sqlalchemy import DateTime, ForeignKey, Index, String, text
from sqlalchemy.dialects.postgresql import JSONB, UUID as PGUUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base
if TYPE_CHECKING:
    from app.models.feedback_form import FeedbackForm
    from app.models.trip_member import TripMember
class FeedbackResponse(Base):
    __tablename__ = "feedback_responses"
    __table_args__ = (Index("idx_feedback_responses_form_submitted", "form_id", "submitted_at", postgresql_ops={"submitted_at":"DESC"}), Index("idx_feedback_responses_member", "member_id"))
    id: Mapped[UUID] = mapped_column(PGUUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()")); form_id: Mapped[UUID] = mapped_column(PGUUID(as_uuid=True), ForeignKey("feedback_forms.id", ondelete="CASCADE"), nullable=False); member_id: Mapped[UUID|None] = mapped_column(PGUUID(as_uuid=True), ForeignKey("trip_members.id", ondelete="RESTRICT")); respondent_name: Mapped[str|None] = mapped_column(String(120)); answers: Mapped[dict[str, Any]] = mapped_column(JSONB, nullable=False, server_default=text("'{}'::jsonb")); submitted_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False, server_default=text("now()"))
    form: Mapped[FeedbackForm] = relationship(back_populates="responses"); member: Mapped[TripMember|None] = relationship()
