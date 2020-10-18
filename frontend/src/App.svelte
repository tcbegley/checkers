<script>
  import Board from "./components/Board.svelte";
  import CreateGame from "./components/CreateGame.svelte";
  import { board } from "./stores";
</script>

<main>
  <div class="container">
    {#if $board.counters}
      <div class="game-board">
        <Board />
      </div>
    {:else}
      <CreateGame />
    {/if}
  </div>
</main>

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
</style>
