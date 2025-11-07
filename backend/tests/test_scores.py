"""Tests for score endpoints."""

import pytest
from fastapi.testclient import TestClient


def test_create_score(client: TestClient):
    """Test creating a new score."""
    score_data = {
        "player_name": "Test Player",
        "score": 8,
        "moves": 20,
        "time": 120,
        "grid_size": "4x4",
        "theme": "numbers",
    }
    response = client.post("/api/scores", json=score_data)
    assert response.status_code == 201
    data = response.json()
    assert data["player_name"] == "Test Player"
    assert data["score"] == 8
    assert data["moves"] == 20
    assert data["time"] == 120
    assert data["grid_size"] == "4x4"
    assert data["theme"] == "numbers"
    assert "id" in data
    assert "created_at" in data


def test_create_score_invalid_data(client: TestClient):
    """Test creating a score with invalid data."""
    # Negative score
    score_data = {
        "player_name": "Test Player",
        "score": -1,
        "moves": 20,
        "time": 120,
        "grid_size": "4x4",
        "theme": "numbers",
    }
    response = client.post("/api/scores", json=score_data)
    assert response.status_code == 422

    # Missing required field
    score_data = {
        "player_name": "Test Player",
        "score": 8,
        "moves": 20,
        # Missing time, grid_size, theme
    }
    response = client.post("/api/scores", json=score_data)
    assert response.status_code == 422


def test_get_top_scores_empty(client: TestClient):
    """Test getting top scores when database is empty."""
    response = client.get("/api/scores/top")
    assert response.status_code == 200
    assert response.json() == []


def test_get_top_scores(client: TestClient):
    """Test getting top scores."""
    # Create multiple scores
    scores = [
        {"player_name": "Player 1", "score": 10, "moves": 15, "time": 100, "grid_size": "4x4", "theme": "numbers"},
        {"player_name": "Player 2", "score": 8, "moves": 20, "time": 120, "grid_size": "4x4", "theme": "numbers"},
        {"player_name": "Player 3", "score": 12, "moves": 18, "time": 90, "grid_size": "4x4", "theme": "numbers"},
    ]
    for score in scores:
        client.post("/api/scores", json=score)

    response = client.get("/api/scores/top?limit=2")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 2
    # Should be ordered by score descending
    assert data[0]["score"] == 12
    assert data[0]["rank"] == 1
    assert data[1]["score"] == 10
    assert data[1]["rank"] == 2


def test_get_top_scores_with_tie(client: TestClient):
    """Test top scores ordering when scores are equal (should use time as tiebreaker)."""
    scores = [
        {"player_name": "Player 1", "score": 10, "moves": 15, "time": 100, "grid_size": "4x4", "theme": "numbers"},
        {"player_name": "Player 2", "score": 10, "moves": 15, "time": 80, "grid_size": "4x4", "theme": "numbers"},
    ]
    for score in scores:
        client.post("/api/scores", json=score)

    response = client.get("/api/scores/top")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 2
    # Player 2 should be first (same score, but faster time)
    assert data[0]["player_name"] == "Player 2"
    assert data[0]["time"] == 80


def test_get_statistics_empty(client: TestClient):
    """Test getting statistics when database is empty."""
    response = client.get("/api/scores/statistics")
    assert response.status_code == 200
    data = response.json()
    assert data["total_participations"] == 0
    assert data["average_score"] == 0.0
    assert data["average_time"] == 0.0
    assert data["average_moves"] == 0.0
    assert data["best_time"] == 0
    assert data["best_moves"] == 0
    assert data["total_players"] == 0


def test_get_statistics(client: TestClient):
    """Test getting statistics with data."""
    scores = [
        {"player_name": "Player 1", "score": 10, "moves": 15, "time": 100, "grid_size": "4x4", "theme": "numbers"},
        {"player_name": "Player 2", "score": 8, "moves": 20, "time": 120, "grid_size": "4x4", "theme": "numbers"},
        {"player_name": "Player 1", "score": 12, "moves": 12, "time": 80, "grid_size": "4x4", "theme": "numbers"},
    ]
    for score in scores:
        client.post("/api/scores", json=score)

    response = client.get("/api/scores/statistics")
    assert response.status_code == 200
    data = response.json()
    assert data["total_participations"] == 3
    assert data["average_score"] == 10.0  # (10 + 8 + 12) / 3
    assert data["average_time"] == 100.0  # (100 + 120 + 80) / 3
    assert data["average_moves"] == pytest.approx(15.67, rel=1e-3)  # (15 + 20 + 12) / 3 ≈ 15.67
    assert data["best_time"] == 80  # Minimum time
    assert data["best_moves"] == 12  # Minimum moves
    assert data["total_players"] == 2  # Player 1 and Player 2



