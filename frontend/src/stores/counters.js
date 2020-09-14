import { get, writable } from "svelte/store";
import { player } from "./player";

function inBounds(r, c) {
  return r >= 0 && r < 8 && c >= 0 && c < 8;
}

function getOccupant(r, c, counters) {
  return counters.find(counter => counter.row === r && counter.col === c);
}

function computeValidMoves(counter, counters, captureOnly = false) {
  let p = get(player);
  if (p !== counter.player) return [];

  let valid = [];
  let moves;
  let { row, col } = counter;

  if (counter.king) {
    moves = [
      [1, 1],
      [1, -1],
      [-1, 1],
      [-1, -1],
    ];
  } else if (p) {
    moves = [
      [1, 1],
      [1, -1],
    ];
  } else {
    moves = [
      [-1, 1],
      [-1, -1],
    ];
  }
  moves.forEach(([dr, dc]) => {
    if (inBounds(row + dr, col + dc)) {
      let occupant = getOccupant(row + dr, col + dc, counters);
      if (occupant) {
        if (
          occupant.player !== p &&
          inBounds(row + 2 * dr, col + 2 * dc) &&
          !getOccupant(row + 2 * dr, col + 2 * dc, counters)
        ) {
          valid.push({
            row: row + 2 * dr,
            col: col + 2 * dc,
            captures: occupant.id,
          });
        }
      } else {
        valid.push({ row: row + dr, col: col + dc, captures: null });
      }
    }
  });
  return captureOnly ? valid.filter(mv => mv.captures !== null) : valid;
}

function createInitialCounters() {
  let initialCounters = [];
  let id = 1;

  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 8; j += 2) {
      initialCounters.push({
        id,
        row: i,
        col: j + (i % 2),
        player: 1,
        active: false,
        validMoves: [],
        king: false,
      });
      id += 1;

      initialCounters.push({
        id,
        row: 7 - i,
        col: 7 - j - (i % 2),
        player: 0,
        active: false,
        validMoves: [],
        king: false,
      });
      id += 1;
    }
  }

  initialCounters.forEach(counter => {
    counter.validMoves = computeValidMoves(counter, initialCounters);
  });

  return initialCounters;
}

function updateAllValidMoves(counters, movedPiece) {
  if (movedPiece === null) {
    return counters.map(c => ({
      ...c,
      validMoves: computeValidMoves(c, counters),
    }));
  }
  return counters.map(c =>
    c.id === movedPiece
      ? { ...c, validMoves: computeValidMoves(c, counters, true) }
      : { ...c, validMoves: [] }
  );
}

function createCounterStore() {
  const { subscribe, update } = writable(createInitialCounters());

  return {
    subscribe,
    setActive: (row, col) =>
      update(counters =>
        counters.map(c =>
          c.row === row && c.col === col
            ? { ...c, active: !c.active }
            : { ...c, active: false }
        )
      ),
    moveActiveTo: (row, col) =>
      update(counters => {
        let activeCounter = counters.find(c => c.active);

        if (!activeCounter) return counters;

        let move = activeCounter.validMoves.find(
          ({ row: r, col: c }) => r === row && c === col
        );
        if (!move) {
          return counters;
        }

        // move and set inactive
        counters = counters.map(c =>
          c.id === activeCounter.id
            ? // if a piece is moved *to* row 0 or 7 then the piece must either
              // already be a king, or be promoted to a king
              {
                ...c,
                row,
                col,
                active: false,
                king: c.king || row == 0 || row == 7,
              }
            : c
        );
        if (move.captures) {
          counters = counters.filter(c => !(c.id === move.captures));
          counters = updateAllValidMoves(counters, activeCounter.id);
        }

        if (
          !move.captures ||
          !counters.find(c => c.id === activeCounter.id).validMoves.length
        ) {
          player.toggle();
          counters = updateAllValidMoves(counters, null);
        }

        return counters;
      }),
  };
}

export const counters = createCounterStore();
