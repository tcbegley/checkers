import { get, writable } from "svelte/store";
import { player } from "./player";

function inBounds(r, c) {
  return r >= 0 && r < 8 && c >= 0 && c < 8;
}

function getOccupant(r, c, countersList) {
  return countersList.find(counter => counter.row === r && counter.col === c);
}

function computeValidMoves(counter, countersList, captureOnly = false) {
  let p = get(player);
  if (p !== counter.player) return [];

  let valid = [];
  let moves;
  let { row, col } = counter;

  if (p) {
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
      let occupant = getOccupant(row + dr, col + dc, countersList);
      if (occupant) {
        if (
          occupant.player !== p &&
          inBounds(row + 2 * dr, col + 2 * dc) &&
          !getOccupant(row + 2 * dr, col + 2 * dc, countersList)
        ) {
          valid.push({
            row: row + 2 * dr,
            col: col + 2 * dc,
            captures: occupant.id,
          });
        }
      } else {
        valid.push({ row: row + dr, col: col + dc });
      }
    }
  });
  return captureOnly ? valid.filter(mv => mv.captures !== undefined) : valid;
}

function createInitialCounters() {
  let initialCounters = [];
  let id = 0;

  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 8; j += 2) {
      initialCounters.push({
        id,
        row: i,
        col: j + (i % 2),
        player: 1,
        active: false,
        validMoves: [],
      });
      id += 1;

      initialCounters.push({
        id,
        row: 7 - i,
        col: 7 - j - (i % 2),
        player: 0,
        active: false,
        validMoves: [],
      });
      id += 1;
    }
  }

  initialCounters.forEach(counter => {
    counter.validMoves = computeValidMoves(counter, initialCounters);
  });

  return initialCounters;
}

function createCounterStore() {
  const { subscribe, update } = writable(createInitialCounters());
  let movedPiece = null;

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
          c.id === activeCounter.id ? { ...c, row, col, active: false } : c
        );
        if (move.captures) {
          counters = counters.filter(c => !(c.id === move.captures));
          movedPiece = activeCounter.id;
        } else {
          // toggle player
          player.toggle();
          movedPiece = null;
        }

        // update validMoves for all counters
        counters.forEach(c => {
          if (movedPiece === c.id) {
            c.validMoves = computeValidMoves(c, counters, true);
          } else if (movedPiece === null) {
            c.validMoves = computeValidMoves(c, counters);
          } else {
            c.validMoves = [];
          }
        });

        if (movedPiece && !counters.find(c => c.id === movedPiece).length) {
          player.toggle();
          movedPiece = null;
          counters.forEach(
            c => (c.validMoves = computeValidMoves(c, counters))
          );
        }

        return counters;
      }),
  };
}

export const counters = createCounterStore();
