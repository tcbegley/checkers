import { writable } from "svelte/store";

function createGameStore() {
  let { subscribe, update } = writable({ player: 0 });

  return {
    subscribe,
    togglePlayer: () => update(game => ({ ...game, player: 1 - game.player })),
  };
}

export const game = createGameStore();
