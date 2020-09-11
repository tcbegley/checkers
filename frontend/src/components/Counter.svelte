<script>
  export let x, y, w;
</script>

<style>
  .container {
    position: absolute;
  }

  .outer {
    position: absolute;
    background-color: #eeaa55;
    border-radius: 50%;
    width: 60%;
    height: 60%;
    margin-left: 20%;
    margin-top: 20%;
  }

  .inner {
    position: absolute;
    background-color: #eebb55;
    border-radius: 50%;
    width: 50%;
    height: 50%;
    margin-top: 25%;
    margin-left: 25%;
  }
</style>

<div
  class="container"
  style="top: {y}px; left: {x}px; width: {w}px; height: {w}px;"
>
  <div class="outer">
    <div class="inner"></div>
  </div>
</div>
