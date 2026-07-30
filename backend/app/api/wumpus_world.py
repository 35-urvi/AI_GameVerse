from fastapi import APIRouter

from app.schemas.wumpus_world import (
    WumpusMoveRequest,
)

from app.schemas.wumpus_world import (
    WumpusAIMoveResponse,
)

from app.services.games.wumpus_world.engine import (
    create_game,
    move_player,
    reset_game,
    get_ai_solution,
    get_public_game_state,
)


router = APIRouter(
    prefix="/api/games/wumpus-world",
    tags=["Wumpus World"],
)


# Temporary in-memory game
current_game = None


@router.post("/new")
def new_game():

    global current_game

    current_game = create_game()

    return {
        "message": "New Wumpus World created",
        "game":
            get_public_game_state(
                current_game
            ),
    }


@router.post("/reset")
def reset_wumpus_game():

    global current_game

    if current_game is None:
        current_game = create_game()
    else:
        current_game = reset_game(current_game)

    return {
        "message": "Wumpus World game reset",
        "game":
            get_public_game_state(
                current_game
            ),
    }


@router.post("/move")
def move(
    request: WumpusMoveRequest,
):

    global current_game


    if current_game is None:

        current_game = create_game()


    try:

        game_state = move_player(
            current_game,
            request.direction,
        )

        return {
            "game":
                game_state,
        }

    except ValueError as error:

        return {
            "error":
                str(error),
        }

@router.post(
    "/solve",
    response_model=WumpusAIMoveResponse,
)
@router.get(
    "/solve",
    response_model=WumpusAIMoveResponse,
)
def solve_wumpus_world():

    global current_game

    if current_game is None:
        current_game = create_game()

    moves = get_ai_solution(current_game)

    return {"moves": moves}