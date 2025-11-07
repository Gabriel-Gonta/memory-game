"""WebSocket manager for real-time game synchronization."""

from typing import Dict, Set
from fastapi import WebSocket
import json
import logging

logger = logging.getLogger(__name__)


class ConnectionManager:
    """Manages WebSocket connections."""

    def __init__(self):
        """Initialize connection manager."""
        self.active_connections: Dict[str, Set[WebSocket]] = {}  # room_code -> set of websockets

    async def connect(self, websocket: WebSocket, room_code: str):
        """Connect a client to a room."""
        await websocket.accept()
        if room_code not in self.active_connections:
            self.active_connections[room_code] = set()
        self.active_connections[room_code].add(websocket)
        logger.info(f"Client connected to room {room_code}")

    def disconnect(self, websocket: WebSocket, room_code: str):
        """Disconnect a client from a room."""
        if room_code in self.active_connections:
            self.active_connections[room_code].discard(websocket)
            if not self.active_connections[room_code]:
                del self.active_connections[room_code]
        logger.info(f"Client disconnected from room {room_code}")

    async def send_personal_message(self, message: dict, websocket: WebSocket):
        """Send a message to a specific client."""
        try:
            await websocket.send_json(message)
        except Exception as e:
            logger.error(f"Error sending personal message: {e}")

    async def broadcast_to_room(self, room_code: str, message: dict):
        """Broadcast a message to all clients in a room."""
        if room_code not in self.active_connections:
            return

        disconnected = []
        for connection in self.active_connections[room_code]:
            try:
                await connection.send_json(message)
            except Exception as e:
                logger.error(f"Error broadcasting to room {room_code}: {e}")
                disconnected.append(connection)

        # Remove disconnected clients
        for connection in disconnected:
            self.active_connections[room_code].discard(connection)


# Global connection manager
manager = ConnectionManager()

