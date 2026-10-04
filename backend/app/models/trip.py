from __future__ import annotations

from datetime import date
from decimal import Decimal
from typing import TYPE_CHECKING
from uuid import UUID

from sqlalchemy import CheckConstraint, Date, ForeignKey, Index, Numeric, String, Text, text
from sqlalchemy.dialects.postgresql import UUID as PostgreSQLUUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base
from app.models.mixins import TimestampMixin

if TYPE_CHECKING:
    from app.models.checklist_task import ChecklistTask
    from app.models.expense import Expense
    from app.models.itinerary_activity import ItineraryActivity
    from app.models.profile import Profile
    from app.models.trip_member import TripMember


class Trip(TimestampMixin, Base):
    __tablename__ = "trips"
    __table_args__ = (
        CheckConstraint("end_date >= start_date", name="ck_trips_dates"),
        CheckConstraint("status in ('draft', 'planning', 'confirmed', 'ongoing', 'completed')", name="ck_trips_status"),
        CheckConstraint("budget_amount >= 0", name="ck_trips_budget_amount"),
        Index("idx_trips_leader_start_date", "leader_id", "start_date", postgresql_ops={"start_date": "DESC"}),
    )

    id: Mapped[UUID] = mapped_column(
        PostgreSQLUUID(as_uuid=True),
        primary_key=True,
        server_default=text("gen_random_uuid()"),
    )
    leader_id: Mapped[UUID] = mapped_column(
        PostgreSQLUUID(as_uuid=True),
        ForeignKey("profiles.id", ondelete="RESTRICT"),
        nullable=False,
    )
    name: Mapped[str] = mapped_column(String(200), nullable=False)
    destination: Mapped[str] = mapped_column(String(200), nullable=False)
    start_date: Mapped[date] = mapped_column(Date, nullable=False)
    end_date: Mapped[date] = mapped_column(Date, nullable=False)
    status: Mapped[str] = mapped_column(String(30), nullable=False, server_default=text("'draft'"))
    budget_amount: Mapped[Decimal] = mapped_column(Numeric(14, 2), nullable=False)
    cover_image_url: Mapped[str | None] = mapped_column(Text)

    leader: Mapped[Profile] = relationship(back_populates="trips")
    members: Mapped[list[TripMember]] = relationship(back_populates="trip")
    activities: Mapped[list[ItineraryActivity]] = relationship(back_populates="trip")
    checklist_tasks: Mapped[list[ChecklistTask]] = relationship(back_populates="trip")
    expenses: Mapped[list[Expense]] = relationship(back_populates="trip")
