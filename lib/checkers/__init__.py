from collections import namedtuple

from pydantic import BaseModel


class Counter(BaseModel):
    row: int
    col: int
    player: int
    king: bool


def in_bounds(row, col):
    return 0 <= row < 8 and 0 <= col < 8


def valid_moves_for_counter(counter, counters, player=0, capture_only=False):
    if player != counter.player:
        return []

    valid = []

    if counter.king:
        moves = [[1, 1], [1, -1], [-1, 1], [-1, -1]]
    elif player == 1:
        moves = [[1, 1], [1, -1]]
    else:
        moves = [[-1, 1], [-1, -1]]

    counter_lookup = {(c.row, c.col): c for c in counters}

    for dr, dc in moves:
        if in_bounds(row + dr, col + dc):
            pass
