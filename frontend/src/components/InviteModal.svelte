<script>
  import { fade } from "svelte/transition";

  import { joinGame, playLocally } from "../gameService";
  import { gameID } from "../stores";
  import Button from "./Button.svelte";
  import Loader from "./Loader.svelte";

  let waitForFriend = false;
  let showCopyMessage = false;

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText($gameID);
    showCopyMessage = true;
    setTimeout(() => {
      showCopyMessage = false;
    }, 2000);
  };
</script>

<div class="backdrop">
  <div class="modal">
    {#if waitForFriend}
      <h1>Waiting for friend to join...</h1>
      <p>Click to copy the invite code then send it to a friend</p>
      <div class="invite-code" on:click="{copyToClipboard}">{$gameID}</div>
      {#if showCopyMessage}
        <div in:fade out:fade class="copy-message">
          Code copied to clipboard
        </div>
      {/if}
      <Loader />
    {:else}
      <h1>Choose an opponent</h1>
      <p>
        You can play locally or generate an invite code and play a friend over
        the internet.
      </p>
      <div class="button-container">
        <Button handleClick="{playLocally}">Play locally</Button>
        <Button handleClick="{() => (waitForFriend = true)}">
          Invite friend
        </Button>
      </div>
    {/if}
  </div>
</div>

<style>
  .backdrop {
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.3);
    z-index: 1050;
    backdrop-filter: blur(5px);
  }

  .modal {
    padding: 1em 2em;
    background: white;
    border-radius: 0.25em;
    width: 400px;
    margin: 4em auto;
  }

  .button-container {
    display: flex;
    margin: 1em -0.5em;
  }

  .invite-code {
    font-size: 2em;
    font-family: monospace;
    cursor: pointer;
    position: relative;
  }

  .copy-message {
    position: absolute;
    margin: 0.25em auto;
    width: 400px;
    font-size: small;
    color: green;
  }
</style>
