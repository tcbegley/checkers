from typing import Callable, List, Optional, Sequence, Tuple, TypeVar

from checkers_backend.models import Counter, Move

T = TypeVar("T", Counter, Move)


def in_bounds(row: int, col: int) -> bool:
    return 0 <= row < 8 and 0 <= col < 8


def find(seq: Sequence[T], match: Callable[[T], bool]) -> T:
    for item in seq:
        if match(item):
            return item
    raise ValueError("No matching item in sequence")


def get_occupant(
    row: int, col: int, counters: List[Counter]
) -> Optional[Counter]:
    try:
        return find(
            counters, lambda counter: counter.row == row and counter.col == col
        )
    except ValueError:
        return None


def valid_moves_for_counter(
    counter: Counter,
    counters: List[Counter],
    player: int,
    capture_only: bool = False,
) -> List[Move]:
    if player != counter.player:
        return []

    valid: List[Move] = []
    row = counter.row
    col = counter.col

    if counter.king:
        moves = [
            [1, 1],
            [1, -1],
            [-1, 1],
            [-1, -1],
        ]
    elif player == 2:
        moves = [
            [1, 1],
            [1, -1],
        ]
    else:
        moves = [
            [-1, 1],
            [-1, -1],
        ]

    for dr, dc in moves:
        if in_bounds(row + dr, col + dc):
            try:
                occupant = get_occupant(row + dr, col + dc, counters)
            except ValueError:
                occupant = None

            if occupant is not None:
                if (
                    occupant.player != player
                    and in_bounds(row + 2 * dr, col + 2 * dc)
                    and get_occupant(row + 2 * dr, col + 2 * dc, counters)
                    is None
                ):
                    valid.append(
                        Move(
                            row=row + 2 * dr,
                            col=col + 2 * dc,
                            captures=occupant.id,
                        )
                    )
            else:
                valid.append(
                    Move(row=row + dr, col=col + dc, captures=None)
                )

    if capture_only:
        return [move for move in valid if move.captures is not None]
    return valid


def create_initial_counters() -> List[Counter]:
    initial_counters: List[Counter] = []
    id_ = 1

    for i in range(3):
        for j in range(0, 8, 2):
            initial_counters.append(
                Counter(
                    id=id_,
                    row=i,
                    col=j + (i % 2),
                    player=2,
                    king=False,
                    valid_moves=[],
                )
            )
            id_ += 1

            initial_counters.append(
                Counter(
                    id=id_,
                    row=7 - i,
                    col=7 - j - (i % 2),
                    player=1,
                    king=False,
                    valid_moves=[],
                )
            )
            id_ += 1

    for counter in initial_counters:
        counter.valid_moves = valid_moves_for_counter(
            counter, initial_counters, 1
        )

    return initial_counters


def update_all_valid_moves(
    counters: List[Counter], moved_piece: Optional[int], player: int
) -> List[Counter]:
    if moved_piece is None:
        return [
            Counter.from_counter_with_moves(
                c, valid_moves_for_counter(c, counters, player)
            )
            for c in counters
        ]

    return [
        Counter.from_counter_with_moves(
            c,
            valid_moves_for_counter(c, counters, player, True)
            if c.id == moved_piece
            else [],
        )
        for c in counters
    ]


def move_to(
    start_row: int,
    start_col: int,
    end_row: int,
    end_col: int,
    counters: List[Counter],
    player: int,
) -> Tuple[int, List[Counter]]:
    try:
        chosen_counter: Counter = find(
            counters, lambda c: c.row == start_row and c.col == start_col
        )
    except ValueError:
        raise ValueError(f"No counter at row: {start_row}, col: {start_col}")

    try:
        move: Move = find(
            chosen_counter.valid_moves,
            lambda m: m.row == end_row and m.col == end_col,
        )
    except ValueError:
        raise ValueError(
            f"Move ({start_row},{start_col}) -> ({end_row},{end_col}) invalid"
        )

    counters = [
        Counter(
            id=c.id,
            row=end_row,
            col=end_col,
            player=c.player,
            king=c.king or end_row == 0 or end_row == 7,
            valid_moves=c.valid_moves,
        )
        if c.row == start_row and c.col == start_col
        else c
        for c in counters
    ]

    if move.captures is not None:
        counters = [c for c in counters if c.id != move.captures]
        counters = update_all_valid_moves(counters, chosen_counter.id, player)

    # get chosen counter with updated moves
    chosen_counter = find(counters, lambda c: c.id == chosen_counter.id)

    if move.captures is None or len(chosen_counter.valid_moves) == 0:
        # toggle player 1 -> 2 or 2 -> 1 and vice versa
        player = 3 - player
        counters = update_all_valid_moves(counters, None, player)

    return player, counters
