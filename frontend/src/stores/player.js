import { writable } from "svelte/store";

function createPlayerStore() {
  let { subscribe, update } = writable(0);

  return { subscribe, toggle: () => update(n => 1 - n) };
}

export const player = createPlayerStore();
