<script>
  import { derived } from "svelte/store";
  import Counter from "./Counter.svelte";
  import Square from "./Square.svelte";
  import { counters } from "../stores/counters";

  let w;
  let rows = [...Array(8).keys()];
  let cols = [...Array(8).keys()];

  const highlightedSquares = derived(counters, ($counters) => {
    // only one counter can be active at a time, so find is ok.
    let active = $counters.find((c) => c.active);
    return active ? active.validMoves : [];
  });
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
          highlight="{$highlightedSquares.find(([row, col]) => row === r && col === c)}"
          handleClick="{() => {
            counters.moveActiveTo(r, c);
          }}"
        />
      {/each}
    </div>
  {/each}
  {#each $counters as c (c.id)}
    <Counter
      counter="{c}"
      w="{w / 8}"
      moveable="{c.validMoves.length > 0}"
      handleClick="{() => {
        if (c.validMoves.length > 0) counters.setActive(c.row, c.col);
      }}"
    />
  {/each}
</div>
