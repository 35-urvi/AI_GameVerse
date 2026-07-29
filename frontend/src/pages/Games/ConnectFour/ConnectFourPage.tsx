import { useState } from "react";
import {
  Bot,
  RotateCcw,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import ConnectFourBoard from "@/components/games/ConnectFour/ConnectFourBoard";

import {
  checkGameResult,
  createEmptyBoard,
  getNextOpenRow,
  makeMove,
} from "@/components/games/ConnectFour/connectFourEngine";

import { getConnectFourAIMove } from "@/api/connectFourApi";

import type {
  ConnectFourPlayer,
  Difficulty,
  GameMode,
} from "@/types/connectFour";

import {
  PLAYER,
  AI,
} from "@/types/connectFour";


function ConnectFourPage() {
  const [board, setBoard] =
    useState(
      createEmptyBoard(),
    );

  const [currentPlayer, setCurrentPlayer] =
    useState<ConnectFourPlayer>(
      PLAYER,
    );

  const [winner, setWinner] =
    useState<ConnectFourPlayer | null>(
      null,
    );

  const [winningLine, setWinningLine] =
    useState<
      {
        row: number;
        column: number;
      }[]
    >([]);

  const [isDraw, setIsDraw] =
    useState(false);

  const [gameMode, setGameMode] =
    useState<GameMode>(
      "human-human",
    );

  const [isAIThinking, setIsAIThinking] =
    useState(false);

  const [difficulty, setDifficulty] =
    useState<Difficulty>(
      "hard",
    );


  const isGameOver =
    winner !== null ||
    isDraw;


  /*
   * In Human vs Human:
   * Both Red and Yellow are controlled
   * by humans.
   *
   * In Human vs AI:
   * Red = Human
   * Yellow = AI
   */
  const isHumanTurn =
    gameMode === "human-human" ||
    currentPlayer === PLAYER;


  /*
   * AI Move
   */
  const handleAIMove = async (
    updatedBoard: typeof board,
  ) => {
    try {
      setIsAIThinking(true);

      const aiColumn =
        await getConnectFourAIMove(
          updatedBoard,
          difficulty,
        );

      if (
        aiColumn === null ||
        aiColumn === undefined
      ) {
        return;
      }

      /*
       * Make AI move
       */
      const boardAfterAI =
        makeMove(
          updatedBoard,
          aiColumn,
          AI,
        );

      /*
       * If column is full
       */
      if (!boardAfterAI) {
        return;
      }

      setBoard(
        boardAfterAI,
      );


      /*
       * Check AI result
       */
      const result =
        checkGameResult(
          boardAfterAI,
        );


      /*
       * AI Wins
       */
      if (result.winner) {
        setWinner(
          result.winner,
        );

        setWinningLine(
          result.winningLine,
        );

        return;
      }


      /*
       * Draw
       */
      if (result.isDraw) {
        setIsDraw(true);

        return;
      }


      /*
       * Back to Human
       */
      setCurrentPlayer(
        PLAYER,
      );

    } catch (error) {
      console.error(
        "Failed to get Connect Four AI move:",
        error,
      );

    } finally {
      setIsAIThinking(false);
    }
  };


  /*
   * Human Column Click
   */
  const handleColumnClick = async (
    column: number,
  ) => {

    /*
     * Prevent invalid moves
     */
    if (
      isGameOver ||
      isAIThinking
    ) {
      return;
    }


    /*
     * Prevent AI from being
     * controlled by Human
     *
     * Human vs AI:
     * Red = Human
     * Yellow = AI
     */
    if (
      gameMode === "human-ai" &&
      currentPlayer === AI
    ) {
      return;
    }


    /*
     * Check whether column
     * has an available position
     */
    const row =
      getNextOpenRow(
        board,
        column,
      );


    if (row === -1) {
      return;
    }


    /*
     * Human Move
     */
    const updatedBoard =
      makeMove(
        board,
        column,
        currentPlayer,
      );


    if (!updatedBoard) {
      return;
    }


    setBoard(
      updatedBoard,
    );


    /*
     * Check Human Result
     */
    const result =
      checkGameResult(
        updatedBoard,
      );


    /*
     * Human Wins
     */
    if (result.winner) {
      setWinner(
        result.winner,
      );

      setWinningLine(
        result.winningLine,
      );

      return;
    }


    /*
     * Draw
     */
    if (result.isDraw) {
      setIsDraw(true);

      return;
    }


    /*
     * Human vs AI
     */
    if (
      gameMode === "human-ai"
    ) {
      /*
       * Change turn to AI
       */
      setCurrentPlayer(
        AI,
      );


      /*
       * Ask Backend AI
       * for best move
       */
      await handleAIMove(
        updatedBoard,
      );

      return;
    }


    /*
     * Human vs Human
     *
     * Red → Yellow
     * Yellow → Red
     */
    setCurrentPlayer(
      currentPlayer === PLAYER
        ? AI
        : PLAYER,
    );
  };


  /*
   * Reset Game
   */
  const resetGame = () => {
    setBoard(
      createEmptyBoard(),
    );

    setCurrentPlayer(
      PLAYER,
    );

    setWinner(null);

    setWinningLine([]);

    setIsDraw(false);

    setIsAIThinking(false);
  };


  /*
   * Game Mode Change
   */
  const handleGameModeChange = (
    value: string | null,
  ) => {
    if (!value) {
      return;
    }

    setGameMode(
      value as GameMode,
    );

    resetGame();
  };


  return (
    <div className="mx-auto max-w-5xl">

      {/* =========================
          Header
      ========================= */}
      <div className="mb-8">

        <h1 className="text-3xl font-bold">
          Connect Four
        </h1>

        <p className="mt-2 text-muted-foreground">
          Challenge the AI using the
          Alpha-Beta Pruning algorithm.
        </p>

      </div>


      {/* =========================
          Main Layout
      ========================= */}
      <div className="grid gap-6 lg:grid-cols-[1fr_300px]">


        {/* =========================
            Game Board
        ========================= */}
        <Card>

          <CardHeader>

            <CardTitle className="flex items-center justify-center gap-2 text-center">

              {winner ? (

                winner === PLAYER
                  ? "Red Wins!"
                  : "Yellow Wins!"

              ) : isDraw ? (

                "It's a Draw!"

              ) : (

                <>

                  <span>
                    {currentPlayer === PLAYER
                      ? "Red"
                      : "Yellow"}
                    's Turn
                  </span>

                  {/* AI Thinking Indicator */}

                  {isAIThinking && (
                    <span className="flex items-center gap-1 text-sm font-normal text-muted-foreground">

                      <span>
                        AI thinking
                      </span>

                      <span className="flex gap-0.5">

                        <span className="animate-bounce [animation-delay:-0.3s]">
                          .
                        </span>

                        <span className="animate-bounce [animation-delay:-0.15s]">
                          .
                        </span>

                        <span className="animate-bounce">
                          .
                        </span>

                      </span>

                    </span>
                  )}

                </>

              )}

            </CardTitle>

          </CardHeader>


          <CardContent className="flex flex-col items-center gap-6 pb-8">

            <ConnectFourBoard
              board={board}
              onColumnClick={
                handleColumnClick
              }
              disabled={
                isGameOver ||
                isAIThinking ||
                !isHumanTurn
              }
              winningLine={
                winningLine
              }
            />

          </CardContent>

        </Card>


        {/* =========================
            Game Controls
        ========================= */}
        <Card>

          <CardHeader>

            <CardTitle>
              Game Settings
            </CardTitle>

          </CardHeader>


          <CardContent className="space-y-5">


            {/* =====================
                Game Mode
            ===================== */}
            <div className="space-y-2">

              <p className="text-sm font-medium">
                Game Mode
              </p>


              <Select
                value={gameMode}
                onValueChange={
                  handleGameModeChange
                }
              >

                <SelectTrigger>

                  <SelectValue />

                </SelectTrigger>


                <SelectContent>

                  <SelectItem value="human-human">

                    <div className="flex items-center gap-2">

                      <Users className="h-4 w-4" />

                      Human vs Human

                    </div>

                  </SelectItem>


                  <SelectItem value="human-ai">

                    <div className="flex items-center gap-2">

                      <Bot className="h-4 w-4" />

                      Human vs AI

                    </div>

                  </SelectItem>

                </SelectContent>

              </Select>

            </div>


            {/* =====================
                AI Difficulty
            ===================== */}
            {gameMode === "human-ai" && (

              <div className="space-y-2">

                <p className="text-sm font-medium">
                  AI Difficulty
                </p>


                <Select
                  value={difficulty}
                  onValueChange={(
                    value,
                  ) =>
                    setDifficulty(
                      value as Difficulty,
                    )
                  }
                >

                  <SelectTrigger>

                    <SelectValue />

                  </SelectTrigger>


                  <SelectContent>

                    <SelectItem value="easy">
                      Easy — Random AI
                    </SelectItem>

                    <SelectItem value="medium">
                      Medium — Rule Based
                    </SelectItem>

                    <SelectItem value="hard">
                      Hard — Alpha-Beta Pruning
                    </SelectItem>

                  </SelectContent>

                </Select>

              </div>

            )}


            {/* =====================
                Current Player
            ===================== */}
            <div className="rounded-lg border p-4">

              <p className="text-sm text-muted-foreground">
                Current Player
              </p>


              <p className="mt-1 text-2xl font-bold">

                {currentPlayer === PLAYER
                  ? "Red"
                  : "Yellow"}

              </p>

            </div>


            {/* =====================
                AI Information
            ===================== */}
            {gameMode === "human-ai" && (

              <div className="rounded-lg border bg-muted/30 p-4">

                <div className="flex items-center gap-2">

                  <Bot className="h-5 w-5" />

                  <span className="font-semibold">

                    Alpha-Beta AI

                  </span>

                </div>


                <p className="mt-2 text-sm text-muted-foreground">

                  You are Red.
                  <br />

                  AI is Yellow.

                </p>

              </div>

            )}


            {/* =====================
                New Game
            ===================== */}
            <Button
              className="w-full"
              onClick={
                resetGame
              }
            >

              <RotateCcw className="mr-2 h-4 w-4" />

              New Game

            </Button>

          </CardContent>

        </Card>

      </div>

    </div>
  );
}


export default ConnectFourPage;
