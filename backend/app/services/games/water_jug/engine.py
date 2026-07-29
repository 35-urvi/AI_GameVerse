from collections import deque


def get_neighbors(
    state: tuple[int, int],
    jug_a_capacity: int,
    jug_b_capacity: int,
):
    jug_a, jug_b = state

    neighbors = []


    # Fill Jug A
    if jug_a < jug_a_capacity:
        neighbors.append(
            (
                (jug_a_capacity, jug_b),
                "Fill Jug A",
            )
        )


    # Fill Jug B
    if jug_b < jug_b_capacity:
        neighbors.append(
            (
                (jug_a, jug_b_capacity),
                "Fill Jug B",
            )
        )


    # Empty Jug A
    if jug_a > 0:
        neighbors.append(
            (
                (0, jug_b),
                "Empty Jug A",
            )
        )


    # Empty Jug B
    if jug_b > 0:
        neighbors.append(
            (
                (jug_a, 0),
                "Empty Jug B",
            )
        )


    # Pour Jug A -> Jug B
    transfer = min(
        jug_a,
        jug_b_capacity - jug_b,
    )

    if transfer > 0:
        neighbors.append(
            (
                (
                    jug_a - transfer,
                    jug_b + transfer,
                ),
                "Pour A → B",
            )
        )


    # Pour Jug B -> Jug A
    transfer = min(
        jug_b,
        jug_a_capacity - jug_a,
    )

    if transfer > 0:
        neighbors.append(
            (
                (
                    jug_a + transfer,
                    jug_b - transfer,
                ),
                "Pour B → A",
            )
        )


    return neighbors


def solve_water_jug(
    jug_a_capacity: int,
    jug_b_capacity: int,
    target: int,
):
    """
    Solve the Water Jug Problem
    using Breadth-First Search.
    """

    # Impossible target
    if target > max(
        jug_a_capacity,
        jug_b_capacity,
    ):
        return [], []


    # Mathematical feasibility check
    from math import gcd

    if target % gcd(
        jug_a_capacity,
        jug_b_capacity,
    ) != 0:
        return [], []


    start = (0, 0)


    queue = deque(
        [
            (
                start,
                [start],
                [],
            )
        ]
    )


    visited = {
        start,
    }


    while queue:

        current_state, path, moves = (
            queue.popleft()
        )


        jug_a, jug_b = current_state


        # Target reached
        if (
            jug_a == target
            or jug_b == target
        ):
            return path, moves


        for (
            next_state,
            move,
        ) in get_neighbors(
            current_state,
            jug_a_capacity,
            jug_b_capacity,
        ):

            if next_state in visited:
                continue


            visited.add(
                next_state
            )


            queue.append(
                (
                    next_state,
                    path + [
                        next_state
                    ],
                    moves + [
                        move
                    ],
                )
            )


    return [], []