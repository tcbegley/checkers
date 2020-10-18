import { writable } from "svelte/store";

function createBoardStore() {
  const { subscribe, update } = writable({
    time: 0,
    player: 0,
    counters: null,
    history: [],
    active: { row: null, col: null },
  });

  const setBoardState = ({ player, history }) => {
    update(board => {
      const time = history.length - 1;
      return { ...board, time, player, history, counters: history[time] };
    });
  };

  const stepForward = board => {
    let { time, history, player } = board;

    if (time < history.length - 1) {
      time += 1;
      return {
        ...board,
        active: { row: null, col: null },
        time,
        player: 1 - player,
        counters: history[time],
      };
    }

    return board;
  };

  const stepBackward = board => {
    let { time, history, player } = board;

    if (time > 0) {
      time -= 1;
      return {
        ...board,
        active: { row: null, col: null },
        time,
        player: 1 - player,
        counters: history[time],
      };
    }

    return board;
  };

  return {
    subscribe,
    setBoardState,
    previous: () => update(stepBackward),
    next: () => update(stepForward),
    setActive: (row, col) =>
      update(board => ({
        ...board,
        counters: board.counters.map(c =>
          c.row === row && c.col === col
            ? { ...c, active: !c.active }
            : { ...c, active: false }
        ),
        active: { row, col },
      })),
  };
}

const createPlayerStore = () => {
  const { subscribe, update } = writable({
    localPlay: false,
    playerCount: 1,
    player: 1,
  });

  return {
    subscribe,
    setPlayer: player => update(state => ({ ...state, player })),
    setPlayers: (localPlay, playerCount) =>
      update(state => ({ ...state, playerCount, localPlay })),
  };
};

export const gameID = writable(null);
export const players = createPlayerStore();
export const board = createBoardStore();
