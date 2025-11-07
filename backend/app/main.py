"""FastAPI application main file."""

from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Session, select, func
from typing import List
import logging

from app.database import get_session, create_db_and_tables
from app.models import Score
from app.schemas import (
    ScoreCreate,
    ScoreResponse,
    TopScoreResponse,
    StatisticsResponse,
)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

try:
    from app.themes import get_theme_data
except ImportError as e:
    # Themes module optional
    logger.warning(f"Themes module not available: {e}")
    get_theme_data = None

app = FastAPI(
    title="Memory Game API",
    description="API for the Memory Game application",
    version="1.0.0",
)

# CORS middleware - Allow local network access
# In development, allow connections from localhost and local network IPs
import os
import socket

def get_allowed_origins():
    """Get allowed origins for CORS, including local network IPs."""
    origins = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ]
    
    # Add local network IPs (192.168.x.x, 10.x.x.x, 172.16-31.x.x)
    # This allows access from devices on the same network
    try:
        # Get local IP address
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        local_ip = s.getsockname()[0]
        s.close()
        
        # Add the local IP to allowed origins
        origins.append(f"http://{local_ip}:3000")
    except Exception:
        # If we can't determine the IP, just use the basic origins
        pass
    
    return origins

# For development, use a permissive CORS policy for local network access
# In production, use restricted origins
if os.getenv("ENVIRONMENT", "development") == "development":
    # Allow all origins in development (for local network access)
    # Note: allow_credentials must be False when using "*"
    # This is fine for local development as we don't need cookies/auth
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],  # Allow all origins in development
        allow_credentials=False,  # Must be False when using "*"
        allow_methods=["*"],
        allow_headers=["*"],
    )
else:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=get_allowed_origins(),
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )


@app.on_event("startup")
def on_startup() -> None:
    """Initialize database on startup."""
    create_db_and_tables()


@app.get("/health")
def health_check() -> dict:
    """Health check endpoint."""
    return {"status": "ok"}


@app.post("/api/scores", response_model=ScoreResponse, status_code=201)
def create_score(
    score_data: ScoreCreate, session: Session = Depends(get_session)
) -> ScoreResponse:
    """Create a new score."""
    try:
        score = Score(**score_data.model_dump())
        session.add(score)
        session.commit()
        session.refresh(score)
        return ScoreResponse.model_validate(score)
    except Exception as e:
        logger.error(f"Error creating score: {str(e)}", exc_info=True)
        session.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to create score: {str(e)}")


@app.get("/api/scores/top", response_model=List[TopScoreResponse])
def get_top_scores(
    limit: int = 10, session: Session = Depends(get_session)
) -> List[TopScoreResponse]:
    """Get top scores ordered by score (descending) and time (ascending)."""
    try:
        statement = (
            select(Score)
            .order_by(Score.score.desc(), Score.time.asc(), Score.moves.asc())
            .limit(limit)
        )
        scores = session.exec(statement).all()

        result = []
        for rank, score in enumerate(scores, start=1):
            score_dict = score.model_dump()
            score_dict["rank"] = rank
            result.append(TopScoreResponse(**score_dict))

        return result
    except Exception as e:
        logger.error(f"Error getting top scores: {str(e)}", exc_info=True)
        # Return empty list if there's an error
        return []


@app.get("/api/scores/statistics", response_model=StatisticsResponse)
def get_statistics(session: Session = Depends(get_session)) -> StatisticsResponse:
    """Get statistics about all games."""
    try:
        total = session.exec(select(func.count(Score.id))).one() or 0

        if total == 0:
            return StatisticsResponse(
                total_participations=0,
                average_score=0.0,
                average_time=0.0,
                average_moves=0.0,
                best_time=0,
                best_moves=0,
                total_players=0,
            )

        avg_score = session.exec(select(func.avg(Score.score))).one()
        avg_time = session.exec(select(func.avg(Score.time))).one()
        avg_moves = session.exec(select(func.avg(Score.moves))).one()
        # Get best time and moves (minimum for best performance)
        best_time_result = session.exec(select(func.min(Score.time))).one()
        best_moves_result = session.exec(select(func.min(Score.moves))).one()
        # Get distinct player count
        total_players_result = session.exec(
            select(func.count(func.distinct(Score.player_name)))
        ).one()
        
        best_time = int(best_time_result) if best_time_result else 0
        best_moves = int(best_moves_result) if best_moves_result else 0
        total_players = int(total_players_result) if total_players_result else 0

        return StatisticsResponse(
            total_participations=total,
            average_score=float(avg_score) if avg_score else 0.0,
            average_time=float(avg_time) if avg_time else 0.0,
            average_moves=float(avg_moves) if avg_moves else 0.0,
            best_time=best_time,
            best_moves=best_moves,
            total_players=total_players,
        )
    except Exception as e:
        logger.error(f"Error getting statistics: {str(e)}", exc_info=True)
        # Return default values if there's an error
        return StatisticsResponse(
            total_participations=0,
            average_score=0.0,
            average_time=0.0,
            average_moves=0.0,
            best_time=0,
            best_moves=0,
            total_players=0,
        )


@app.get("/api/themes/{theme_name}")
async def get_theme(theme_name: str, limit: int = 18):
    """
    Get theme data (Pokemon, dogs, movies, flags, fruits).
    
    Returns a list of theme items, each containing:
    - id: Unique identifier
    - name: Display name
    - image: URL to the image (for pokemon, dogs, movies, flags)
    - emoji: Emoji character (for fruits theme only)
    
    Example response:
    {
        "theme": "pokemon",
        "data": [
            {
                "id": 1,
                "name": "Bulbasaur",
                "image": "https://raw.githubusercontent.com/..."
            },
            ...
        ]
    }
    """
    if get_theme_data is None:
        raise HTTPException(status_code=501, detail="Themes feature not available")
    try:
        theme_data = await get_theme_data(theme_name, limit)
        return {"theme": theme_name, "data": theme_data}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching theme {theme_name}: {e}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch theme data: {str(e)}"
        )



