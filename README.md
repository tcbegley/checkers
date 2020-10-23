# Checkers

![Tests](https://github.com/tcbegley/checkers/workflows/Tests/badge.svg) ![Lint](https://github.com/tcbegley/checkers/workflows/Lint/badge.svg)

A game of Checkers I built to learn about [Svelte][svelte], websockets, and
[Docker][docker].

Run the app with

```sh
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up --build
```

or in development mode (mounts the source code into the container so that
changes are reflected) with

```sh
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up --build
```

In either case navigate to [localhost][localhost] to view the app.

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

[svelte]: https://svelte.dev/
[docker]: https://www.docker.com/
[localhost]: http://localhost
