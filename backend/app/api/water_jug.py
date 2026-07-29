from fastapi import APIRouter

from app.schemas.water_jug import (
    WaterJugSolveRequest,
    WaterJugSolveResponse,
    WaterJugState,
)

from app.services.games.water_jug.engine import (
    solve_water_jug,
)


router = APIRouter(
    prefix="/api/games/water-jug",
    tags=["Water Jug"],
)


@router.post(
    "/solve",
    response_model=WaterJugSolveResponse,
)
def solve_water_jug_problem(
    request: WaterJugSolveRequest,
):

    solution, moves = (
        solve_water_jug(
            request.jug_a_capacity,
            request.jug_b_capacity,
            request.target,
        )
    )


    return WaterJugSolveResponse(
        solution=[
            WaterJugState(
                jug_a=state[0],
                jug_b=state[1],
            )
            for state in solution
        ],
        moves=moves,
    )