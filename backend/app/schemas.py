"""Pydantic schemas for request/response validation."""

from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional


class ScoreCreate(BaseModel):
    """Schema for creating a score."""

    player_name: str = Field(..., max_length=100)
    score: int = Field(..., ge=0)
    moves: int = Field(..., ge=0)
    time: int = Field(..., ge=0, description="Time in seconds")
    grid_size: str = Field(..., max_length=10)
    theme: str = Field(..., max_length=20)


class ScoreResponse(BaseModel):
    """Schema for score response."""

    id: int
    player_name: str
    score: int
    moves: int
    time: int
    grid_size: str
    theme: str
    created_at: datetime

    class Config:
        from_attributes = True


class TopScoreResponse(BaseModel):
    """Schema for top score response with rank."""

    id: int
    player_name: str
    score: int
    moves: int
    time: int
    grid_size: str
    theme: str
    created_at: datetime
    rank: int

    class Config:
        from_attributes = True


class StatisticsResponse(BaseModel):
    """Schema for statistics response."""

    total_participations: int
    average_score: float
    average_time: float
    average_moves: float
    best_time: int
    best_moves: int
    total_players: int

