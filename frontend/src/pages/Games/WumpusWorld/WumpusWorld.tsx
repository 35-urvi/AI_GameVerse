import {
  useEffect,
  useState,
} from "react";

import {
  Brain,
  Dices,
  RotateCcw,
  Sparkles,
} from "lucide-react";

import {
  Button,
} from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import WumpusWorldBoard from "@/components/games/WumpusWorld/WumpusWorldBoard";

import {
  createWumpusGame,
  moveWumpusPlayer,
  resetWumpusGame,
  solveWumpusWorld,
} from "@/api/wumpusWorldApi";

import type {
  WumpusGameState,
} from "@/types/wumpusWorld";


type Direction =
  | "up"
  | "down"
  | "left"
  | "right";


function WumpusWorld() {

  const [
    game,
    setGame,
  ] = useState<WumpusGameState | null>(
    null,
  );


  const [
    isLoading,
    setIsLoading,
  ] = useState(true);


  const [
    isMoving,
    setIsMoving,
  ] = useState(false);

  const [
    isAIPlaying,
    setIsAIPlaying,
  ] = useState(false);


  const startNewGame =
    async () => {

      try {

        setIsLoading(true);

        const newGame =
          await createWumpusGame();

        setGame(
          newGame,
        );

      } catch (error) {

        console.error(
          "Failed to create Wumpus World:",
          error,
        );

      } finally {

        setIsLoading(false);

      }
    };


  const handleResetGame =
    async () => {

      try {

        setIsLoading(true);

        const resetGame =
          await resetWumpusGame();

        setGame(
          resetGame,
        );

      } catch (error) {

        console.error(
          "Failed to reset Wumpus World:",
          error,
        );

      } finally {

        setIsLoading(false);

      }
    };


  const handleSolveWithAI =
    async () => {

      if (
        !game ||
        game.game_over ||
        isAIPlaying
      ) {
        return;
      }

      try {

        setIsAIPlaying(true);

        const moves =
          await solveWumpusWorld();

        if (
          !moves ||
          moves.length === 0
        ) {

          alert(
            "No safe path to gold and back exists for this Wumpus World map.",
          );

          return;
        }

        for (
          const move of moves
        ) {

          await new Promise(
            (resolve) =>
              setTimeout(
                resolve,
                500,
              ),
          );

          const updatedGame =
            await moveWumpusPlayer(
              move as Direction,
            );

          setGame(
            updatedGame,
          );

          if (
            updatedGame.game_over
          ) {
            break;
          }

        }

      } catch (error) {

        console.error(
          "Failed to solve Wumpus World:",
          error,
        );

      } finally {

        setIsAIPlaying(
          false,
        );

      }
    };


  useEffect(() => {
    startNewGame();
  }, []);


  useEffect(() => {

    const handleKeyDown = (
      event: KeyboardEvent,
    ) => {

      if (
        !game ||
        game.game_over ||
        isMoving ||
        isAIPlaying
      ) {
        return;
      }


      const keyMap: Record<
        string,
        Direction
      > = {
        ArrowUp: "up",
        ArrowDown: "down",
        ArrowLeft: "left",
        ArrowRight: "right",

        w: "up",
        W: "up",

        s: "down",
        S: "down",

        a: "left",
        A: "left",

        d: "right",
        D: "right",
      };


      const direction =
        keyMap[event.key];


      if (!direction) {
        return;
      }


      event.preventDefault();

      handleMove(direction);
    };


    window.addEventListener(
      "keydown",
      handleKeyDown,
    );


    return () => {

      window.removeEventListener(
        "keydown",
        handleKeyDown,
      );

    };

  }, [
    game,
    isMoving,
    isAIPlaying,
  ]);


  const handleMove =
    async (
      direction: Direction,
    ) => {

      if (
        !game ||
        game.game_over ||
        isMoving ||
        isAIPlaying
      ) {
        return;
      }


      try {

        setIsMoving(true);

        const updatedGame =
          await moveWumpusPlayer(
            direction,
          );

        setGame(
          updatedGame,
        );

      } catch (error) {

        console.error(
          "Failed to move player:",
          error,
        );

      } finally {

        setIsMoving(false);

      }
    };


  if (
    isLoading ||
    !game
  ) {

    return (
      <div className="flex min-h-[400px] items-center justify-center">

        <p className="text-muted-foreground">
          Creating Wumpus World...
        </p>

      </div>
    );
  }


  return (
    <div className="mx-auto w-full max-w-6xl px-2 sm:px-4">
      {/* Header */}
      <div className="mb-8">

        <h1 className="text-3xl font-bold">
          Wumpus World
        </h1>

        <p className="mt-2 text-muted-foreground">
          Explore the world, use percepts,
          and find the gold without falling
          into danger.
        </p>

      </div>


      {/* Main Layout */}
      <div
        className="
            grid
            gap-4
            lg:grid-cols-[minmax(0,1fr)_280px]
        "
      >

        {/* Board */}
        <Card>

          <CardHeader>

            <CardTitle className="text-center">

              {game.won
                ? "🏆 You Escaped with the Gold!"
                : game.game_over
                  ? "💀 Game Over"
                  : isAIPlaying
                    ? "🤖 AI is solving..."
                    : "Explore Wumpus World"}

            </CardTitle>

          </CardHeader>


          <CardContent
            className="
                flex
                flex-col
                items-center
                gap-4
                overflow-hidden
                pb-6
            "
          >

            <WumpusWorldBoard
              game={game}
            />


            {/* Movement Controls */}
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Use your keyboard arrow keys to explore
              </p>

              <div className="mt-2 flex justify-center gap-2">
                <kbd className="rounded-md border bg-muted px-3 py-1 text-sm">
                  ↑
                </kbd>

                <kbd className="rounded-md border bg-muted px-3 py-1 text-sm">
                  ↓
                </kbd>

                <kbd className="rounded-md border bg-muted px-3 py-1 text-sm">
                  ←
                </kbd>

                <kbd className="rounded-md border bg-muted px-3 py-1 text-sm">
                  →
                </kbd>
              </div>
            </div>
          </CardContent>

        </Card>


        {/* Controls */}
        <Card>

          <CardHeader>

            <CardTitle>
              Game Information
            </CardTitle>

          </CardHeader>


          <CardContent
            className="space-y-5"
          >

            {/* Current Position */}
            <div
              className="
                rounded-lg
                border
                p-4
              "
            >

              <p
                className="
                  text-sm
                  text-muted-foreground
                "
              >
                Current Position
              </p>

              <p
                className="
                  mt-1
                  text-2xl
                  font-bold
                "
              >
                (
                {game.player.row},
                {game.player.column}
                )
              </p>

            </div>


            {/* Score */}
            <div
              className="
                rounded-lg
                border
                p-4
              "
            >

              <p
                className="
                  text-sm
                  text-muted-foreground
                "
              >
                Score
              </p>

              <p
                className="
                  mt-1
                  text-2xl
                  font-bold
                "
              >
                {game.score}
              </p>

            </div>


            {/* Percepts */}
            <div
              className="
                rounded-lg
                border
                bg-muted/30
                p-4
              "
            >

              <p
                className="
                  mb-3
                  font-semibold
                "
              >
                Current Percepts
              </p>


              <div className="space-y-2">

                {game.breeze[
                  game.player.row
                ][
                  game.player.column
                ] && (
                  <p>
                    💨 Breeze detected
                  </p>
                )}


                {game.stench[
                  game.player.row
                ][
                  game.player.column
                ] && (
                  <p>
                    👃 Stench detected
                  </p>
                )}


                {game.glitter[
                  game.player.row
                ][
                  game.player.column
                ] && (
                  <p>
                    ✨ Glitter detected
                  </p>
                )}


                {!game.breeze[
                  game.player.row
                ][
                  game.player.column
                ] &&
                !game.stench[
                  game.player.row
                ][
                  game.player.column
                ] &&
                !game.glitter[
                  game.player.row
                ][
                  game.player.column
                ] && (
                  <p className="text-muted-foreground">
                    No percepts
                  </p>
                )}

              </div>

            </div>


            {/* Gold Status */}
            <div
              className="
                rounded-lg
                border
                p-4
              "
            >

              <p
                className="
                  text-sm
                  text-muted-foreground
                "
              >
                Mission Status
              </p>

              <p className="mt-1 font-semibold">

                {game.has_gold
                  ? "✨ Gold collected"
                  : "🔍 Find the gold"}

              </p>

            </div>

            {game.game_over && (
              <div
                className={`
                rounded-lg
                border
                p-4
                ${
                  game.won
                    ? "border-green-500/30 bg-green-500/10"
                    : "border-red-500/30 bg-red-500/10"
                }
                `}
              >
                <p className="font-semibold">
                  {game.won
                    ? "🏆 Mission Complete"
                    : "💀 Game Over"}
                </p>

                <p className="mt-2 text-sm text-muted-foreground">
                  {game.game_over_reason}
                </p>
              </div>
            )}

            {/* AI Algorithm Box */}
            <div className="rounded-lg border bg-muted/30 p-4">
              <div className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                <span className="font-semibold">
                  BFS Solver
                </span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                AI uses Breadth-First Search to navigate safely to the gold and return to the entrance.
              </p>
            </div>

            {/* New Game */}
            <Button
              variant="outline"
              className="w-full"
              onClick={startNewGame}
              disabled={
                isLoading ||
                isMoving ||
                isAIPlaying
              }
            >
              <Dices className="mr-2 h-4 w-4" />
              New Game
            </Button>

            {/* Solve with AI */}
            <Button
              className="w-full"
              onClick={handleSolveWithAI}
              disabled={
                game.game_over ||
                isAIPlaying ||
                isMoving
              }
            >
              <Sparkles className="mr-2 h-4 w-4" />
              {isAIPlaying
                ? "AI Solving..."
                : "Solve with AI"}
            </Button>

            {/* Reset Game */}
            <Button
              variant="outline"
              className="w-full"
              onClick={handleResetGame}
              disabled={
                isLoading ||
                isMoving ||
                isAIPlaying
              }
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset Game
            </Button>

          </CardContent>

        </Card>

      </div>

    </div>
  );
}


export default WumpusWorld;