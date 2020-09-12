import { counters } from "./counters";

let countersList;

counters.subscribe(value => {
  countersList = value;
});

function squareFree(r, c) {
  if (r < 0 || r >= 8 || c < 0 || c >= 8) return false;
  return !countersList.find(counter => counter.row === r && counter.col === c);
}

function validMoves(r, c, dark) {
  let valid = [];
  if (dark) {
    if (squareFree(r + 1, c + 1)) valid.push([r + 1, c + 1]);
    if (squareFree(r + 1, c - 1)) valid.push([r + 1, c - 1]);
  } else {
    if (squareFree(r - 1, c + 1)) valid.push([r - 1, c + 1]);
    if (squareFree(r - 1, c - 1)) valid.push([r - 1, c - 1]);
  }
  return valid;
}

export { validMoves };
