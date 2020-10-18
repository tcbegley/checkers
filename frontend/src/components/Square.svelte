<script>
  import classNames from "classnames";

  export let dark, highlight, handleClick;
</script>

<div
  class="{classNames('square', dark && 'dark', highlight && 'highlight')}"
  on:click="{() => {
    if (highlight) handleClick();
  }}"
></div>

<style>
  .square {
    background-color: #f0f0f0;
  }

  .square.dark {
    background-color: #777777;
  }

  .square.highlight {
    box-shadow: inset 0px 0px 14px 3px rgba(193, 42, 47, 0.75);
    cursor: pointer;
  }
</style>
