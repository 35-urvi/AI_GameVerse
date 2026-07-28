import type {
  Board,
  GameResult,
  Player,
} from "@/types/ticTacToe";

export const WINNING_COMBINATIONS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

export function createEmptyBoard(): Board {
  return Array(9).fill(null);
}

export function checkGameResult(
  board: Board,
): GameResult {
  for (const combination of WINNING_COMBINATIONS) {
    const [a, b, c] = combination;

    if (
      board[a] &&
      board[a] === board[b] &&
      board[a] === board[c]
    ) {
      return {
        winner: board[a],
        isDraw: false,
      };
    }
  }

  const isDraw = board.every(
    (cell) => cell !== null,
  );

  return {
    winner: null,
    isDraw,
  };
}

export function getAvailableMoves(
  board: Board,
): number[] {
  return board.reduce<number[]>(
    (moves, cell, index) => {
      if (cell === null) {
        moves.push(index);
      }

      return moves;
    },
    [],
  );
}

export function makeMove(
  board: Board,
  position: number,
  player: Player,
): Board {
  if (board[position] !== null) {
    return board;
  }

  const newBoard = [...board];

  newBoard[position] = player;

  return newBoard;
}