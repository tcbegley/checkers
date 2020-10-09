import json
from typing import List

from pydantic import BaseModel


class Move(BaseModel):
    row: int
    col: int
    captures: bool


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


class GameState(BaseModel):
    player: int
    history: List[List[Counter]]

    @classmethod
    def from_string(cls, string: str) -> "GameState":
        game_state = json.loads(string)
        game_state["history"] = [
            [Counter(**c) for c in cs] for cs in game_state["history"]
        ]
        return cls(**game_state)
