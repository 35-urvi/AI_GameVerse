import heapq

from typing import Optional


# ==============================
# Constants
# ==============================

GOAL_STATE = (
    1, 2, 3,
    4, 5, 6,
    7, 8, 0,
)


# ==============================
# Manhattan Distance Heuristic
# ==============================

def manhattan_distance(
    state: tuple[int, ...],
) -> int:

    distance = 0

    for index, tile in enumerate(state):

        # 0 represents empty space
        if tile == 0:
            continue

        current_row = index // 3
        current_column = index % 3

        goal_index = tile - 1

        goal_row = goal_index // 3
        goal_column = goal_index % 3

        distance += abs(
            current_row - goal_row
        )

        distance += abs(
            current_column - goal_column
        )

    return distance


# ==============================
# Generate Neighbours
# ==============================

def get_neighbors(
    state: tuple[int, ...],
) -> list[tuple[int, ...]]:

    neighbors = []

    empty_index = state.index(0)

    row = empty_index // 3
    column = empty_index % 3

    possible_moves = [
        (-1, 0),  # Up
        (1, 0),   # Down
        (0, -1),  # Left
        (0, 1),   # Right
    ]

    for row_change, column_change in possible_moves:

        new_row = row + row_change
        new_column = column + column_change

        if not (
            0 <= new_row < 3
            and
            0 <= new_column < 3
        ):
            continue

        new_index = (
            new_row * 3
            + new_column
        )

        new_state = list(state)

        # Swap empty space with tile
        (
            new_state[empty_index],
            new_state[new_index],
        ) = (
            new_state[new_index],
            new_state[empty_index],
        )

        neighbors.append(
            tuple(new_state)
        )

    return neighbors


# ==============================
# Check Solvability
# ==============================

def is_solvable(
    state: tuple[int, ...],
) -> bool:

    numbers = [
        tile
        for tile in state
        if tile != 0
    ]

    inversions = 0

    for i in range(
        len(numbers)
    ):

        for j in range(
            i + 1,
            len(numbers)
        ):

            if numbers[i] > numbers[j]:
                inversions += 1

    return inversions % 2 == 0


# ==============================
# Reconstruct Solution
# ==============================

def reconstruct_path(
    came_from: dict[
        tuple[int, ...],
        Optional[tuple[int, ...]],
    ],
    current: tuple[int, ...],
) -> list[tuple[int, ...]]:

    path = [current]

    while came_from[current] is not None:

        current = came_from[current]

        path.append(current)

    path.reverse()

    return path


# ==============================
# A* Search
# ==============================

def solve_puzzle(
    initial_state: tuple[int, ...],
) -> list[tuple[int, ...]]:

    # Already solved
    if initial_state == GOAL_STATE:
        return [initial_state]

    # Check whether puzzle is solvable
    if not is_solvable(initial_state):
        return []

    # Priority Queue
    open_set = []

    # g(n) = cost from start
    g_score = {
        initial_state: 0,
    }

    # f(n) = g(n) + h(n)
    f_score = (
        manhattan_distance(
            initial_state
        )
    )

    heapq.heappush(
        open_set,
        (
            f_score,
            0,
            initial_state,
        ),
    )

    came_from = {
        initial_state: None,
    }

    visited = set()

    counter = 0

    while open_set:

        (
            _,
            _,
            current,
        ) = heapq.heappop(
            open_set
        )

        if current in visited:
            continue

        visited.add(current)

        # Goal reached
        if current == GOAL_STATE:

            return reconstruct_path(
                came_from,
                current,
            )

        for neighbor in get_neighbors(
            current
        ):

            if neighbor in visited:
                continue

            tentative_g_score = (
                g_score[current] + 1
            )

            if (
                neighbor not in g_score
                or
                tentative_g_score
                < g_score[neighbor]
            ):

                came_from[
                    neighbor
                ] = current

                g_score[
                    neighbor
                ] = tentative_g_score

                h_score = (
                    manhattan_distance(
                        neighbor
                    )
                )

                f_score = (
                    tentative_g_score
                    + h_score
                )

                counter += 1

                heapq.heappush(
                    open_set,
                    (
                        f_score,
                        counter,
                        neighbor,
                    ),
                )

    # No solution found
    return []