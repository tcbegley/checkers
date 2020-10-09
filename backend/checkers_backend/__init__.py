import os

import fastapi
from fastapi.middleware.cors import CORSMiddleware

from checkers_backend.models import GameState
from checkers_backend.store import get_store

try:
    import importlib.metadata as importlib_metadata
except ModuleNotFoundError:
    import importlib_metadata  # type: ignore

__version__ = importlib_metadata.version(__name__)

BROADCAST_URL = os.environ.get("BROADCAST_URL", "memory://")
STORE = get_store(BROADCAST_URL)

app = fastapi.FastAPI(
    on_startup=[STORE.connect], on_shutdown=[STORE.disconnect]
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/game/{game_id}", response_model=GameState)
async def get_game(game_id: int) -> GameState:
    return await STORE.get(game_id)


@app.post("/game/{game_id}")
async def post_game(game_id: int):
    await STORE.create_game(game_id)
    return {"game_id": game_id}
