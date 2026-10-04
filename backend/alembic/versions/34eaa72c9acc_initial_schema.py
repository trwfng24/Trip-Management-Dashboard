"""initial schema

Revision ID: 34eaa72c9acc
Revises: 
Create Date: 2026-10-04 14:38:50.113139

"""

from collections.abc import Sequence

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '34eaa72c9acc'
down_revision: str | Sequence[str] | None = None
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass
