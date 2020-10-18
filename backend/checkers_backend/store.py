import abc
from typing import Dict
from urllib.parse import urlparse

import asyncio_redis

from checkers_backend.counters import create_initial_counters, move_to
from checkers_backend.models import BoardState, GameState


class GameNotFoundError(Exception):
    pass


class GameFullError(Exception):
    pass


class GameStore(abc.ABC):
    @abc.abstractmethod
    async def connect(self) -> None:
        """
        Connect to the store. Called on application startup.
        """
        pass

    @abc.abstractmethod
    async def disconnect(self) -> None:
        """
        Disconnect from the store. Called on application shutdown.
        """
        pass

    @abc.abstractmethod
    async def _get(self, game_id: str) -> GameState:
        """
        Get the current game state of game with id `game_id`.
        """
        pass

    @abc.abstractmethod
    async def _set(self, game_id: str, game_state: GameState) -> GameState:
        """
        Set the game state of game with id `game_id`.
        """
        pass

    async def create_game(self, game_id: str) -> GameState:
        """
        Create a new game and save it in the store.
        """
        board_state = BoardState(player=1, history=[create_initial_counters()])
        game_state = GameState(
            board_state=board_state, local_play=False, player_count=1
        )
        return await self._set(game_id, game_state)

    async def play_locally(self, game_id: str) -> GameState:
        game_state = await self._get(game_id)
        game_state = GameState(
            board_state=game_state.board_state,
            local_play=True,
            player_count=game_state.player_count,
        )
        return await self._set(game_id, game_state)

    async def add_player(self, game_id: str) -> GameState:
        """
        Add a player to the game with id `game_id`.
        """
        game_state = await self._get(game_id)
        if (game_state.local_play and game_state.player_count >= 1) or (
            not game_state.local_play and game_state.player_count >= 2
        ):
            raise GameFullError
        game_state = GameState(
            board_state=game_state.board_state,
            local_play=game_state.local_play,
            player_count=game_state.player_count + 1,
        )
        return await self._set(game_id, game_state)

    async def move_to(
        self,
        game_id: str,
        start_row: int,
        start_col: int,
        end_row: int,
        end_col: int,
    ) -> GameState:
        game_state = await self._get(game_id)

        player, counters = move_to(
            start_row,
            start_col,
            end_row,
            end_col,
            game_state.board_state.history[-1],
            game_state.board_state.player,
        )

        game_state.board_state = BoardState(
            player=player,
            history=[
                # clear valid moves on previous states so that user can only
                # make a move in current board state
                *[
                    [counter.clear_valid_moves() for counter in counters]
                    for counters in game_state.board_state.history
                ],
                counters,
            ],
        )

        return await self._set(game_id, game_state)


class MemoryGameStore(GameStore):
    def __init__(self) -> None:
        self.store: Dict[str, GameState] = {}  # noqa

    async def connect(self) -> None:
        pass

    async def disconnect(self) -> None:
        pass

    async def _get(self, game_id: str) -> GameState:
        try:
            return self.store[game_id]
        except KeyError:
            raise GameNotFoundError(f"No game with id {game_id}")

    async def _set(self, game_id: str, game_state: GameState) -> GameState:
        self.store[game_id] = game_state
        return self.store[game_id]


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

    async def _get(self, game_id: str) -> GameState:
        game_state_str = await self._conn.get(game_id)

        if game_state_str is None:
            raise GameNotFoundError(f"No game with id {game_id}")

        return GameState.from_string(game_state_str)

    async def _set(self, game_id: str, game_state: GameState) -> GameState:
        await self._conn.set(game_id, game_state.json(), expire=3600)
        return await self._get(game_id)


def get_store(url: str) -> GameStore:
    parsed_url = urlparse(url)
    if parsed_url.scheme == "redis":
        return RedisGameStore(url)
    elif parsed_url.scheme == "memory":
        return MemoryGameStore()
    raise ValueError(f"Unsupported url: {url}")
