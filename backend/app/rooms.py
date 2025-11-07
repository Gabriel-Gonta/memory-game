"""Game room management for multiplayer."""

import uuid
import random
import string
from typing import Dict, List, Optional
from datetime import datetime, timedelta
from dataclasses import dataclass, field
from enum import Enum


class RoomStatus(Enum):
    """Room status."""

    WAITING = "waiting"
    PLAYING = "playing"
    FINISHED = "finished"


@dataclass
class Player:
    """Player in a room."""

    id: str
    name: str
    score: int = 0
    is_host: bool = False


@dataclass
class GameRoom:
    """Game room."""

    code: str
    host_id: str
    players: Dict[str, Player] = field(default_factory=dict)
    status: RoomStatus = RoomStatus.WAITING
    settings: Optional[Dict] = None
    created_at: datetime = field(default_factory=datetime.utcnow)
    expires_at: datetime = field(default_factory=lambda: datetime.utcnow() + timedelta(hours=2))


class RoomManager:
    """Manages game rooms."""

    def __init__(self):
        """Initialize room manager."""
        self.rooms: Dict[str, GameRoom] = {}
        self.player_rooms: Dict[str, str] = {}  # player_id -> room_code

    def generate_code(self) -> str:
        """Generate a unique room code."""
        while True:
            code = "".join(random.choices(string.ascii_uppercase, k=6))
            if code not in self.rooms:
                return code

    def create_room(self, host_id: str, host_name: str, settings: Dict) -> str:
        """Create a new game room."""
        code = self.generate_code()
        room = GameRoom(
            code=code,
            host_id=host_id,
            settings=settings,
        )
        room.players[host_id] = Player(
            id=host_id,
            name=host_name,
            is_host=True,
        )
        self.rooms[code] = room
        self.player_rooms[host_id] = code
        return code

    def join_room(self, code: str, player_id: str, player_name: str) -> Optional[GameRoom]:
        """Join a room."""
        room = self.rooms.get(code)
        if not room:
            return None
        if room.status != RoomStatus.WAITING:
            return None
        if len(room.players) >= 4:
            return None
        if player_id in room.players:
            return room

        room.players[player_id] = Player(
            id=player_id,
            name=player_name,
            is_host=False,
        )
        self.player_rooms[player_id] = code
        return room

    def leave_room(self, player_id: str) -> Optional[str]:
        """Leave a room."""
        room_code = self.player_rooms.get(player_id)
        if not room_code:
            return None

        room = self.rooms.get(room_code)
        if not room:
            return None

        if player_id in room.players:
            del room.players[player_id]

        if player_id in self.player_rooms:
            del self.player_rooms[player_id]

        # If host leaves, delete room or transfer host
        if player_id == room.host_id:
            if len(room.players) > 0:
                # Transfer host to first player
                new_host = next(iter(room.players.values()))
                new_host.is_host = True
                room.host_id = new_host.id
            else:
                # Delete empty room
                del self.rooms[room_code]
                return None

        return room_code

    def get_room(self, code: str) -> Optional[GameRoom]:
        """Get room by code."""
        return self.rooms.get(code)

    def get_player_room(self, player_id: str) -> Optional[GameRoom]:
        """Get room for a player."""
        room_code = self.player_rooms.get(player_id)
        if room_code:
            return self.rooms.get(room_code)
        return None

    def update_room_status(self, code: str, status: RoomStatus) -> bool:
        """Update room status."""
        room = self.rooms.get(code)
        if not room:
            return False
        room.status = status
        return True

    def cleanup_expired_rooms(self):
        """Remove expired rooms."""
        now = datetime.utcnow()
        expired_codes = [
            code
            for code, room in self.rooms.items()
            if room.expires_at < now
        ]
        for code in expired_codes:
            room = self.rooms[code]
            for player_id in list(room.players.keys()):
                if player_id in self.player_rooms:
                    del self.player_rooms[player_id]
            del self.rooms[code]


# Global room manager instance
room_manager = RoomManager()

