from pydantic import BaseModel, Field


class EightPuzzleSolveRequest(BaseModel):
    board: list[int] = Field(
        ...,
        min_length=9,
        max_length=9,
    )


class EightPuzzleSolveResponse(BaseModel):
    solution: list[list[int]]
    moves: int