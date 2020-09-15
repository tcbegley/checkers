<script>
  import { derived } from "svelte/store";
  import Counter from "./Counter.svelte";
  import Square from "./Square.svelte";
  import { game } from "../stores/game";

  let w;
  let rows = [...Array(8).keys()];
  let cols = [...Array(8).keys()];

  const availableMoves = derived(game, $game => {
    // only one counter can be active at a time, so find is ok.
    let active = $game.counters.find(c => c.active);
    return active ? active.validMoves : [];
  });
</script>

<style>
  .board-container {
    margin: 0 auto;
    width: 100%;
    max-width: calc(100vh - 5.2em);
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

  p {
    height: 1.2em;
    vertical-align: middle;
  }
</style>

<div class="board-container" style="height: {w}px">
  {#each rows as r}
    <div class="row" bind:clientWidth="{w}" style="height: {w / 8}px">
      {#each cols as c}
        <Square
          dark="{(r + c) % 2 === 0}"
          highlight="{$availableMoves.find(({ row, col }) => row === r && col === c)}"
          handleClick="{() => {
            game.moveActiveTo(r, c);
          }}"
        />
      {/each}
    </div>
  {/each}
  {#each $game.counters as c (c.id)}
    <Counter
      counter="{c}"
      w="{w / 8}"
      handleClick="{() => game.setActive(c.row, c.col)}"
    />
  {/each}
</div>
<p>It's Player {$game.player + 1}'s turn</p>
