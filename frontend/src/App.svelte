<script>
  import Board from "./components/Board.svelte";
  import { player } from "./stores/player";
</script>

<style>
  main {
    text-align: center;
    padding: 1em;
    max-width: 800px;
    margin: 0 auto;
  }

  h1 {
    color: #ff3e00;
    text-transform: uppercase;
    font-size: 4em;
    font-weight: 100;
  }
</style>

<main>
  <h1>Checkers!</h1>
  <p>It's Player {$player + 1}'s turn</p>
  <Board />
</main>
