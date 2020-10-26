# Checkers

![Tests](https://github.com/tcbegley/checkers/workflows/Tests/badge.svg)
![Lint](https://github.com/tcbegley/checkers/workflows/Lint/badge.svg)

A game of Checkers I built to learn about [Svelte][svelte], websockets, and
[Docker][docker].

Run the app with

```sh
docker-compose up
```

then navigate to [localhost][localhost].

## Run manually without docker

You'll need Python and Node installed. Install dependencies

```sh
# install backend dependencies
pip install poetry
cd backend
poetry install

# start the backend
uvicorn checkers_backend:app

# install frontend dependencies
cd frontend
npm install

# start the frontend
npm start
```

This will use a memory backend to store the state of each game so it is
important that you do not run the backend with more than one worker otherwise
bad things might happen.

To allow multiple workers, the app can use Redis to store the state of ongoing
games. If you have a Redis server running locally, set the `BROADCAST_URL`
environment variable appropriately before running the backend.

```sh
BROADCAST_URL=redis://localhost:6379 uvicorn checkers_backend:app
```

[svelte]: https://svelte.dev/
[docker]: https://www.docker.com/
[localhost]: http://localhost
