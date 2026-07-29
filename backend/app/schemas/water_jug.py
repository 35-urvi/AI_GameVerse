from pydantic import BaseModel


class WaterJugSolveRequest(BaseModel):
    jug_a_capacity: int
    jug_b_capacity: int
    target: int


class WaterJugState(BaseModel):
    jug_a: int
    jug_b: int


class WaterJugSolveResponse(BaseModel):
    solution: list[WaterJugState]
    moves: list[str]