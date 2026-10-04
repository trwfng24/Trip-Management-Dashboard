from __future__ import annotations

from datetime import date, time
from typing import TYPE_CHECKING
from uuid import UUID

from sqlalchemy import Date, ForeignKey, Index, String, Text, Time, text
from sqlalchemy.dialects.postgresql import UUID as PostgreSQLUUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base
from app.models.mixins import TimestampMixin

if TYPE_CHECKING:
    from app.models.trip import Trip


class ItineraryActivity(TimestampMixin, Base):
    __tablename__ = "itinerary_activities"
    __table_args__ = (Index("idx_itinerary_activities_trip_date_time", "trip_id", "activity_date", "start_time"),)

    id: Mapped[UUID] = mapped_column(PostgreSQLUUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))
    trip_id: Mapped[UUID] = mapped_column(PostgreSQLUUID(as_uuid=True), ForeignKey("trips.id", ondelete="RESTRICT"), nullable=False)
    activity_date: Mapped[date] = mapped_column(Date, nullable=False)
    start_time: Mapped[time | None] = mapped_column(Time)
    end_time: Mapped[time | None] = mapped_column(Time)
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    note: Mapped[str | None] = mapped_column(Text)

    trip: Mapped[Trip] = relationship(back_populates="activities")
