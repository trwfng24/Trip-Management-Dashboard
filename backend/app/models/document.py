from __future__ import annotations
from typing import TYPE_CHECKING
from uuid import UUID
from sqlalchemy import BigInteger, CheckConstraint, ForeignKey, Index, String, Text, text
from sqlalchemy.dialects.postgresql import UUID as PGUUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base
from app.models.mixins import TimestampMixin
if TYPE_CHECKING:
    from app.models.profile import Profile
    from app.models.trip import Trip
class Document(TimestampMixin, Base):
    __tablename__ = "documents"
    __table_args__ = (CheckConstraint("file_size_bytes >= 0", name="ck_documents_file_size"), Index("idx_documents_trip_created", "trip_id", "created_at", postgresql_ops={"created_at":"DESC"}), Index("idx_documents_uploader", "uploaded_by_user_id"))
    id: Mapped[UUID] = mapped_column(PGUUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))
    trip_id: Mapped[UUID] = mapped_column(PGUUID(as_uuid=True), ForeignKey("trips.id", ondelete="RESTRICT"), nullable=False)
    uploaded_by_user_id: Mapped[UUID] = mapped_column(PGUUID(as_uuid=True), ForeignKey("profiles.id", ondelete="RESTRICT"), nullable=False)
    name: Mapped[str] = mapped_column(String(255), nullable=False); note: Mapped[str|None] = mapped_column(Text)
    storage_key: Mapped[str] = mapped_column(String(500), nullable=False, unique=True); mime_type: Mapped[str|None] = mapped_column(String(100)); file_size_bytes: Mapped[int|None] = mapped_column(BigInteger)
    trip: Mapped[Trip] = relationship(); uploader: Mapped[Profile] = relationship()
