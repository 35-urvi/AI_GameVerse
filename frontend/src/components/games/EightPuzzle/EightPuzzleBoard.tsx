import type { PuzzleBoard } from "@/types/eightPuzzle";

type Props = {
  board: PuzzleBoard;
  onTileClick: (index: number) => void;
  disabled?: boolean;
};

function EightPuzzleBoard({
  board,
  onTileClick,
  disabled = false,
}: Props) {
  return (
    <div className="grid w-full max-w-md grid-cols-3 gap-3 rounded-2xl border bg-muted/30 p-3 shadow-lg sm:gap-4 sm:p-4">
      {board.map((tile, index) => {
        const isEmpty = tile === 0;

        return (
          <button
            key={index}
            type="button"
            disabled={
              disabled || isEmpty
            }
            onClick={() =>
              onTileClick(index)
            }
            className={`
              aspect-square
              rounded-xl
              border
              text-3xl
              font-bold
              shadow-md
              transition-all
              duration-200
              sm:text-4xl
              md:text-5xl

              ${
                isEmpty
                  ? "cursor-default border-transparent bg-transparent shadow-none"
                  : "border-border bg-background hover:-translate-y-1 hover:shadow-xl active:scale-95"
              }

              ${
                disabled && !isEmpty
                  ? "cursor-not-allowed opacity-70"
                  : ""
              }
            `}
          >
            {!isEmpty && tile}
          </button>
        );
      })}
    </div>
  );
}

export default EightPuzzleBoard;