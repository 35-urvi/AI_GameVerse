from typing import Literal, Optional

from pydantic import BaseModel, Field


Difficulty = Literal[
    "easy",
    "medium",
    "hard",
]


class AIMoveRequest(BaseModel):
    board: list[Optional[str]] = Field(
        ...,
        min_length=9,
        max_length=9,
    )

    difficulty: Difficulty = "hard"


class AIMoveResponse(BaseModel):
    move: Optional[int]