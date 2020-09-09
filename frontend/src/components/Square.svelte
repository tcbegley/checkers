<script>
  export let dark;
</script>

<style>
  .square {
    width: 80px;
    height: 80px;
    background-color: #f0f0f0;
  }

  .square.dark {
    background-color: #777777;
  }
</style>

<div class="{dark ? 'square dark' : 'square'}"></div>
