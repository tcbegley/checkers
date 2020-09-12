import { writable } from "svelte/store";

let initialCounters = [];

for (let i = 0; i < 3; i++) {
  for (let j = 0; j < 8; j += 2) {
    initialCounters.push({
      row: i,
      col: j + (i % 2),
      dark: true,
      active: false,
    });
    initialCounters.push({
      row: 7 - i,
      col: 7 - j - (i % 2),
      dark: false,
      active: false,
    });
  }
}

export const counters = writable(initialCounters);
