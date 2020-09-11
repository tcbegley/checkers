<script>
  import Board from "./components/Board.svelte";
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
  <Board />
</main>
