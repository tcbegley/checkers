<script>
  import classNames from "classnames";
  import { derived } from "svelte/store";

  import { moveActiveTo } from "../gameService";
  import { board, players } from "../stores";
  import Counter from "./Counter.svelte";
  import InviteModal from "./InviteModal.svelte";
  import Square from "./Square.svelte";

  let w;
  let rows = [...Array(8).keys()];
  let cols = [...Array(8).keys()];

  $: previousClasses = classNames(
    "btn",
    "prev",
    $board.time <= 0 && "disabled"
  );
  $: nextClasses = classNames(
    "btn",
    "next",
    $board.time >= $board.history.length - 1 && "disabled"
  );
  $: allPlayersJoined =
    ($players.localPlay && $players.playerCount === 1) ||
    (!$players.localPlay && $players.playerCount === 2);

  $: allowMoves = $players.localPlay || $players.player === $board.player;

  const availableMoves = derived(board, $board => {
    // only one counter can be active at a time, so find is ok.
    let active = $board.counters.find(
      c => c.row === $board.active.row && c.col === $board.active.col
    );
    return active ? active.valid_moves : [];
  });
</script>

{#if !allPlayersJoined}
  <InviteModal />
{/if}
<div class="board-container" style="height: {w}px">
  {#each rows as r}
    <div class="row" bind:clientWidth="{w}" style="height: {w / 8}px">
      {#each cols as c}
        <Square
          dark="{(r + c) % 2 === 0}"
          highlight="{$availableMoves.find(({ row, col }) => row === r && col === c)}"
          handleClick="{() => {
            moveActiveTo(r, c);
          }}"
        />
      {/each}
    </div>
  {/each}
  {#each $board.counters as c (c.id)}
    <Counter
      allowMoves="{allowMoves}"
      counter="{c}"
      w="{w / 8}"
      handleClick="{() => board.setActive(c.row, c.col)}"
    />
  {/each}
</div>
<div class="board-footer">
  <span>It's Player {$board.player}'s turn</span>
  <button on:click="{board.previous}" class="{previousClasses}">❮</button>
  <button on:click="{board.next}" class="{nextClasses}">❯</button>
</div>

<style>
  .board-container {
    margin: 0 auto;
    width: 100%;
    max-width: calc(100vh - 5.5em);
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

  .board-footer {
    display: flex;
    margin: 1em auto 0;
    height: 2.5em;
    max-width: calc(100vh - 5.5em);
  }

  span {
    align-self: center;
    height: 1.2em;
    font-size: 1.2em;
  }

  .btn {
    display: block;
    border-radius: 0.25rem;
    font-weight: 400;
    text-align: center;
    border-width: 0;
    transition: color 0.1s ease-in-out, background-color 0.1s ease-in-out,
      border-color 0.1s ease-in-out, box-shadow 0.1s ease-in-out;
    cursor: pointer;
    background-color: #d1d1d1;
    font-size: 2em;
    color: #444444;
    padding: 0 1em;
  }

  .btn:not(.disabled):hover {
    background-color: #c0c0c0;
  }
  .btn.prev {
    margin-left: auto;
  }

  .btn.next {
    margin-left: 0.5em;
  }

  .btn.disabled {
    color: #999999;
    cursor: default;
  }
</style>
