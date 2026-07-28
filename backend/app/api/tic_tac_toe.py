from fastapi import APIRouter

from app.schemas.tic_tac_toe import (
    AIMoveRequest,
    AIMoveResponse,
)

from app.services.games.tic_tac_toe.engine import (
    get_best_move,
    get_random_move,
)


router = APIRouter(
    prefix="/api/games/tic-tac-toe",
    tags=["Tic-Tac-Toe"],
)


@router.post(
    "/ai-move",
    response_model=AIMoveResponse,
)
def calculate_ai_move(
    request: AIMoveRequest,
):
    if request.difficulty == "easy":
        move = get_random_move(
            request.board
        )

    else:
        move = get_best_move(
            request.board
        )

    return AIMoveResponse(
        move=move
    )