<script>
  import classNames from "classnames";

  export let dark, highlight;
</script>

<style>
  .square {
    background-color: #f0f0f0;
  }

  .square.dark {
    background-color: #777777;
  }

  .square.highlight {
    box-shadow: inset 0px 0px 14px 3px rgba(193, 42, 47, 0.75);
  }
</style>

<div
  class="{classNames('square', dark && 'dark', highlight && 'highlight')}"
></div>
