<script>
  import { game, gameID } from "../stores";

  let value;
  const idPattern = /[a-z]{3}-[a-z]{4}-[a-z]{3}/;

  $: joinEnabled = idPattern.test(value || "");

  const handleNewGame = async () => {
    let res = await fetch(`http://${process.env.CHECKERS_BACKEND}/game`, {
      method: "POST",
    });
    res = await res.json();
    gameID.set(res.id);
    game.setGameState(res.game_state);
  };

  const handleJoin = async () => {
    let res = await fetch(
      `http://${process.env.CHECKERS_BACKEND}/game/${value}`
    );
    res = await res.json();
    gameID.set(res.id);
    game.setGameState(res.game_state);
  };
</script>

<style>
  h1 {
    color: #ff3e00;
    text-transform: uppercase;
    font-size: 4em;
    font-weight: 100;
  }

  button {
    display: block;
    font-weight: 400;
    text-align: center;
    border: 1px solid rgb(193, 42, 47);
    padding: 0.375rem 0.75rem;
    font-size: 1rem;
    line-height: 1.5;
    border-radius: 0.25rem;
    transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out,
      border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
    color: #fff;
    background-color: rgb(193, 42, 47);
    cursor: pointer;
    width: 100%;
    margin: 0 0.5em;
  }

  button:hover:not(:disabled) {
    background-color: rgb(160, 20, 20);
    border-color: rgb(160, 20, 20);
  }

  button:disabled {
    color: #ddd;
    background-color: rgb(200, 110, 110);
    border-color: rgb(200, 110, 110);
    cursor: default;
  }

  button:not(:disabled):active {
    background-color: #ddd;
  }

  button:focus {
    border-color: #666;
  }

  input {
    display: block;
    line-height: 1.5;
    border-radius: 0.25rem;
    width: 100%;
    margin-top: 1em;
    border: 1px solid rgb(193, 42, 47);
    box-sizing: border-box;
    padding: 0.375rem 0.75rem;
    font-size: 1rem;
  }

  .container {
    max-width: 400px;
  }

  .button-container {
    display: flex;
    margin: 1em -0.5em;
  }
</style>

<div class="container">
  <h1>Checkers</h1>
  <p>
    Start a new game then invite a friend or join an existing game with a code!
  </p>
  <input bind:value placeholder="Enter code to join game" />
  <div class="button-container">
    <button on:click="{handleJoin}" disabled="{!joinEnabled}">
      Join game
    </button>
    <button on:click="{handleNewGame}">New game</button>
  </div>
</div>
