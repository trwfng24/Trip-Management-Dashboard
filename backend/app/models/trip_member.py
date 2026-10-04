from __future__ import annotations

from datetime import datetime
from typing import TYPE_CHECKING
from uuid import UUID

from sqlalchemy import Boolean, DateTime, ForeignKey, Index, String, text
from sqlalchemy.dialects.postgresql import UUID as PostgreSQLUUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base
from app.models.mixins import TimestampMixin

if TYPE_CHECKING:
    from app.models.checklist_task import ChecklistTask
    from app.models.expense import Expense
    from app.models.expense_split import ExpenseSplit
    from app.models.trip import Trip


class TripMember(TimestampMixin, Base):
    __tablename__ = "trip_members"
    __table_args__ = (Index("idx_trip_members_trip_active", "trip_id", "is_active"),)

    id: Mapped[UUID] = mapped_column(
        PostgreSQLUUID(as_uuid=True),
        primary_key=True,
        server_default=text("gen_random_uuid()"),
    )
    trip_id: Mapped[UUID] = mapped_column(
        PostgreSQLUUID(as_uuid=True),
        ForeignKey("trips.id", ondelete="RESTRICT"),
        nullable=False,
    )
    display_name: Mapped[str] = mapped_column(String(120), nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, nullable=False, server_default=text("true"))
    joined_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False, server_default=text("now()"))
    left_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))

    trip: Mapped[Trip] = relationship(back_populates="members")
    assigned_checklist_tasks: Mapped[list[ChecklistTask]] = relationship(back_populates="assignee")
    paid_expenses: Mapped[list[Expense]] = relationship(back_populates="paid_by")
    expense_splits: Mapped[list[ExpenseSplit]] = relationship(back_populates="member")
