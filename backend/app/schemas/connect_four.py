from typing import Optional

from pydantic import BaseModel, Field


class ConnectFourMoveRequest(BaseModel):
    board: list[list[int]] = Field(
        ...,
        min_length=6,
        max_length=6,
    )

    difficulty: str = "hard"


class ConnectFourMoveResponse(BaseModel):
    column: Optional[int]