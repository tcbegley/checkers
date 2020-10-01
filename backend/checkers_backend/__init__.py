from typing import List

import fastapi
from fastapi.middleware.cors import CORSMiddleware

try:
    import importlib.metadata as importlib_metadata
except ModuleNotFoundError:
    import importlib_metadata

__version__ = importlib_metadata.version(__name__)

app = fastapi.FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/players")
def players() -> List[str]:
    return ["Alpha-Beta", "MCTS"]
