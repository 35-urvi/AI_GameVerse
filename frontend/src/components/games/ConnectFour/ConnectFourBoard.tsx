import type {
  ConnectFourBoard as BoardType,
} from "@/types/connectFour";

import {
  ROWS,
  COLUMNS,
} from "@/types/connectFour";

type WinningPosition = {
  row: number;
  column: number;
};

type Props = {
  board: BoardType;
  onColumnClick: (
    column: number,
  ) => void;
  disabled: boolean;
  winningLine: WinningPosition[];
};


function ConnectFourBoard({
  board,
  onColumnClick,
  disabled,
  winningLine,
}: Props) {

  const isWinningCell = (
    row: number,
    column: number,
  ) => {
    return winningLine.some(
      (position) =>
        position.row === row &&
        position.column === column,
    );
  };


  return (
    <div className="w-full max-w-xl">
      <div className="rounded-2xl border bg-primary/10 p-3 shadow-inner sm:p-4">

        <div className="grid grid-cols-7 gap-2">

          {Array.from(
            { length: ROWS },
            (_, rowIndex) =>
              Array.from(
                {
                  length: COLUMNS,
                },
                (_, columnIndex) => {

                  const cell =
                    board[rowIndex][
                      columnIndex
                    ];

                  const winning =
                    isWinningCell(
                      rowIndex,
                      columnIndex,
                    );

                  return (
                    <button
                      key={`${rowIndex}-${columnIndex}`}
                      type="button"
                      disabled={
                        disabled
                      }
                      onClick={() =>
                        onColumnClick(
                          columnIndex,
                        )
                      }
                      className="
                        aspect-square
                        rounded-full
                        border-2
                        border-background
                        bg-background
                        shadow-inner
                        transition-all
                        duration-200
                        hover:scale-105
                        disabled:cursor-not-allowed
                      "
                    >
                      {cell === 1 && (
                        <div
                          className={`
                            h-full
                            w-full
                            rounded-full
                            bg-red-500
                            shadow-md
                            ${
                              winning
                                ? "ring-4 ring-red-300 ring-offset-2"
                                : ""
                            }
                          `}
                        />
                      )}

                      {cell === 2 && (
                        <div
                          className={`
                            h-full
                            w-full
                            rounded-full
                            bg-yellow-400
                            shadow-md
                            ${
                              winning
                                ? "ring-4 ring-yellow-300 ring-offset-2"
                                : ""
                            }
                          `}
                        />
                      )}
                    </button>
                  );
                },
              ),
          )}

        </div>
      </div>
    </div>
  );
}


export default ConnectFourBoard;