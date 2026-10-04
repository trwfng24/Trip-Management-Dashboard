from __future__ import annotations

from typing import TYPE_CHECKING
from uuid import UUID

from sqlalchemy import CheckConstraint, ForeignKey, Index, String, Text, text
from sqlalchemy.dialects.postgresql import UUID as PostgreSQLUUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base
from app.models.mixins import TimestampMixin

if TYPE_CHECKING:
    from app.models.trip import Trip
    from app.models.trip_member import TripMember


class ChecklistTask(TimestampMixin, Base):
    __tablename__ = "checklist_tasks"
    __table_args__ = (
        CheckConstraint("status in ('not_completed', 'completed')", name="ck_checklist_tasks_status"),
        Index("idx_checklist_tasks_trip_status", "trip_id", "status"),
        Index("idx_checklist_tasks_assignee", "assignee_member_id"),
    )

    id: Mapped[UUID] = mapped_column(PostgreSQLUUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))
    trip_id: Mapped[UUID] = mapped_column(PostgreSQLUUID(as_uuid=True), ForeignKey("trips.id", ondelete="RESTRICT"), nullable=False)
    assignee_member_id: Mapped[UUID | None] = mapped_column(PostgreSQLUUID(as_uuid=True), ForeignKey("trip_members.id", ondelete="RESTRICT"))
    title: Mapped[str] = mapped_column(String(250), nullable=False)
    note: Mapped[str | None] = mapped_column(Text)
    status: Mapped[str] = mapped_column(String(20), nullable=False, server_default=text("'not_completed'"))

    trip: Mapped[Trip] = relationship(back_populates="checklist_tasks")
    assignee: Mapped[TripMember | None] = relationship(back_populates="assigned_checklist_tasks")
