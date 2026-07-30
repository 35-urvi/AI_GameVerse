import { useEffect, useState } from "react";
import { Brain, Dices, RotateCcw, Sparkles, Timer, Layers } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import BlockWorldBoard from "@/components/games/BlockWorld/BlockWorldBoard";

import {
  createBlockGame,
  resetBlockGame,
  moveBlock,
  solveBlockWorld,
} from "@/api/blockWorldApi";

import type { BlockGameState, BlockSolveResponse } from "@/types/blockWorld";

export default function BlockWorld() {
  const [game, setGame] = useState<BlockGameState | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSolving, setIsSolving] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [aiExplanation, setAiExplanation] = useState<string[]>([]);
  const [aiMoves, setAiMoves] = useState<string[]>([]);

  const startNewProblem = async () => {
    try {
      setIsLoading(true);
      const newGame = await createBlockGame();
      setGame(newGame);
      setSeconds(0);
      setAiExplanation([]);
      setAiMoves([]);
    } catch (error) {
      console.error("Failed to create new Block World problem:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetGame = async () => {
    try {
      setIsLoading(true);
      const resetState = await resetBlockGame();
      setGame(resetState);
      setSeconds(0);
      setAiExplanation([]);
      setAiMoves([]);
    } catch (error) {
      console.error("Failed to reset Block World:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSolveWithAI = async () => {
    if (!game || game.is_solved || isSolving) return;

    try {
      setIsSolving(true);
      setAiExplanation([]);
      setAiMoves([]);

      const result: BlockSolveResponse = await solveBlockWorld();
      setAiExplanation(result.explanation || []);
      setAiMoves(result.moves || []);

      if (result.solution_states.length <= 1) {
        alert("Already at goal configuration or no moves required!");
        return;
      }

      /* Animate Goal Stack Planning solution trajectory */
      for (let i = 1; i < result.solution_states.length; i++) {
        await new Promise((resolve) => setTimeout(resolve, 700));

        const nextStep = result.solution_states[i];
        setGame((prev) => {
          if (!prev) return null;
          return {
            ...prev,
            stacks: nextStep.stacks,
            holding: nextStep.holding,
            moves_count: i,
            is_solved: i === result.solution_states.length - 1,
          };
        });
      }
    } catch (error) {
      console.error("Failed to solve Block World with Goal Stack Planning:", error);
    } finally {
      setIsSolving(false);
    }
  };

  /* Timer effect */
  useEffect(() => {
    if (!game || game.is_solved || isSolving) return;

    const timer = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [game, isSolving]);

  useEffect(() => {
    startNewProblem();
  }, []);

  const handleBlockClick = async (block: string, stackIndex: number) => {
    if (!game || game.is_solved || isSolving) return;

    try {
      const stack = game.stacks[stackIndex];
      const isTopOnTable = stack.length === 1;

      const action = isTopOnTable ? "pickup" : "unstack";
      const target = isTopOnTable ? undefined : stack[stack.length - 2];

      const updated = await moveBlock(action, block, target);
      setGame(updated);
    } catch (error) {
      console.error("Failed move block:", error);
    }
  };

  const handleTableClick = async () => {
    if (!game || !game.holding || game.is_solved || isSolving) return;

    try {
      const updated = await moveBlock("putdown", game.holding);
      setGame(updated);
    } catch (error) {
      console.error("Failed putdown block:", error);
    }
  };

  const handleStackClick = async (targetBlock: string) => {
    if (!game || !game.holding || game.is_solved || isSolving) return;

    try {
      const updated = await moveBlock("stack", game.holding, targetBlock);
      setGame(updated);
    } catch (error) {
      console.error("Failed stack block:", error);
    }
  };

  const formatTime = () => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  };

  if (isLoading || !game) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-muted-foreground">Creating Block World problem...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-primary/10 p-3">
            <Layers className="h-7 w-7 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Block World</h1>
            <p className="mt-1 text-muted-foreground">
              Rearrange blocks to match the target configuration manually or solve with AI using Goal Stack Planning.
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
              {game.is_solved
                ? "🎉 Target Goal Achieved!"
                : isSolving
                ? "🤖 Goal Stack Planner is solving..."
                : "Rearrange Blocks to Target Goal"}
            </CardTitle>
          </CardHeader>

          <CardContent className="flex flex-col items-center gap-6 pb-8">
            <BlockWorldBoard
              game={game}
              onBlockClick={handleBlockClick}
              onTableClick={handleTableClick}
              onStackClick={handleStackClick}
              disabled={isSolving}
            />
          </CardContent>
        </Card>

        {/* Game Controls */}
        <Card>
          <CardHeader>
            <CardTitle>Game Settings</CardTitle>
          </CardHeader>

          <CardContent className="space-y-5">
            {/* Moves */}
            <div className="rounded-lg border p-4">
              <p className="text-sm text-muted-foreground">Moves</p>
              <p className="mt-1 text-2xl font-bold">{game.moves_count}</p>
            </div>

            {/* Timer */}
            <div className="rounded-lg border p-4">
              <div className="flex items-center gap-2">
                <Timer className="h-4 w-4" />
                <p className="text-sm text-muted-foreground">Time</p>
              </div>
              <p className="mt-1 text-2xl font-bold">{formatTime()}</p>
            </div>

            {/* AI Algorithm Info */}
            <div className="rounded-lg border bg-muted/30 p-4">
              <div className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-primary" />
                <span className="font-semibold">Goal Stack Planning</span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                AI decomposes complex block goals into subgoals using STRIPS operators and a goal stack.
              </p>
            </div>

            {/* New Problem */}
            <Button
              variant="outline"
              className="w-full"
              onClick={startNewProblem}
              disabled={isSolving}
            >
              <Dices className="mr-2 h-4 w-4" />
              New Problem
            </Button>

            {/* Solve with AI */}
            <Button
              className="w-full"
              onClick={handleSolveWithAI}
              disabled={isSolving || game.is_solved}
            >
              <Sparkles className="mr-2 h-4 w-4" />
              {isSolving ? "Goal Stack Solving..." : "Solve with AI"}
            </Button>

            {/* Reset */}
            <Button
              variant="outline"
              className="w-full"
              onClick={handleResetGame}
              disabled={isSolving}
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset Game
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* AI Solution Plan Steps */}
      {aiMoves.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Goal Stack Planning Execution Path</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {aiMoves.map((m, idx) => (
                <div key={idx} className="rounded-lg border bg-primary/5 px-3 py-2 text-sm font-medium text-primary">
                  Step {idx + 1}: {m}
                </div>
              ))}
            </div>

            {aiExplanation.length > 0 && (
              <div className="mt-4 rounded-xl border bg-muted/40 p-4 space-y-2 text-xs font-mono">
                <p className="font-bold text-sm font-sans mb-2">Stack Planner Trace:</p>
                {aiExplanation.map((exp, idx) => (
                  <p key={idx} className="text-muted-foreground">
                    • {exp}
                  </p>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
