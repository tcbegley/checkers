<script>
  import classNames from "classnames";

  export let counter, w, moveable, handleClick;
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
  on:click="{handleClick}"
>
  <div
    class="{classNames('outer', counter.dark && 'dark', counter.active && 'active', moveable && 'moveable')}"
  >
    <div class="inner"></div>
  </div>
</div>
