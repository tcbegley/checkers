import abc
import json
from typing import Dict, List
from urllib.parse import urlparse

import asyncio_redis
import pydantic

from checkers_backend.counters import create_initial_counters, move_to
from checkers_backend.models import Counter, GameState


class GameStore(abc.ABC):
    @abc.abstractmethod
    async def connect(self) -> None:
        pass

    @abc.abstractmethod
    async def disconnect(self) -> None:
        pass

    @abc.abstractmethod
    async def create_game(self, game_id: pydantic.UUID4) -> None:
        pass

    @abc.abstractmethod
    async def get(self, game_id: pydantic.UUID4) -> GameState:
        pass

    @abc.abstractmethod
    async def move_to(
        self,
        game_id: str,
        start_row: int,
        start_col: int,
        end_row: int,
        end_col: int,
    ) -> List[List[Counter]]:
        pass


class MemoryGameStore(GameStore):
    def __init__(self) -> None:
        self.store: Dict[str, GameState] = {}  # noqa

    async def connect(self) -> None:
        pass

    async def disconnect(self) -> None:
        pass

    async def create_game(self, game_id: str) -> GameState:
        initial_counters = create_initial_counters()
        self.store[game_id] = GameState(
            id=game_id,
            player=1,
            counters=initial_counters,
            history=[initial_counters],
        )
        return self.store[game_id]

    async def get(self, game_id: str) -> GameState:
        return self.store[game_id]

    async def move_to(
        self,
        game_id: str,
        start_row: int,
        start_col: int,
        end_row: int,
        end_col: int,
    ) -> GameState:
        player = self.store[game_id].player
        history = self.store[game_id].history

        player, counters = move_to(
            start_row, start_col, end_row, end_col, history[-1], player
        )

        game_state = GameState(
            id=game_id, player=player, history=[*history, counters]
        )
        self.store[game_id] = game_state

        return game_state


class RedisGameStore(GameStore):
    def __init__(self, url: str) -> None:
        parsed_url = urlparse(url)
        self._host = parsed_url.hostname or "localhost"
        self._port = parsed_url.port or 6379

    async def connect(self) -> None:
        self._conn = await asyncio_redis.Pool.create(
            self._host, self._port, poolsize=4
        )

    async def disconnect(self) -> None:
        await self._conn.close()

    async def create_game(self, game_id: str) -> None:
        game_state = GameState(player=1, history=[create_initial_counters()])
        await self._conn.set(game_id, game_state.json(), expire=3600)

    async def get(self, game_id: str) -> GameState:
        game_state_str = await self._conn.get(game_id)
        return GameState.from_string(game_state_str)

    async def move_to(
        self,
        game_id: str,
        start_row: int,
        start_col: int,
        end_row: int,
        end_col: int,
    ) -> GameState:
        game_state = await self.get(game_id)

        player, counters = move_to(
            start_row,
            start_col,
            end_row,
            end_col,
            game_state.history[-1],
            game_state.player,
        )

        game_state = GameState(
            player=player, history=[*game_state.history, counters]
        )

        await self._conn.set(game_id, game_state.json(), expire=3600)
        return game_state


def get_store(url: str) -> GameStore:
    parsed_url = urlparse(url)
    if parsed_url.scheme == "redis":
        return RedisGameStore(url)
    elif parsed_url.scheme == "memory":
        return MemoryGameStore()
    raise ValueError(f"Unsupported url: {url}")
