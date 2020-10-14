import { writable } from "svelte/store";

let socket;
let moveActiveTo;

function createGameStore() {
  const { subscribe, set, update } = writable({
    time: 0,
    player: 0,
    counters: null,
    history: [],
  });

  const setGameState = ({ player, history }) => {
    const time = history.length - 1;
    set({
      time,
      player,
      history,
      counters: history[time],
    });
  };

  // const moveTo = (startRow, startCol, endRow, endCol) => game => {
  //   let { counters, player, history, time } = game;

  //   if (time < history.length - 1) {
  //     counters = history[time];
  //     history = history.slice(0, time + 1);
  //   }

  //   let chosenCounter = counters.find(
  //     c => c.row === startRow && c.col === startCol
  //   );

  //   let move = chosenCounter.validMoves.find(
  //     ({ row, col }) => row === endRow && col === endCol
  //   );
  //   if (!move) {
  //     // move is not valid, do nothing.
  //     // TODO: throw error instead.
  //     return game;
  //   }

  //   counters = counters.map(c =>
  //     c.row === startRow && c.col === startCol
  //       ? {
  //           ...c,
  //           row: endRow,
  //           col: endCol,
  //           active: false,
  //           king: c.king || endRow == 0 || endRow == 7,
  //         }
  //       : c
  //   );

  //   if (move.captures) {
  //     counters = counters.filter(c => !(c.id === move.captures));
  //     counters = updateAllValidMoves(counters, chosenCounter.id, player);
  //   }

  //   if (
  //     !move.captures ||
  //     !counters.find(c => c.id === chosenCounter.id).validMoves.length
  //   ) {
  //     player = 1 - player;
  //     time += 1;
  //     counters = updateAllValidMoves(counters, null, player);
  //     history.push(counters);
  //   } else {
  //     time = history.length - 1;
  //   }

  //   return { time, player, counters, history };
  // };

  // const stepForward = game => {
  //   let { time, history, player } = game;

  //   if (time < history.length - 1) {
  //     time += 1;
  //     return {
  //       ...game,
  //       active: { row: null, col: null },
  //       time,
  //       player: 1 - player,
  //       counters: history[time],
  //     };
  //   }

  //   return game;
  // };

  // const stepBackward = game => {
  //   let { time, history, player } = game;

  //   if (time > 0) {
  //     time -= 1;
  //     return {
  //       ...game,
  //       active: { row: null, col: null },
  //       time,
  //       player: 1 - player,
  //       counters: history[time],
  //     };
  //   }

  //   return game;
  // };

  return {
    subscribe,
    setGameState,
    setActive: (row, col) =>
      update(game => ({
        ...game,
        counters: game.counters.map(c =>
          c.row === row && c.col === col
            ? { ...c, active: !c.active }
            : { ...c, active: false }
        ),
      })),
    // moveTo: (startRow, startCol, endRow, endCol) =>
    //   update(moveTo(startRow, startCol, endRow, endCol)),
    previous: () => update(stepBackward),
    next: () => update(stepForward),
  };
}

const gameID = writable(null);
const game = createGameStore();

gameID.subscribe(id => {
  if (id) {
    socket = new WebSocket(`ws://${process.env.CHECKERS_BACKEND}/ws/${id}`);
    socket.onmessage = event => {
      const { game_state } = JSON.parse(event.data);
      game.setGameState(game_state);
    };
  }
});

const moveTo = (startRow, startCol, endRow, endCol) => {
  socket.send(
    JSON.stringify({
      action: "moveTo",
      data: {
        start_row: startRow,
        start_col: startCol,
        end_row: endRow,
        end_col: endCol,
      },
    })
  );
};

game.subscribe(game => {
  if (game.counters) {
    let activeCounter = game.counters.find(c => c.active);
    moveActiveTo = (row, col) =>
      moveTo(activeCounter.row, activeCounter.col, row, col);
  }
});

export { game, gameID, moveTo, moveActiveTo };
