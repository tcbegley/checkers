<script>
  import { createGame, joinGame } from "../gameService";
  import { gameID, players } from "../stores";
  import Button from "./Button.svelte";

  let value;
  const idPattern = /^[a-z]{3}-[a-z]{4}-[a-z]{3}$/;

  $: joinEnabled = idPattern.test(value || "");
</script>

<div class="container">
  <h1>Checkers</h1>
  <p>
    Start a new game then invite a friend or join an existing game with a code!
  </p>
  <input bind:value placeholder="Enter code to join game" />
  <div class="button-container">
    <Button
      handleClick="{async () => {
        gameID.set(value);
        players.setPlayer(2);
        joinGame();
      }}"
      disabled="{!joinEnabled}"
    >
      Join game
    </Button>
    <Button handleClick="{createGame}">New game</Button>
  </div>
</div>

<style>
  h1 {
    color: #ff3e00;
    text-transform: uppercase;
    font-size: 4em;
    font-weight: 100;
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
    font-size: 1.1rem;
    font-family: monospace;
    text-align: center;
  }

  .container {
    max-width: 400px;
  }

  .button-container {
    display: flex;
    margin: 1em -0.5em;
  }
</style>
