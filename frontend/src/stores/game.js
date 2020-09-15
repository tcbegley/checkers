import { writable } from "svelte/store";

function inBounds(r, c) {
  return r >= 0 && r < 8 && c >= 0 && c < 8;
}

function getOccupant(r, c, counters) {
  return counters.find(counter => counter.row === r && counter.col === c);
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
        validMoves: [],
        king: false,
        active: false,
      });
      id += 1;

      initialCounters.push({
        id,
        row: 7 - i,
        col: 7 - j - (i % 2),
        player: 0,
        validMoves: [],
        king: false,
        active: false,
      });
      id += 1;
    }
  }

  initialCounters.forEach(counter => {
    counter.validMoves = computeMovesForCounter(counter, initialCounters, 0);
  });

  return initialCounters;
}

function computeMovesForCounter(
  counter,
  counters,
  player,
  captureOnly = false
) {
  if (player !== counter.player) return [];

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
  } else if (player) {
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
          occupant.player !== player &&
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

function updateAllValidMoves(counters, movedPiece, player) {
  // if player has moved a counter on this move the must continue to move it
  if (movedPiece === null) {
    return counters.map(c => ({
      ...c,
      validMoves: computeMovesForCounter(c, counters, player),
    }));
  }
  return counters.map(c =>
    c.id === movedPiece
      ? { ...c, validMoves: computeMovesForCounter(c, counters, player, true) }
      : { ...c, validMoves: [] }
  );
}

function createGameStore() {
  const { subscribe, update } = writable({
    move: 0,
    player: 0,
    counters: createInitialCounters(),
  });

  const moveTo = (startRow, startCol, endRow, endCol) => game => {
    let { counters, player } = game;

    let chosenCounter = counters.find(
      c => c.row === startRow && c.col === startCol
    );

    let move = chosenCounter.validMoves.find(
      ({ row, col }) => row === endRow && col === endCol
    );
    if (!move) {
      // move is not valid, do nothing.
      // TODO: throw error instead.
      return game;
    }

    counters = counters.map(c =>
      c.row === startRow && c.col === startCol
        ? {
            ...c,
            row: endRow,
            col: endCol,
            active: false,
            king: c.king || endRow == 0 || endRow == 7,
          }
        : c
    );

    if (move.captures) {
      counters = counters.filter(c => !(c.id === move.captures));
      counters = updateAllValidMoves(counters, chosenCounter.id, player);
    }

    if (
      !move.captures ||
      !counters.find(c => c.id === chosenCounter.id).validMoves.length
    ) {
      player = 1 - player;
      counters = updateAllValidMoves(counters, null, player);
    }

    return {
      ...game,
      player,
      counters: counters,
    };
  };

  return {
    subscribe,
    setActive: (row, col) =>
      update(game => ({
        ...game,
        counters: game.counters.map(c =>
          c.row === row && c.col === col
            ? { ...c, active: !c.active }
            : { ...c, active: false }
        ),
      })),
    moveTo: (startRow, startCol, endRow, endCol) =>
      update(moveTo(startRow, startCol, endRow, endCol)),
    moveActiveTo: (row, col) =>
      update(game => {
        let activeCounter = game.counters.find(c => c.active);
        return moveTo(activeCounter.row, activeCounter.col, row, col)(game);
      }),
  };
}

export const game = createGameStore();
