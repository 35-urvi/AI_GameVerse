import { Footprints,Wind, Sparkles, Skull} from "lucide-react";
import type {
  WumpusGameState,
} from "@/types/wumpusWorld";


interface WumpusWorldBoardProps {
  game: WumpusGameState;
}


function WumpusWorldBoard({
  game,
}: WumpusWorldBoardProps) {

  const cells = [];

  for (
    let row = 0;
    row < game.size;
    row++
  ) {

    for (
      let column = 0;
      column < game.size;
      column++
    ) {

      const isPlayer =
        game.player.row === row &&
        game.player.column === column;

      const isVisited =
        game.visited[row][column];

      const hasBreeze =
        game.breeze[row][column];

      const hasStench =
        game.stench[row][column];

      const hasGlitter =
        game.glitter[row][column];


      cells.push(
        <div
          key={`${row}-${column}`}
          className={`
            relative
            flex
            aspect-square
            items-center
            justify-center
            rounded-xl
            border-2
            transition-all
            duration-300

            ${
              isVisited
                ? "bg-background"
                : "bg-muted/50"
            }

            ${
              isPlayer
                ? "border-primary bg-primary/10 shadow-lg"
                : "border-border"
            }
          `}
        >

          {/* Player */}
          {isPlayer && (
            <Footprints
              className="
                h-10
                w-10
                text-primary
              "
            />
          )}


          {/* Percepts */}
          {isVisited && !isPlayer && (
            <div
              className="
                absolute
                inset-0
                flex
                flex-wrap
                items-center
                justify-center
                gap-1
                p-2
              "
            >

              {hasBreeze && (
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/15 text-blue-500">
                    <Wind size={22} />
                </span>
               )}


              {hasStench && (
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500/15 text-green-500">
                    <Skull size={22} />
                </span>
              )}

              {hasGlitter && (
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-500/15 text-yellow-500">
                    <Sparkles size={22} />
                </span>
              )}

            </div>
          )}

        </div>,
      );
    }
  }


  return (
    <div
      className="
        grid
        w-full
        max-w-[520px]
        grid-cols-4
        gap-2
        sm:gap-3
      "
    >
      {cells}
    </div>
  );
}


export default WumpusWorldBoard;