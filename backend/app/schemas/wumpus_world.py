from typing import Literal

from pydantic import BaseModel


CellType = Literal[
    "unknown",
    "safe",
    "visited",
    "wumpus",
    "pit",
    "gold",
]


class WumpusPosition(BaseModel):
    row: int
    column: int


class WumpusGameState(BaseModel):
    size: int

    player: WumpusPosition

    visited: list[list[bool]]

    safe_cells: list[list[bool]]

    breeze: list[list[bool]]

    stench: list[list[bool]]

    glitter: list[list[bool]]

    has_gold: bool = False

    game_over: bool = False

    won: bool = False

    score: int = 0

class WumpusMoveRequest(BaseModel):
    direction: Literal[
        "up",
        "down",
        "left",
        "right",
    ]

class WumpusAIMoveResponse(
    BaseModel
):
    moves: list[str]