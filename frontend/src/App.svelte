<script>
  import Board from "./components/Board.svelte";
  import CreateGame from "./components/CreateGame.svelte";
  import { gameID } from "./stores";
</script>

<style>
  main {
    margin: 0 1em;
  }

  .container {
    text-align: center;
    margin: 0 auto;
    display: flex;
    justify-content: center;
    height: 100vh;
    box-sizing: border-box;
    flex-wrap: wrap;
  }

  .game-board {
    flex: 1 0 100%;
    max-width: 100vh;
    width: 100%;
    margin: 1em;
  }

  /* .game-controls {
    flex: 0 0 min(80%, 500px);
    text-align: left;
    margin: 1em;
  }

  @media (min-width: 1150px) {
    .game-controls {
      flex-basis: auto;
      width: 250px;
      margin-left: 1.5em;
    }
  } */
</style>

<main>
  <div class="container">
    {#if $gameID}
      <div class="game-board">
        <Board />
      </div>
    {:else}
      <CreateGame />
    {/if}
  </div>
</main>
