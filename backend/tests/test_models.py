"""Tests for database models."""

import pytest
from datetime import datetime
from app.models import Score


def test_score_model_creation():
    """Test creating a Score model instance."""
    score = Score(
        player_name="Test Player",
        score=8,
        moves=20,
        time=120,
        grid_size="4x4",
        theme="numbers",
    )
    assert score.player_name == "Test Player"
    assert score.score == 8
    assert score.moves == 20
    assert score.time == 120
    assert score.grid_size == "4x4"
    assert score.theme == "numbers"
    assert score.id is None  # Not set until saved
    assert isinstance(score.created_at, datetime) or score.created_at is None


def test_score_model_validation():
    """Test Score model field validation."""
    # Valid score
    score = Score(
        player_name="Test",
        score=0,  # Minimum valid
        moves=0,
        time=0,
        grid_size="4x4",
        theme="numbers",
    )
    assert score.score == 0

    # Test that negative values would be rejected by Pydantic
    # (This is handled at the schema level, not model level)


