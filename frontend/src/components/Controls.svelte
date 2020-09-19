<style>
  label {
    font-weight: 600;
    font-size: 1.2em;
    margin-bottom: 0.5em;
  }

  select {
    display: inline-block;
    width: 100%;
    height: calc(1.5em + 0.75rem + 2px);
    padding: 0.375rem 1.75rem 0.375rem 0.75rem;
    font-size: 1rem;
    font-weight: 400;
    line-height: 1.5;
    color: #495057;
    vertical-align: middle;
    background: #fff
      url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='4' height='5' viewBox='0 0 4 5'%3e%3cpath fill='%23343a40' d='M2 0L0 2h4zm0 5L0 3h4z'/%3e%3c/svg%3e")
      no-repeat right 0.75rem center/8px 10px;
    border: 1px solid #ced4da;
    border-radius: 0.25rem;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    margin-bottom: 1em;
  }

  button {
    display: block;
    font-weight: 400;
    text-align: center;
    border: 1px solid rgb(193, 42, 47);
    padding: 0.375rem 0.75rem;
    font-size: 1rem;
    line-height: 1.5;
    border-radius: 0.25rem;
    transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out,
      border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
    color: #fff;
    background-color: rgb(193, 42, 47);
    cursor: pointer;
    width: 100%;
    margin-top: 1em;
  }

  button:hover {
    background-color: rgb(160, 20, 20);
    border-color: rgb(160, 20, 20);
  }

  button:disabled {
    color: #999;
  }

  button:not(:disabled):active {
    background-color: #ddd;
  }

  button:focus {
    border-color: #666;
  }
</style>

<label for="player-1-select">Player 1</label>
<select><option value="human">Human</option></select>
<label for="player-2-select">Player 2</label>
<select><option value="human">Human</option></select>
<button>Start</button>
