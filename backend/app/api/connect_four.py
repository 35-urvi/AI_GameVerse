from fastapi import APIRouter

from app.schemas.connect_four import (
    ConnectFourMoveRequest,
    ConnectFourMoveResponse,
)

from app.services.games.connect_four.engine import (
    get_best_move,
    get_random_move,
)


router = APIRouter(
    prefix="/api/games/connect-four",
    tags=["Connect Four"],
)


@router.post(
    "/ai-move",
    response_model=ConnectFourMoveResponse,
)
def calculate_ai_move(
    request: ConnectFourMoveRequest,
):

    if request.difficulty == "easy":

        column = get_random_move(
            request.board
        )

    else:

        column = get_best_move(
            request.board
        )


    return ConnectFourMoveResponse(
        column=column
    )