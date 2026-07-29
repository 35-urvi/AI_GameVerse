from typing import Optional
import random

ROWS = 6
COLUMNS = 7

EMPTY = 0
PLAYER = 1
AI = 2

WINDOW_LENGTH = 4

def create_board() -> list[list[int]]:
    """
    Create an empty Connect Four board.
    """

    return [
        [EMPTY for _ in range(COLUMNS)]
        for _ in range(ROWS)
    ]

def is_valid_location(
    board: list[list[int]],
    column: int,
) -> bool:
    """
    Check whether a piece can be dropped
    into the selected column.
    """

    if column < 0 or column >= COLUMNS:
        return False

    return board[0][column] == EMPTY

def get_next_open_row(
    board: list[list[int]],
    column: int,
) -> Optional[int]:
    """
    Find the lowest empty row in a column.
    """

    for row in range(
        ROWS - 1,
        -1,
        -1,
    ):
        if board[row][column] == EMPTY:
            return row

    return None

def drop_piece(
    board: list[list[int]],
    row: int,
    column: int,
    piece: int,
) -> None:
    """
    Place a piece on the board.
    """

    board[row][column] = piece

def winning_move(
    board: list[list[int]],
    piece: int,
) -> bool:
    """
    Check whether the player has
    four pieces in a row.
    """

    # Horizontal
    for row in range(ROWS):
        for column in range(
            COLUMNS - 3
        ):
            if (
                board[row][column] == piece
                and board[row][column + 1] == piece
                and board[row][column + 2] == piece
                and board[row][column + 3] == piece
            ):
                return True

    # Vertical
    for row in range(
        ROWS - 3
    ):
        for column in range(COLUMNS):
            if (
                board[row][column] == piece
                and board[row + 1][column] == piece
                and board[row + 2][column] == piece
                and board[row + 3][column] == piece
            ):
                return True

    # Positive diagonal /
    for row in range(
        ROWS - 3
    ):
        for column in range(
            COLUMNS - 3
        ):
            if (
                board[row][column] == piece
                and board[row + 1][column + 1] == piece
                and board[row + 2][column + 2] == piece
                and board[row + 3][column + 3] == piece
            ):
                return True

    # Negative diagonal \
    for row in range(
        3,
        ROWS,
    ):
        for column in range(
            COLUMNS - 3
        ):
            if (
                board[row][column] == piece
                and board[row - 1][column + 1] == piece
                and board[row - 2][column + 2] == piece
                and board[row - 3][column + 3] == piece
            ):
                return True

    return False

def get_valid_locations(
    board: list[list[int]],
) -> list[int]:
    """
    Return all columns where
    a piece can be dropped.
    """

    return [
        column
        for column in range(COLUMNS)
        if is_valid_location(
            board,
            column,
        )
    ]

def evaluate_window(
    window: list[int],
    piece: int,
) -> int:
    """
    Evaluate four consecutive cells.
    """

    score = 0

    opponent = (
        PLAYER
        if piece == AI
        else AI
    )

    piece_count = window.count(
        piece
    )

    empty_count = window.count(
        EMPTY
    )

    opponent_count = window.count(
        opponent
    )

    # Four in a row
    if piece_count == 4:
        score += 100

    # Three in a row + empty
    elif (
        piece_count == 3
        and empty_count == 1
    ):
        score += 5

    # Two in a row + two empty
    elif (
        piece_count == 2
        and empty_count == 2
    ):
        score += 2

    # Block opponent's winning opportunity
    if (
        opponent_count == 3
        and empty_count == 1
    ):
        score -= 4

    return score

def score_position(
    board: list[list[int]],
    piece: int,
) -> int:
    """
    Calculate the heuristic score
    for the current board.
    """

    score = 0

    # Center column preference
    center_column = [
        board[row][COLUMNS // 2]
        for row in range(ROWS)
    ]

    center_count = center_column.count(
        piece
    )

    score += (
        center_count * 3
    )

    # Horizontal windows
    for row in range(ROWS):
        for column in range(
            COLUMNS - 3
        ):
            window = [
                board[row][column + offset]
                for offset in range(4)
            ]

            score += evaluate_window(
                window,
                piece,
            )

    # Vertical windows
    for row in range(
        ROWS - 3
    ):
        for column in range(COLUMNS):
            window = [
                board[row + offset][column]
                for offset in range(4)
            ]

            score += evaluate_window(
                window,
                piece,
            )

    # Positive diagonal
    for row in range(
        ROWS - 3
    ):
        for column in range(
            COLUMNS - 3
        ):
            window = [
                board[row + offset][column + offset]
                for offset in range(4)
            ]

            score += evaluate_window(
                window,
                piece,
            )

    # Negative diagonal
    for row in range(
        3,
        ROWS,
    ):
        for column in range(
            COLUMNS - 3
        ):
            window = [
                board[row - offset][column + offset]
                for offset in range(4)
            ]

            score += evaluate_window(
                window,
                piece,
            )

    return score

def alpha_beta(
    board: list[list[int]],
    depth: int,
    alpha: float,
    beta: float,
    maximizing_player: bool,
) -> tuple[Optional[int], int]:
    """
    Alpha-Beta Pruning algorithm.

    Returns:
        best_column
        best_score
    """

    valid_locations = get_valid_locations(
        board
    )

    terminal = (
        winning_move(
            board,
            PLAYER,
        )
        or winning_move(
            board,
            AI,
        )
        or not valid_locations
    )

    if depth == 0 or terminal:

        if winning_move(
            board,
            AI,
        ):
            return (
                None,
                1_000_000,
            )

        if winning_move(
            board,
            PLAYER,
        ):
            return (
                None,
                -1_000_000,
            )

        return (
            None,
            score_position(
                board,
                AI,
            ),
        )

    if maximizing_player:

        value = -float("inf")

        best_column = valid_locations[0]

        for column in valid_locations:

            row = get_next_open_row(
                board,
                column,
            )

            if row is None:
                continue

            board[row][column] = AI

            _, new_score = alpha_beta(
                board,
                depth - 1,
                alpha,
                beta,
                False,
            )

            board[row][column] = EMPTY

            if new_score > value:
                value = new_score
                best_column = column

            alpha = max(
                alpha,
                value,
            )

            if alpha >= beta:
                break

        return (
            best_column,
            int(value),
        )

    value = float("inf")

    best_column = valid_locations[0]

    for column in valid_locations:

        row = get_next_open_row(
            board,
            column,
        )

        if row is None:
            continue

        board[row][column] = PLAYER

        _, new_score = alpha_beta(
            board,
            depth - 1,
            alpha,
            beta,
            True,
        )

        board[row][column] = EMPTY

        if new_score < value:
            value = new_score
            best_column = column

        beta = min(
            beta,
            value,
        )

        if alpha >= beta:
            break

    return (
        best_column,
        int(value),
    )

def get_best_move(
    board: list[list[int]],
    depth: int = 5,
) -> Optional[int]:
    """
    Get the best move using
    Alpha-Beta Pruning.
    """

    if not get_valid_locations(
        board
    ):
        return None

    column, _ = alpha_beta(
        board,
        depth,
        -float("inf"),
        float("inf"),
        True,
    )

    return column

def get_random_move(
    board: list[list[int]],
) -> int | None:

    valid_columns = []

    for column in range(7):

        # Top cell is empty,
        # so column has space
        if board[0][column] == 0:
            valid_columns.append(
                column
            )

    if not valid_columns:
        return None

    return random.choice(
        valid_columns
    )