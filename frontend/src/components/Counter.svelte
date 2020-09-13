<script>
  import classNames from "classnames";
  import Crown from "./Crown.svelte";

  export let counter, w, handleClick;

  $: outerClasses = classNames(
    "outer",
    counter.player && "dark",
    counter.active && "active",
    counter.validMoves.length > 0 && "moveable"
  );
</script>

<style>
  .container {
    position: absolute;
  }

  .outer {
    position: absolute;
    background-color: #cccccc;
    border-radius: 50%;
    width: 60%;
    height: 60%;
    margin-left: 20%;
    margin-top: 20%;
  }

  .outer.active {
    box-shadow: 0px 0px 14px 3px rgba(193, 42, 47, 0.75);
  }

  .outer.dark {
    background-color: #222222;
  }

  .inner {
    position: absolute;
    background-color: #dddddd;
    color: #cccccc;
    border-radius: 50%;
    width: 80%;
    height: 80%;
    margin-top: 10%;
    margin-left: 10%;
  }

  .dark .inner {
    background-color: #2a2a2a;
  }

  .outer.moveable {
    cursor: pointer;
  }
</style>

<div
  class="container"
  style="top: {counter.row * w}px; left: {counter.col * w}px; width: {w}px; height: {w}px;"
  on:click="{() => {
    if (counter.validMoves.length > 0) handleClick();
  }}"
>
  <div class="{outerClasses}">
    <div class="inner">
      {#if counter.king}
        <Crown
          fill="{counter.player ? '#111111' : '#bbbbbb'}"
          style="height:70%;margin-top:15%"
        />
      {/if}
    </div>
  </div>
</div>
