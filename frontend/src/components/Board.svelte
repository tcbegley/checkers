<script>
  import Square from "./Square.svelte";

  var indices = [...Array(64).keys()];

  function isDark(i) {
    var col = i % 8;
    var row = (i - col) / 8;
    return (row + col) % 2 == 0;
  }
</script>

<style>
  .board {
    margin: 0 auto;
    width: 640px;
    height: 640px;
    display: grid;
    grid-template-columns: repeat(8, 1fr);
    border: 1px solid #444444;
  }
</style>

<div class="board">
  {#each indices as idx}
    <Square dark="{isDark(idx)}" />
  {/each}
</div>
