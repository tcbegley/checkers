import { writable } from "svelte/store";

function squareFree(r, c, countersList) {
  if (r < 0 || r >= 8 || c < 0 || c >= 8) return false;
  return !countersList.find(counter => counter.row === r && counter.col === c);
}

function computeValidMoves(counter, countersList) {
  let valid = [];
  let { row, col, dark } = counter;
  if (dark) {
    if (squareFree(row + 1, col + 1, countersList))
      valid.push([row + 1, col + 1]);
    if (squareFree(row + 1, col - 1, countersList))
      valid.push([row + 1, col - 1]);
  } else {
    if (squareFree(row - 1, col + 1, countersList))
      valid.push([row - 1, col + 1]);
    if (squareFree(row - 1, col - 1, countersList))
      valid.push([row - 1, col - 1]);
  }
  return valid;
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
        dark: true,
        active: false,
        validMoves: [],
      });
      id += 1;

      initialCounters.push({
        id,
        row: 7 - i,
        col: 7 - j - (i % 2),
        dark: false,
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
        if (
          !(
            activeCounter &&
            activeCounter.validMoves.find(([r, c]) => r === row && c === col)
          )
        )
          return counters;

        // move and set inactive
        counters = counters.map(c =>
          c.id === activeCounter.id ? { ...c, row, col, active: false } : c
        );
        // update validMoves for all counters
        counters.forEach(c => (c.validMoves = computeValidMoves(c, counters)));

        return counters;
      }),
  };
}

export const counters = createCounterStore();
