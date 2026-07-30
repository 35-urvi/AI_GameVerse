from typing import Optional
from pydantic import BaseModel


class BlockMoveRequest(BaseModel):
    action: str  # "pickup", "putdown", "stack", "unstack"
    block: str
    target: Optional[str] = None  # target block or table stack index


class BlockGameState(BaseModel):
    stacks: list[list[str]]
    holding: Optional[str] = None
    goal_stacks: list[list[str]]
    moves_count: int = 0
    is_solved: bool = False


class BlockSolveResponse(BaseModel):
    moves: list[str]
    solution_states: list[dict]
    explanation: list[str]
