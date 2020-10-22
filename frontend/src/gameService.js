import { board, gameID, players } from "./stores";

let moveActiveTo, socket;

gameID.subscribe(async id => {
  if (id) {
    socket = new WebSocket(`ws://${process.env.CHECKERS_BACKEND}/ws/${id}`);
    socket.onmessage = event => {
      const data = JSON.parse(event.data);
      if (data.action === "updateGameState") {
        board.setBoardState(data.game_state.board_state);
        players.setPlayers(
          data.game_state.local_play,
          data.game_state.player_count
        );
      }
    };
  }
});

const moveTo = (startRow, startCol, endRow, endCol) => {
  if (socket) {
    socket.send(
      JSON.stringify({
        action: "moveTo",
        start_row: startRow,
        start_col: startCol,
        end_row: endRow,
        end_col: endCol,
      })
    );
  }
};

board.subscribe(board => {
  if (board.counters) {
    let activeCounter = board.counters.find(c => c.active);
    moveActiveTo = (row, col) =>
      moveTo(activeCounter.row, activeCounter.col, row, col);
  }
});

const createGame = async () => {
  let res = await fetch(`http://${process.env.CHECKERS_BACKEND}/game`, {
    method: "POST",
  });
  res = await res.json();
  gameID.set(res.id);
  board.setBoardState(res.game_state.board_state);
};

const joinGame = async () => {
  if (socket) {
    waitForConnection(() =>
      socket.send(JSON.stringify({ action: "joinGame" }))
    );
  }
};

const playLocally = () => {
  if (socket) {
    waitForConnection(() =>
      socket.send(JSON.stringify({ action: "playLocally" }))
    );
  }
};

const waitForConnection = (callback, interval = 50) => {
  if (socket.readyState === 1) {
    return callback();
  }
  setTimeout(() => waitForConnection(callback, interval), interval);
};

export { createGame, joinGame, moveActiveTo, playLocally };
