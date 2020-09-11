<script>
  import Counter from "./Counter.svelte";

  let w;
  let rows = [...Array(8).keys()];
  let cols = [...Array(8).keys()];

  let counters = [];

  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 8; j += 2) {
      counters.push({ row: i, col: j + (i % 2), dark: true, active: false });
      counters.push({
        row: 7 - i,
        col: 7 - j - (i % 2),
        dark: false,
        active: false,
      });
    }
  }

  function handleClick(c) {
    c.active = true;
    console.log(c);
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

  .square {
    background-color: #f0f0f0;
  }

  .square.dark {
    background-color: #777777;
  }
</style>

<div class="board-container" style="height: {w}px">
  {#each rows as r}
    <div class="row" bind:clientWidth="{w}" style="height: {w / 8}px">
      {#each cols as c}
        <div class="square {(r + c) % 2 === 0 ? 'dark' : ''}"></div>
      {/each}
    </div>
  {/each}
  {#each counters as c}
    <Counter
      counter="{c}"
      w="{w / 8}"
      handleClick="{() => {
        c.active = !c.active;
      }}"
    />
  {/each}
</div>
