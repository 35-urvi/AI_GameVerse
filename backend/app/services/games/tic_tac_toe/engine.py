from typing import Optional
import random

Board = list[Optional[str]]


WINNING_COMBINATIONS = [
    (0, 1, 2),
    (3, 4, 5),
    (6, 7, 8),
    (0, 3, 6),
    (1, 4, 7),
    (2, 5, 8),
    (0, 4, 8),
    (2, 4, 6),
]


def check_winner(board: Board) -> Optional[str]:
    """
    Return the winner if there is one.
    Return None if there is no winner.
    """

    for a, b, c in WINNING_COMBINATIONS:
        if (
            board[a] is not None
            and board[a] == board[b]
            and board[a] == board[c]
        ):
            return board[a]

    return None


def is_board_full(board: Board) -> bool:
    """
    Check whether the board has no empty cells.
    """

    return all(
        cell is not None
        for cell in board
    )


def get_available_moves(
    board: Board,
) -> list[int]:
    """
    Return all empty positions.
    """

    return [
        index
        for index, cell in enumerate(board)
        if cell is None
    ]


def minimax(
    board: Board,
    is_maximizing: bool,
) -> int:
    """
    Minimax algorithm.

    AI = O
    Human = X

    AI tries to maximize the score.
    Human tries to minimize the score.
    """

    winner = check_winner(board)

    # AI wins
    if winner == "O":
        return 1

    # Human wins
    if winner == "X":
        return -1

    # Draw
    if is_board_full(board):
        return 0

    if is_maximizing:
        best_score = -float("inf")

        for move in get_available_moves(board):
            board[move] = "O"

            score = minimax(
                board,
                False,
            )

            board[move] = None

            best_score = max(
                best_score,
                score,
            )

        return int(best_score)

    best_score = float("inf")

    for move in get_available_moves(board):
        board[move] = "X"

        score = minimax(
            board,
            True,
        )

        board[move] = None

        best_score = min(
            best_score,
            score,
        )

    return int(best_score)


def get_best_move(
    board: Board,
) -> Optional[int]:
    """
    Find the best move for AI.
    AI player = O
    """

    if (
        check_winner(board)
        or is_board_full(board)
    ):
        return None

    best_score = -float("inf")
    best_move = None

    for move in get_available_moves(board):
        board[move] = "O"

        score = minimax(
            board,
            False,
        )

        board[move] = None

        if score > best_score:
            best_score = score
            best_move = move

    return best_move

def get_random_move(
    board: Board,
) -> Optional[int]:
    """
    Easy AI.

    Selects a random available move.
    """

    available_moves = get_available_moves(
        board
    )

    if not available_moves:
        return None

    return random.choice(
        available_moves
    )