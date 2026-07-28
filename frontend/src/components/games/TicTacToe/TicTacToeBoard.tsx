import type { Board } from "@/types/ticTacToe";

import {
  WINNING_COMBINATIONS,
} from "./ticTacToeEngine";

import { Button } from "@/components/ui/button";

interface TicTacToeBoardProps {
  board: Board;
  onCellClick: (position: number) => void;
  disabled?: boolean;
}

function TicTacToeBoard({
  board,
  onCellClick,
  disabled = false,
}: TicTacToeBoardProps) {
  const winningCombination =
    WINNING_COMBINATIONS.find(
      ([a, b, c]) =>
        board[a] &&
        board[a] === board[b] &&
        board[a] === board[c],
    );

  const getWinningLineClass = () => {
    if (!winningCombination) {
      return "";
    }

    const combination =
      winningCombination.join(",");

    switch (combination) {
      // -----------------------------
      // Horizontal
      // -----------------------------

      // 0 1 2
      case "0,1,2":
        return `
          left-0
          top-[16.66%]
          w-full
          h-1
        `;

      // 3 4 5
      case "3,4,5":
        return `
          left-0
          top-1/2
          w-full
          h-1
          -translate-y-1/2
        `;

      // 6 7 8
      case "6,7,8":
        return `
          left-0
          bottom-[16.66%]
          w-full
          h-1
        `;

      // -----------------------------
      // Vertical
      // -----------------------------

      // 0 3 6
      case "0,3,6":
        return `
          left-[16.66%]
          top-0
          h-full
          w-1
        `;

      // 1 4 7
      case "1,4,7":
        return `
          left-1/2
          top-0
          h-full
          w-1
          -translate-x-1/2
        `;

      // 2 5 8
      case "2,5,8":
        return `
          right-[16.66%]
          top-0
          h-full
          w-1
        `;

      // -----------------------------
      // Diagonal
      // -----------------------------

      // 0 4 8
      case "0,4,8":
        return `
          left-1/2
          top-1/2
          w-[140%]
          h-1
          -translate-x-1/2
          -translate-y-1/2
          rotate-45
        `;

      // 2 4 6
      case "2,4,6":
        return `
          left-1/2
          top-1/2
          w-[140%]
          h-1
          -translate-x-1/2
          -translate-y-1/2
          -rotate-45
        `;

      default:
        return "";
    }
  };

  return (
    <div className="relative">
      {/* Game Board */}
      <div className="grid grid-cols-3 gap-3">
        {board.map((cell, index) => (
          <Button
            key={index}
            variant="outline"
            disabled={
              disabled ||
              cell !== null
            }
            onClick={() =>
              onCellClick(index)
            }
            className="
              h-24
              w-24
              text-4xl
              font-bold
              transition-all
              duration-300
              sm:h-28
              sm:w-28
              sm:text-5xl
            "
          >
            {cell === "X" && (
              <span className="text-blue-500">
                X
              </span>
            )}

            {cell === "O" && (
              <span className="text-red-500">
                O
              </span>
            )}
          </Button>
        ))}
      </div>

      {/* Winning Line */}
      {winningCombination && (
        <div
          className={`
            pointer-events-none
            absolute
            z-10
            rounded-full
            bg-primary
            shadow-lg
            transition-all
            duration-500
            ${getWinningLineClass()}
          `}
        />
      )}
    </div>
  );
}

export default TicTacToeBoard;