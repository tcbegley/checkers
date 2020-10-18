import json
from typing import List, Optional

from pydantic import BaseModel, constr


class Token(BaseModel):
    access_token: str
    token_type: str


class Move(BaseModel):
    row: int
    col: int
    captures: Optional[int]


class Counter(BaseModel):
    id: int
    row: int
    col: int
    player: int
    king: bool
    valid_moves: List[Move]

    @classmethod
    def from_counter_with_moves(
        cls, counter: "Counter", moves: List[Move]
    ) -> "Counter":
        return cls(
            id=counter.id,
            row=counter.row,
            col=counter.col,
            player=counter.player,
            king=counter.king,
            valid_moves=moves,
        )

    def clear_valid_moves(self):
        self.valid_moves = []
        return self


class BoardState(BaseModel):
    player: int
    history: List[List[Counter]]


class GameState(BaseModel):
    board_state: BoardState
    local_play: bool
    player_count: int

    @classmethod
    def from_string(cls, string: str) -> "GameState":
        return cls(**json.loads(string))


class NewGame(BaseModel):
    id: constr(regex=r"^[a-z]{3}-[a-z]{4}-[a-z]{3}$")  # type: ignore  # noqa
    game_state: GameState
