"""Database configuration and session management."""

from sqlmodel import SQLModel, Session, create_engine
from typing import Generator
import os

DATABASE_URL = os.getenv(
    "DATABASE_URL", "sqlite:///./memory_game.db"
)

engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False} if "sqlite" in DATABASE_URL else {},
    echo=False,
)


def create_db_and_tables() -> None:
    """Create database tables."""
    SQLModel.metadata.create_all(engine)


def get_session() -> Generator[Session, None, None]:
    """Get database session."""
    with Session(engine) as session:
        yield session

