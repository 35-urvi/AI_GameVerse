from fastapi import APIRouter

from app.schemas.eight_puzzle import (
    EightPuzzleSolveRequest,
    EightPuzzleSolveResponse,
)

from app.services.games.eight_puzzle.engine import (
    solve_puzzle,
)


router = APIRouter(
    prefix="/api/games/8-puzzle",
    tags=["8-Puzzle"],
)


@router.post(
    "/solve",
    response_model=EightPuzzleSolveResponse,
)
def solve_eight_puzzle(
    request: EightPuzzleSolveRequest,
):

    initial_state = tuple(
        request.board
    )

    solution = solve_puzzle(
        initial_state
    )

    return EightPuzzleSolveResponse(
        solution=[
            list(state)
            for state in solution
        ],
        moves=max(
            len(solution) - 1,
            0,
        ),
    )