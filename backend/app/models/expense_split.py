from __future__ import annotations

from decimal import Decimal
from typing import TYPE_CHECKING
from uuid import UUID

from sqlalchemy import CheckConstraint, ForeignKey, Index, Numeric, UniqueConstraint, text
from sqlalchemy.dialects.postgresql import UUID as PostgreSQLUUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base
from app.models.mixins import TimestampMixin

if TYPE_CHECKING:
    from app.models.expense import Expense
    from app.models.trip_member import TripMember


class ExpenseSplit(TimestampMixin, Base):
    __tablename__ = "expense_splits"
    __table_args__ = (
        CheckConstraint("share_amount >= 0", name="ck_expense_splits_share_amount"),
        UniqueConstraint("expense_id", "member_id", name="uq_expense_splits_expense_member"),
        Index("idx_expense_splits_member", "member_id"),
    )

    id: Mapped[UUID] = mapped_column(PostgreSQLUUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))
    expense_id: Mapped[UUID] = mapped_column(PostgreSQLUUID(as_uuid=True), ForeignKey("expenses.id", ondelete="CASCADE"), nullable=False)
    member_id: Mapped[UUID] = mapped_column(PostgreSQLUUID(as_uuid=True), ForeignKey("trip_members.id", ondelete="RESTRICT"), nullable=False)
    share_amount: Mapped[Decimal] = mapped_column(Numeric(14, 2), nullable=False)

    expense: Mapped[Expense] = relationship(back_populates="splits")
    member: Mapped[TripMember] = relationship(back_populates="expense_splits")
