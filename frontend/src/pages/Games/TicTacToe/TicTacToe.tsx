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

import TicTacToeBoard from "@/components/games/TicTacToe/TicTacToeBoard";

import {
  checkGameResult,
  createEmptyBoard,
  makeMove,
} from "@/components/games/TicTacToe/ticTacToeEngine";

import { getAIMove } from "@/api/ticTacToeApi";

import type {
  Difficulty,
  GameMode,
  Player,
} from "@/types/ticTacToe";

function TicTacToe() {
  const [board, setBoard] = useState(
    createEmptyBoard(),
  );

  const [currentPlayer, setCurrentPlayer] =
    useState<Player>("X");

  const [winner, setWinner] =
    useState<Player | null>(null);

  const [isDraw, setIsDraw] =
    useState(false);

  const [gameMode, setGameMode] =
    useState<GameMode>("human-human");

  const [isAIThinking, setIsAIThinking] =
    useState(false);

  const isGameOver =
    winner !== null || isDraw;

  const [difficulty, setDifficulty] = useState<Difficulty>("hard");

  const handleAIMove = async (
    updatedBoard: typeof board,
  ) => {
    try {
      setIsAIThinking(true);

      const aiMove =
            await getAIMove(
                updatedBoard,
                difficulty,
            );

      if (
        aiMove === null ||
        aiMove === undefined
      ) {
        return;
      }

      const boardAfterAI =
        makeMove(
          updatedBoard,
          aiMove,
          "O",
        );

      setBoard(boardAfterAI);

      const result =
        checkGameResult(
          boardAfterAI,
        );

      if (result.winner) {
        setWinner(
          result.winner,
        );
        return;
      }

      if (result.isDraw) {
        setIsDraw(true);
        return;
      }

      setCurrentPlayer("X");
    } catch (error) {
      console.error(
        "Failed to get AI move:",
        error,
      );
    } finally {
      setIsAIThinking(false);
    }
  };

  const handleCellClick = async (
    position: number,
  ) => {
    if (
      board[position] !== null ||
      isGameOver ||
      isAIThinking
    ) {
      return;
    }

    // Prevent O from being controlled
    // by human in Human vs AI mode
    if (
      gameMode === "human-ai" &&
      currentPlayer === "O"
    ) {
      return;
    }

    const updatedBoard =
      makeMove(
        board,
        position,
        currentPlayer,
      );

    setBoard(updatedBoard);

    const result =
      checkGameResult(
        updatedBoard,
      );

    if (result.winner) {
      setWinner(
        result.winner,
      );
      return;
    }

    if (result.isDraw) {
      setIsDraw(true);
      return;
    }

    // Human vs AI
    if (
      gameMode === "human-ai"
    ) {
      setCurrentPlayer("O");

      await handleAIMove(
        updatedBoard,
      );

      return;
    }

    // Human vs Human
    setCurrentPlayer(
      currentPlayer === "X"
        ? "O"
        : "X",
    );
  };

  const resetGame = () => {
    setBoard(
      createEmptyBoard(),
    );

    setCurrentPlayer("X");

    setWinner(null);

    setIsDraw(false);

    setIsAIThinking(false);
  };

  const handleGameModeChange = (
    value: string | null,
  ) => {
    if (!value) return;
    setGameMode(
      value as GameMode,
    );

    resetGame();
  };

  return (
    <div className="mx-auto max-w-5xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          Tic-Tac-Toe
        </h1>

        <p className="mt-2 text-muted-foreground">
          Challenge the AI using the
          Minimax algorithm.
        </p>
      </div>

      {/* Main Layout */}
      <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
        {/* Game Board */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-center gap-2 text-center">
                {winner ? (
                    `${winner} Wins!`
                ) : isDraw ? (
                    "It's a Draw!"
                ) : (
                    <>
                    <span>
                        {currentPlayer}'s Turn
                    </span>

                    {/* {isAIThinking && (
                        <span className="flex items-center gap-1 text-sm font-normal text-muted-foreground">
                        <span>AI thinking</span>

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
                    )} */}
                    </>
                )}
            </CardTitle>
          </CardHeader>

          <CardContent className="flex flex-col items-center gap-6 pb-8">
            {/* AI Thinking Indicator */}
            {/* {isAIThinking && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />

                AI is calculating
                the best move...
              </div>
            )} */}

            <TicTacToeBoard
              board={board}
              onCellClick={
                handleCellClick
              }
              disabled={
                isGameOver ||
                isAIThinking
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
            {/* Game Mode */}
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

            {gameMode === "human-ai" && (
            <div className="space-y-2">
                <p className="text-sm font-medium">
                AI Difficulty
                </p>

                <Select
                value={difficulty}
                onValueChange={(value) =>
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
                    Hard — Minimax
                    </SelectItem>
                </SelectContent>
                </Select>
            </div>
            )}

            {/* Current Player */}
            <div className="rounded-lg border p-4">
              <p className="text-sm text-muted-foreground">
                Current Player
              </p>

              <p className="mt-1 text-2xl font-bold">
                {currentPlayer}
              </p>
            </div>

            {/* AI Information */}
            {gameMode ===
              "human-ai" && (
              <div className="rounded-lg border bg-muted/30 p-4">
                <div className="flex items-center gap-2">
                  <Bot className="h-5 w-5" />

                  <span className="font-semibold">
                    Minimax AI
                  </span>
                </div>

                <p className="mt-2 text-sm text-muted-foreground">
                  You are X.
                  <br />
                  AI is O.
                </p>
              </div>
            )}

            {/* New Game */}
            <Button
              className="w-full"
              onClick={resetGame}
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

export default TicTacToe;