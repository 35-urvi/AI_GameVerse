from fastapi import APIRouter

from app.schemas.block_world import (
    BlockMoveRequest,
    BlockGameState,
    BlockSolveResponse,
)

from app.services.games.block_world.engine import (
    create_game,
    reset_game,
    generate_random_problem,
    move_block,
    goal_stack_planning,
)

router = APIRouter(
    prefix="/api/games/block-world",
    tags=["Block World"],
)

current_game = None


@router.post("/new")
def new_game():
    global current_game
    current_game = generate_random_problem()
    return {
        "message": "New Block World problem created",
        "game": current_game,
    }


@router.post("/reset")
def reset():
    global current_game
    if current_game is None:
        current_game = create_game()
    else:
        current_game = reset_game(current_game)

    return {
        "message": "Block World game reset",
        "game": current_game,
    }


@router.post("/move")
def move(request: BlockMoveRequest):
    global current_game
    if current_game is None:
        current_game = create_game()

    try:
        updated_game = move_block(
            current_game,
            request.action,
            request.block,
            request.target,
        )
        return {"game": updated_game}
    except ValueError as error:
        return {"error": str(error)}


@router.post("/solve", response_model=BlockSolveResponse)
@router.get("/solve", response_model=BlockSolveResponse)
def solve_block_world():
    global current_game
    if current_game is None:
        current_game = create_game()

    moves, solution_states, explanation = goal_stack_planning(
        current_game["stacks"],
        current_game["goal_stacks"],
    )

    return {
        "moves": moves,
        "solution_states": solution_states,
        "explanation": explanation,
    }
