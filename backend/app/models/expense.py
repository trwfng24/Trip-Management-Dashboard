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
    from app.models.expense_split import ExpenseSplit
    from app.models.trip import Trip
    from app.models.trip_member import TripMember


class Expense(TimestampMixin, Base):
    __tablename__ = "expenses"
    __table_args__ = (
        CheckConstraint("amount > 0", name="ck_expenses_amount"),
        Index("idx_expenses_trip_date", "trip_id", "expense_date", postgresql_ops={"expense_date": "DESC"}),
        Index("idx_expenses_payer", "paid_by_member_id"),
    )

    id: Mapped[UUID] = mapped_column(PostgreSQLUUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))
    trip_id: Mapped[UUID] = mapped_column(PostgreSQLUUID(as_uuid=True), ForeignKey("trips.id", ondelete="RESTRICT"), nullable=False)
    paid_by_member_id: Mapped[UUID | None] = mapped_column(PostgreSQLUUID(as_uuid=True), ForeignKey("trip_members.id", ondelete="RESTRICT"))
    title: Mapped[str] = mapped_column(String(250), nullable=False)
    amount: Mapped[Decimal] = mapped_column(Numeric(14, 2), nullable=False)
    expense_date: Mapped[date] = mapped_column(Date, nullable=False)
    note: Mapped[str | None] = mapped_column(Text)

    trip: Mapped[Trip] = relationship(back_populates="expenses")
    paid_by: Mapped[TripMember | None] = relationship(back_populates="paid_expenses")
    splits: Mapped[list[ExpenseSplit]] = relationship(back_populates="expense")
