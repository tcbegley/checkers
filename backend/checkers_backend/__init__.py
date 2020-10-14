import json
import os

from broadcaster import Broadcast
from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
# from jose import jwt
from starlette.concurrency import run_until_first_complete

from checkers_backend.models import NewGame  #, Token
from checkers_backend.store import get_store
from checkers_backend.utils import generate_id

try:
    import importlib.metadata as importlib_metadata
except ModuleNotFoundError:
    import importlib_metadata  # type: ignore

__version__ = importlib_metadata.version(__name__)

BROADCAST_URL = os.environ.get("BROADCAST_URL", "memory://")
STORE = get_store(BROADCAST_URL)
BROADCASTER = Broadcast(BROADCAST_URL)

app = FastAPI(
    on_startup=[STORE.connect, BROADCASTER.connect],
    on_shutdown=[STORE.disconnect, BROADCASTER.disconnect],
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/game", response_model=NewGame)
async def post_game() -> NewGame:
    game_id = generate_id()
    game_state = await STORE.create_game(game_id)
    return NewGame(id=game_id, game_state=game_state)


@app.get("/game/{game_id}", response_model=NewGame)
async def get_game(game_id: str) -> NewGame:
    game_state = await STORE.get(game_id)
    return NewGame(id=game_id, game_state=game_state)


@app.websocket("/ws/{game_id}")
async def game_ws(websocket: WebSocket, game_id: str):
    await websocket.accept()
    await run_until_first_complete(
        (game_ws_receiver, {"websocket": websocket, "game_id": game_id}),
        (game_ws_sender, {"websocket": websocket, "game_id": game_id}),
    )


async def game_ws_receiver(websocket: WebSocket, game_id: str):
    async for data in websocket.iter_json():
        if data["action"] == "moveTo":
            game_state = await STORE.move_to(game_id, **data["data"])
            await BROADCASTER.publish(
                channel=game_id,
                message=json.dumps(
                    {
                        "action": "updateCounters",
                        "game_state": game_state.dict(),
                    }
                ),
            )


async def game_ws_sender(websocket: WebSocket, game_id: str):
    async with BROADCASTER.subscribe(channel=game_id) as subscriber:
        async for event in subscriber:
            await websocket.send_text(event.message)
