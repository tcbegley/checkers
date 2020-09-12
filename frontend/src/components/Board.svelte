<script>
  import Counter from "./Counter.svelte";
  import Square from "./Square.svelte";
  import { counters } from "../counters";
  import { validMoves } from "../moves";

  let w;
  let rows = [...Array(8).keys()];
  let cols = [...Array(8).keys()];

  let highlightedSquares = [];

  function handleClick(c) {
    counters.update((counterList) =>
      counterList.map((counter) =>
        counter.row === c.row && counter.col === c.col
          ? { ...counter, active: !counter.active }
          : { ...counter, active: false }
      )
    );
    highlightedSquares = validMoves(c.row, c.col, c.dark);
  }
</script>

<style>
  .board-container {
    margin: 0 auto;
    width: 100%;
    max-width: 640px;
    min-width: 80px;
    position: relative;
    border: 1px solid #444444;
  }
  .row {
    top: 0;
    left: 0;
    width: 100%;
    display: grid;
    grid-template-columns: repeat(8, 1fr);
  }
</style>

<div class="board-container" style="height: {w}px">
  {#each rows as r}
    <div class="row" bind:clientWidth="{w}" style="height: {w / 8}px">
      {#each cols as c}
        <Square
          dark="{(r + c) % 2 === 0}"
          highlight="{highlightedSquares.find(([row, col]) => row === r && col === c)}"
        />
      {/each}
    </div>
  {/each}
  {#each $counters as c}
    <Counter counter="{c}" w="{w / 8}" handleClick="{() => handleClick(c)}" />
  {/each}
</div>
