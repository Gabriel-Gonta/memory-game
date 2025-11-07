"""Tests for Pydantic schemas."""

import pytest
from datetime import datetime
from pydantic import ValidationError
from app.schemas import ScoreCreate, ScoreResponse, TopScoreResponse, StatisticsResponse


def test_score_create_valid():
    """Test creating a valid ScoreCreate schema."""
    score = ScoreCreate(
        player_name="Test Player",
        score=8,
        moves=20,
        time=120,
        grid_size="4x4",
        theme="numbers",
    )
    assert score.player_name == "Test Player"
    assert score.score == 8


def test_score_create_invalid_negative():
    """Test ScoreCreate validation rejects negative values."""
    with pytest.raises(ValidationError):
        ScoreCreate(
            player_name="Test",
            score=-1,  # Invalid
            moves=20,
            time=120,
            grid_size="4x4",
            theme="numbers",
        )


def test_score_create_missing_field():
    """Test ScoreCreate validation requires all fields."""
    with pytest.raises(ValidationError):
        ScoreCreate(
            player_name="Test",
            score=8,
            # Missing moves, time, etc.
        )


def test_score_response():
    """Test ScoreResponse schema."""
    score = ScoreResponse(
        id=1,
        player_name="Test",
        score=8,
        moves=20,
        time=120,
        grid_size="4x4",
        theme="numbers",
        created_at=datetime.now(),
    )
    assert score.id == 1
    assert isinstance(score.created_at, datetime)


def test_top_score_response():
    """Test TopScoreResponse schema with rank."""
    score = TopScoreResponse(
        id=1,
        player_name="Test",
        score=8,
        moves=20,
        time=120,
        grid_size="4x4",
        theme="numbers",
        created_at=datetime.now(),
        rank=1,
    )
    assert score.rank == 1


def test_statistics_response():
    """Test StatisticsResponse schema."""
    stats = StatisticsResponse(
        total_participations=10,
        average_score=8.5,
        average_time=100.0,
        average_moves=18.5,
        best_time=60,
        best_moves=12,
        total_players=5,
    )
    assert stats.total_participations == 10
    assert stats.average_score == 8.5
    assert stats.best_time == 60


