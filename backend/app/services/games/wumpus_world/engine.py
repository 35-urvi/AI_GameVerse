import random

from collections import deque

BOARD_SIZE = 4


def create_empty_matrix(
    value: bool = False,
) -> list[list[bool]]:
    return [
        [value for _ in range(BOARD_SIZE)]
        for _ in range(BOARD_SIZE)
    ]


def is_valid_position(
    row: int,
    column: int,
) -> bool:
    return (
        0 <= row < BOARD_SIZE
        and 0 <= column < BOARD_SIZE
    )


def get_adjacent_positions(
    row: int,
    column: int,
) -> list[tuple[int, int]]:

    directions = [
        (-1, 0),
        (1, 0),
        (0, -1),
        (0, 1),
    ]

    positions = []

    for row_change, column_change in directions:

        new_row = row + row_change

        new_column = (
            column + column_change
        )

        if is_valid_position(
            new_row,
            new_column,
        ):
            positions.append(
                (
                    new_row,
                    new_column,
                )
            )

    return positions


def create_game() -> dict:
    """
    Create a new Wumpus World.

    The actual Wumpus, pit and gold
    positions are kept on the backend.
    """
    while True:
        player = (
            3,
            0,
        )

        available_positions = [
            (
                row,
                column,
            )
            for row in range(
                BOARD_SIZE
            )
            for column in range(
                BOARD_SIZE
            )
            if (
                row,
                column,
            )
            != player
        ]

        wumpus = random.choice(
            available_positions
        )

        available_positions.remove(
            wumpus
        )

        gold = random.choice(
            available_positions
        )

        available_positions.remove(
            gold
        )

        pits = random.sample(
            available_positions,
            3,
        )

        breeze = create_empty_matrix()

        stench = create_empty_matrix()

        glitter = create_empty_matrix()

        for row in range(
            BOARD_SIZE
        ):
            for column in range(
                BOARD_SIZE
            ):

                adjacent_positions = (
                    get_adjacent_positions(
                        row,
                        column,
                    )
                )

                if wumpus in adjacent_positions:
                    stench[row][column] = True

                if any(
                    pit in adjacent_positions
                    for pit in pits
                ):
                    breeze[row][column] = True

                if (
                    row,
                    column,
                ) == gold:
                    glitter[row][column] = True

        if not has_starting_percept(pits,wumpus,):
            visited = create_empty_matrix()
            visited[3][0] = True
            safe_cells = create_empty_matrix()
            safe_cells[3][0] = True
            return {
                "size": BOARD_SIZE,

                "player": player,

                "wumpus": wumpus,

                "gold": gold,

                "pits": pits,

                "visited": visited,

                "safe_cells": safe_cells,

                "breeze": breeze,

                "stench": stench,

                "glitter": glitter,

                "has_gold": False,

                "game_over": False,

                "won": False,

                "score": 0,

                "game_over_reason": None,
            }

def reset_game(game: dict) -> dict:
    """
    Reset the current Wumpus World game state while preserving
    the world layout (wumpus, gold, pits).
    """
    visited = create_empty_matrix()
    visited[3][0] = True
    safe_cells = create_empty_matrix()
    safe_cells[3][0] = True

    game["player"] = (3, 0)
    game["visited"] = visited
    game["safe_cells"] = safe_cells
    game["has_gold"] = False
    game["game_over"] = False
    game["won"] = False
    game["score"] = 0
    game["game_over_reason"] = None

    return game

def get_public_game_state(
    game: dict,
) -> dict:
    """
    Return only information that the
    player/AI is allowed to know.
    """

    row, column = game["player"]

    return {
        "size": game["size"],

        "player": {
            "row": row,
            "column": column,
        },

        "visited": game["visited"],

        "safe_cells": game["safe_cells"],

        "breeze": game["breeze"],

        "stench": game["stench"],

        "glitter": game["glitter"],

        "has_gold": game["has_gold"],

        "game_over": game["game_over"],

        "won": game["won"],

        "score": game["score"],

        "game_over_reason": game["game_over_reason"],
    }


def move_player(
    game: dict,
    direction: str,
) -> dict:
    """
    Move the player in the requested direction.
    """

    if game["game_over"]:
        return get_public_game_state(
            game
        )

    row, column = game["player"]


    directions = {
        "up": (
            -1,
            0,
        ),

        "down": (
            1,
            0,
        ),

        "left": (
            0,
            -1,
        ),

        "right": (
            0,
            1,
        ),
    }


    if direction not in directions:
        raise ValueError(
            "Invalid direction"
        )


    row_change, column_change = (
        directions[direction]
    )


    new_row = (
        row + row_change
    )

    new_column = (
        column + column_change
    )


    # Prevent moving outside board
    if not is_valid_position(
        new_row,
        new_column,
    ):
        return get_public_game_state(
            game
        )


    game["player"] = (
        new_row,
        new_column,
    )


    game["visited"][
        new_row
    ][
        new_column
    ] = True


    game["safe_cells"][
        new_row
    ][
        new_column
    ] = True


    game["score"] -= 1


    current_position = (
        new_row,
        new_column,
    )


    # Check Wumpus
    if (
        current_position
        == game["wumpus"]
    ):

        game["game_over"] = True
        game["game_over_reason"] = ("You entered the Wumpus cell!")
        game["score"] -= 100

        return get_public_game_state(
            game
        )


    # Check Pit
    if (
        current_position
        in game["pits"]
    ):

        game["game_over"] = True
        game["game_over_reason"] = ("You fell into a pit!")
        game["score"] -= 100

        return get_public_game_state(
            game
        )


    # Check Gold
    if (
        current_position
        == game["gold"]
    ):

        game["has_gold"] = True
        game["game_over_reason"] = ("You found the gold! Return to starting position (3,0) to escape.")
        game["score"] += 100


    # If player has gold and
    # returns to starting position
    if (
        game["has_gold"]
        and current_position
        == (
            3,
            0,
        )
    ):

        game["game_over"] = True

        game["won"] = True

        game["game_over_reason"] = ("You found the gold and safely returned to the starting position!")

        game["score"] += 100


    return get_public_game_state(
        game
    )

def has_starting_percept(
    pits: set[tuple[int, int]],
    wumpus: tuple[int, int],
) -> bool:

    start_row, start_col = (3,0)

    neighbors = [
        (start_row - 1, start_col),
        (start_row + 1, start_col),
        (start_row, start_col - 1),
        (start_row, start_col + 1),
    ]

    valid_neighbors = [
        position
        for position in neighbors
        if is_valid_position(
            position[0],
            position[1],
        )
    ]

    has_breeze = any(
        position in pits
        for position in valid_neighbors
    )

    has_stench = (
        wumpus in valid_neighbors
    )

    return (
        has_breeze
        or has_stench
    )

def get_ai_solution(
    game: dict,
) -> list[str]:
    """
    Find a safe solution for the current
    Wumpus World using BFS.

    The AI must:
    1. Reach the gold.
    2. Return to the starting position.

    The backend knows the hidden world,
    so dangerous cells are avoided.
    """

    start = game["player"]

    gold = game["gold"]

    wumpus = game["wumpus"]

    pits = set(
        game["pits"]
    )

    dangerous_cells = (
        pits
        | {
            wumpus
        }
    )

    safe_cells = set()

    for row in range(
        BOARD_SIZE
    ):
        for column in range(
            BOARD_SIZE
        ):

            position = (
                row,
                column,
            )

            if (
                position
                not in dangerous_cells
            ):
                safe_cells.add(
                    position
                )

    directions = {
        "up": (
            -1,
            0,
        ),

        "down": (
            1,
            0,
        ),

        "left": (
            0,
            -1,
        ),

        "right": (
            0,
            1,
        ),
    }

    def find_path(
        source: tuple[int, int],
        target: tuple[int, int],
    ) -> list[str] | None:

        if source == target:
            return []

        queue = deque()

        queue.append(
            (
                source,
                [],
            )
        )

        visited = {
            source
        }

        while queue:

            current_position, path = (
                queue.popleft()
            )

            if (
                current_position
                == target
            ):
                return path

            row, column = (
                current_position
            )

            for (
                direction,
                (
                    row_change,
                    column_change,
                ),
            ) in directions.items():

                new_position = (
                    row + row_change,
                    column + column_change,
                )

                if not is_valid_position(
                    new_position[0],
                    new_position[1],
                ):
                    continue

                if (
                    new_position
                    not in safe_cells
                ):
                    continue

                if (
                    new_position
                    in visited
                ):
                    continue

                visited.add(
                    new_position
                )

                queue.append(
                    (
                        new_position,
                        path
                        + [
                            direction
                        ],
                    )
                )

        return None

    if game.get("has_gold", False):
        path_to_start = find_path(start, (3, 0))
        return path_to_start if path_to_start is not None else []

    # Path from current position
    # to gold
    path_to_gold = find_path(
        start,
        gold,
    )

    if path_to_gold is None:
        return []

    # Path from gold back to start
    path_to_start = find_path(
        gold,
        (
            3,
            0,
        ),
    )

    if path_to_start is None:
        return path_to_gold

    return (
        path_to_gold
        + path_to_start
    )