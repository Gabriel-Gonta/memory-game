"""Database models."""

from sqlmodel import SQLModel, Field
from datetime import datetime
from typing import Optional


class Score(SQLModel, table=True):
    """Score model for storing game results."""

    id: Optional[int] = Field(default=None, primary_key=True)
    player_name: str = Field(max_length=100)
    score: int = Field(ge=0)
    moves: int = Field(ge=0)
    time: int = Field(ge=0, description="Time in seconds")
    grid_size: str = Field(max_length=10)
    theme: str = Field(max_length=20)
    created_at: Optional[datetime] = Field(default_factory=datetime.utcnow)

