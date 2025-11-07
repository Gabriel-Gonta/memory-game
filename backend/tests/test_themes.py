"""Tests for theme endpoints."""

from unittest.mock import AsyncMock, patch

from fastapi import HTTPException
from fastapi.testclient import TestClient


def test_get_theme_not_available(client: TestClient):
    """Test getting theme when themes module is not available."""
    # Mock the import to fail
    with patch("app.main.get_theme_data", None):
        response = client.get("/api/themes/pokemon")
        assert response.status_code == 501
        assert "not available" in response.json()["detail"].lower()


@patch("app.main.get_theme_data", new_callable=AsyncMock)
def test_get_theme_pokemon(mock_get_theme_data: AsyncMock, client: TestClient):
    """Test getting Pokemon theme."""
    mock_data = [
        {"id": 1, "name": "Bulbasaur", "image": "https://example.com/bulbasaur.png"},
        {"id": 2, "name": "Charmander", "image": "https://example.com/charmander.png"},
    ]
    mock_get_theme_data.return_value = mock_data

    response = client.get("/api/themes/pokemon?limit=2")
    assert response.status_code == 200
    data = response.json()
    assert data["theme"] == "pokemon"
    assert len(data["data"]) == 2
    assert data["data"][0]["name"] == "Bulbasaur"


@patch("app.main.get_theme_data", new_callable=AsyncMock)
def test_get_theme_dogs(mock_get_theme_data: AsyncMock, client: TestClient):
    """Test getting dogs theme."""
    mock_data = [
        {"id": 1, "name": "Golden Retriever", "image": "https://example.com/dog1.jpg"},
    ]
    mock_get_theme_data.return_value = mock_data

    response = client.get("/api/themes/dogs?limit=1")
    assert response.status_code == 200
    data = response.json()
    assert data["theme"] == "dogs"
    assert len(data["data"]) == 1


@patch("app.main.get_theme_data", new_callable=AsyncMock)
def test_get_theme_movies(mock_get_theme_data: AsyncMock, client: TestClient):
    """Test getting movies theme."""
    mock_data = [
        {"id": 550, "name": "Fight Club", "image": "https://image.tmdb.org/t/p/w500/poster.jpg"},
    ]
    mock_get_theme_data.return_value = mock_data

    response = client.get("/api/themes/movies?limit=1")
    assert response.status_code == 200
    data = response.json()
    assert data["theme"] == "movies"
    assert len(data["data"]) == 1


@patch("app.main.get_theme_data", new_callable=AsyncMock)
def test_get_theme_error_handling(mock_get_theme_data: AsyncMock, client: TestClient):
    """Test error handling when theme fetch fails."""
    mock_get_theme_data.side_effect = HTTPException(status_code=500, detail="API Error")

    response = client.get("/api/themes/pokemon")
    assert response.status_code == 500
    assert "API Error" in response.json()["detail"]

