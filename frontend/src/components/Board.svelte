<script>
  let indices = [...Array(64).keys()];
  let w;

  function isDark(i) {
    let col = i % 8;
    let row = (i - col) / 8;
    return (row + col) % 2 == 0;
  }
</script>

<style>
  .board {
    margin: 0 auto;
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-columns: repeat(8, 1fr);
    border: 1px solid #444444;
  }

  .square {
    background-color: #f0f0f0;
  }

  .square.dark {
    background-color: #777777;
  }
</style>

<div
  class="board"
  bind:clientWidth="{w}"
  style="max-width: 640px; height: {w}px"
>
  {#each indices as idx}
    <div class="square {isDark(idx) ? 'dark' : ''}"></div>
  {/each}
</div>
