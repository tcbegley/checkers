import pytest
from checkers_backend.counters import in_bounds, find, get_occupant
from checkers_backend.models import Counter


def test_bounds_check():
    out = [-10, -1, 8, 10, 100]
    for row in range(8):
        for col in range(8):
            assert in_bounds(row, col)

        for col in out:
            assert not in_bounds(row, col)
            assert not in_bounds(col, row)


def test_find():
    seq = [1, 2, 3, "apple"]

    assert find(seq, lambda x: x > 1) == 2
    assert find(seq, lambda x: isinstance(x, str)) == "apple"

    with pytest.raises(ValueError):
        find(seq, lambda x: isinstance(x, list))


def test_get_occupant():
    counters = [
        Counter(id=i, row=i, col=i, player=1, king=False, valid_moves=[])
        for i in range(1, 9)
    ]

    assert get_occupant(4, 4, counters).id == 4
    assert get_occupant(3, 4, counters) is None
