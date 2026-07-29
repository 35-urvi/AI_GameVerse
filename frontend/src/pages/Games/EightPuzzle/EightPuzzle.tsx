import { useEffect, useState } from "react";

import {
  Brain,
  RotateCcw,
  Shuffle,
  Sparkles,
  Timer,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import EightPuzzleBoard from "@/components/games/EightPuzzle/EightPuzzleBoard";

import { solveEightPuzzle } from "@/api/eightPuzzleApi";

import type {
  PuzzleBoard,
} from "@/types/eightPuzzle";


const SOLVED_BOARD: PuzzleBoard = [
  1, 2, 3,
  4, 5, 6,
  7, 8, 0,
];


const INITIAL_BOARD: PuzzleBoard = [
  1, 2, 3,
  4, 0, 6,
  7, 5, 8,
];


function EightPuzzle() {

  const [board, setBoard] =
  useState<PuzzleBoard>(
    INITIAL_BOARD,
  );

    const [initialBoard, setInitialBoard] =
    useState<PuzzleBoard>(
        INITIAL_BOARD,
    );

  const [moves, setMoves] =
    useState(0);

  const [seconds, setSeconds] =
    useState(0);

  const [isSolving, setIsSolving] =
    useState(false);

  const [isSolved, setIsSolved] =
    useState(false);


  /*
   * Timer
   */
  useEffect(() => {

    if (
      isSolved ||
      isSolving
    ) {
      return;
    }

    const timer =
      setInterval(() => {

        setSeconds(
          (current) =>
            current + 1,
        );

      }, 1000);

    return () =>
      clearInterval(timer);

  }, [
    isSolved,
    isSolving,
  ]);


  /*
   * Check whether puzzle is solved
   */
  const checkSolved = (
    currentBoard: PuzzleBoard,
  ) => {

    return currentBoard.every(
      (tile, index) =>
        tile ===
        SOLVED_BOARD[index],
    );
  };


  /*
   * Check whether selected tile
   * is next to empty space
   */
  const canMoveTile = (
    index: number,
  ) => {

    const emptyIndex =
      board.indexOf(0);

    const row =
      Math.floor(index / 3);

    const column =
      index % 3;

    const emptyRow =
      Math.floor(
        emptyIndex / 3,
      );

    const emptyColumn =
      emptyIndex % 3;


    return (
      Math.abs(
        row - emptyRow,
      ) +
      Math.abs(
        column - emptyColumn,
      )
    ) === 1;
  };


  /*
   * Human moves tile
   */
  const handleTileClick = (
    index: number,
  ) => {

    if (
      isSolving ||
      isSolved
    ) {
      return;
    }

    if (
      !canMoveTile(index)
    ) {
      return;
    }

    const emptyIndex =
      board.indexOf(0);

    const newBoard =
      [...board] as PuzzleBoard;


    [
      newBoard[index],
      newBoard[emptyIndex],
    ] = [
      newBoard[emptyIndex],
      newBoard[index],
    ];


    setBoard(newBoard);

    setMoves(
      (current) =>
        current + 1,
    );


    if (
      checkSolved(newBoard)
    ) {
      setIsSolved(true);
    }
  };


  /*
   * Generate a new solvable puzzle
   *
   * We start from the solved board
   * and perform valid random moves.
   *
   * This guarantees that the puzzle
   * is always solvable.
   */
  const shufflePuzzle = () => {

    let shuffled =
      [...SOLVED_BOARD] as PuzzleBoard;

    let previousEmptyIndex =
      -1;


    for (
      let i = 0;
      i < 50;
      i++
    ) {

      const emptyIndex =
        shuffled.indexOf(0);

      const possibleMoves: number[] = [];


      const row =
        Math.floor(
          emptyIndex / 3,
        );

      const column =
        emptyIndex % 3;


      if (
        row > 0 &&
        emptyIndex - 3 !==
          previousEmptyIndex
      ) {
        possibleMoves.push(
          emptyIndex - 3,
        );
      }


      if (
        row < 2 &&
        emptyIndex + 3 !==
          previousEmptyIndex
      ) {
        possibleMoves.push(
          emptyIndex + 3,
        );
      }


      if (
        column > 0 &&
        emptyIndex - 1 !==
          previousEmptyIndex
      ) {
        possibleMoves.push(
          emptyIndex - 1,
        );
      }


      if (
        column < 2 &&
        emptyIndex + 1 !==
          previousEmptyIndex
      ) {
        possibleMoves.push(
          emptyIndex + 1,
        );
      }


      const randomIndex =
        Math.floor(
          Math.random() *
          possibleMoves.length,
        );


      const tileIndex =
        possibleMoves[randomIndex];


      previousEmptyIndex =
        emptyIndex;


      [
        shuffled[
          emptyIndex
        ],
        shuffled[
          tileIndex
        ],
      ] = [
        shuffled[
          tileIndex
        ],
        shuffled[
          emptyIndex
        ],
      ];
    }


    setBoard(
      shuffled,
    );

    setInitialBoard(
        shuffled,
     );

    setMoves(0);

    setSeconds(0);

    setIsSolved(false);
  };


  /*
   * Reset current game
   */
  const resetGame = () => {

  setBoard(
    initialBoard,
  );

  setMoves(0);

  setSeconds(0);

  setIsSolved(false);

  setIsSolving(false);
};


  /*
   * Solve using A*
   */
  const handleSolve = async () => {

    try {

      setIsSolving(true);

      const result =
        await solveEightPuzzle(
          board,
        );


      /*
       * Animate each AI move
       */
      for (
        let i = 1;
        i <
        result.solution.length;
        i++
      ) {

        await new Promise(
          (resolve) =>
            setTimeout(
              resolve,
              500,
            ),
        );


        setBoard(
          result.solution[i],
        );

        setMoves(i);
      }


      setIsSolved(true);

    } catch (error) {

      console.error(
        "Failed to solve puzzle:",
        error,
      );

    } finally {

      setIsSolving(false);
    }
  };


  /*
   * Format timer
   */
  const formatTime = () => {

    const minutes =
      Math.floor(
        seconds / 60,
      );

    const remainingSeconds =
      seconds % 60;


    return `${String(
      minutes,
    ).padStart(2, "0")}:${String(
      remainingSeconds,
    ).padStart(2, "0")}`;
  };


  return (
    <div className="mx-auto max-w-5xl">

      {/* Header */}
      <div className="mb-8">

        <div className="flex items-center gap-3">

          <div className="rounded-xl bg-primary/10 p-3">

            <Brain className="h-7 w-7" />

          </div>

          <div>

            <h1 className="text-3xl font-bold">
              8-Puzzle
            </h1>

            <p className="mt-1 text-muted-foreground">
              Solve the puzzle manually
              or let the AI find the
              solution using A* Search.
            </p>

          </div>

        </div>

      </div>


      {/* Main Layout */}
      <div className="grid gap-6 lg:grid-cols-[1fr_300px]">


        {/* Game Board */}
        <Card>

          <CardHeader>

            <CardTitle className="text-center">

              {isSolved
                ? "🎉 Puzzle Solved!"
                : isSolving
                  ? "🤖 AI is solving..."
                  : "Arrange the tiles"}

            </CardTitle>

          </CardHeader>


          <CardContent className="flex flex-col items-center gap-6 pb-8">

            <EightPuzzleBoard
              board={board}
              onTileClick={
                handleTileClick
              }
              disabled={
                isSolving ||
                isSolved
              }
            />

          </CardContent>

        </Card>


        {/* Game Controls */}
        <Card>

          <CardHeader>

            <CardTitle>
              Game Settings
            </CardTitle>

          </CardHeader>


          <CardContent className="space-y-5">


            {/* Moves */}
            <div className="rounded-lg border p-4">

              <p className="text-sm text-muted-foreground">
                Moves
              </p>

              <p className="mt-1 text-2xl font-bold">
                {moves}
              </p>

            </div>


            {/* Timer */}
            <div className="rounded-lg border p-4">

              <div className="flex items-center gap-2">

                <Timer className="h-4 w-4" />

                <p className="text-sm text-muted-foreground">
                  Time
                </p>

              </div>

              <p className="mt-1 text-2xl font-bold">
                {formatTime()}
              </p>

            </div>


            {/* AI Information */}
            <div className="rounded-lg border bg-muted/30 p-4">

              <div className="flex items-center gap-2">

                <Brain className="h-5 w-5" />

                <span className="font-semibold">
                  A* Search
                </span>

              </div>

              <p className="mt-2 text-sm text-muted-foreground">

                AI uses A* Search with
                Manhattan Distance to
                find the shortest path
                to the solution.

              </p>

            </div>


            {/* Shuffle */}
            <Button
              variant="outline"
              className="w-full"
              onClick={
                shufflePuzzle
              }
              disabled={
                isSolving
              }
            >

              <Shuffle className="mr-2 h-4 w-4" />

              Shuffle

            </Button>


            {/* Solve with AI */}
            <Button
              className="w-full"
              onClick={
                handleSolve
              }
              disabled={
                isSolving ||
                isSolved
              }
            >

              <Sparkles className="mr-2 h-4 w-4" />

              {isSolving
                ? "AI is Solving..."
                : "Solve with A*"}

            </Button>


            {/* Reset */}
            <Button
              variant="outline"
              className="w-full"
              onClick={
                resetGame
              }
              disabled={
                isSolving
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


export default EightPuzzle;