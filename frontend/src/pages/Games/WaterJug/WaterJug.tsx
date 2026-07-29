import {
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

import WaterJugBoard from "@/components/games/WaterJug/WaterJugBoard";

import {
  solveWaterJug,
} from "@/api/waterJugApi";

import type {
  WaterJugState,
} from "@/types/waterJug";


const INITIAL_JUG_A_CAPACITY = 4;

const INITIAL_JUG_B_CAPACITY = 3;

const INITIAL_TARGET = 2;


const INITIAL_STATE: WaterJugState = {
  jug_a: 0,
  jug_b: 0,
};


function WaterJug() {

  const [
    jugACapacity,
    setJugACapacity,
    ] = useState(
    INITIAL_JUG_A_CAPACITY,
    );

    const [
    jugBCapacity,
    setJugBCapacity,
    ] = useState(
    INITIAL_JUG_B_CAPACITY,
    );

    const [
    target,
    setTarget,
    ] = useState(
    INITIAL_TARGET,
    );


  const [
    state,
    setState,
  ] = useState<WaterJugState>(
    INITIAL_STATE,
  );


  const [
    initialState,
    setInitialState,
  ] = useState<WaterJugState>(
    INITIAL_STATE,
  );


  const [
    moves,
    setMoves,
  ] = useState<string[]>([]);


  const [
    currentStep,
    setCurrentStep,
  ] = useState(0);


  const [
    isSolving,
    setIsSolving,
  ] = useState(false);


  const [
    isSolved,
    setIsSolved,
  ] = useState(false);


  const addManualMove = (
    nextState: WaterJugState,
    move: string,
    ) => {
    setState(nextState);

    setMoves((previousMoves) => [
        ...previousMoves,
        move,
    ]);

    setCurrentStep(
        (previousStep) =>
        previousStep + 1,
    );

    setIsSolved(
        nextState.jug_a === target ||
        nextState.jug_b === target,
    );
    };

    const gcd = (
        a: number,
        b: number,
        ): number => {
        while (b !== 0) {
            const temp = b;
            b = a % b;
            a = temp;
        }

        return a;
        };

    const generateNewProblem = () => {
        let newJugA: number;
        let newJugB: number;
        let newTarget: number;

        do {
            newJugA =
            Math.floor(
                Math.random() * 6,
            ) + 3;

            newJugB =
            Math.floor(
                Math.random() * 5,
            ) + 2;

            /*
            * Target must be smaller than
            * both jug capacities.
            */
            const maxTarget =
            Math.min(
                newJugA,
                newJugB,
            ) - 1;

            newTarget =
            Math.floor(
                Math.random() *
                maxTarget,
            ) + 1;

        } while (
            /*
            * Target must be achievable
            * using the two jug capacities.
            */
            newTarget %
            gcd(
                newJugA,
                newJugB,
            ) !==
            0
        );


        setJugACapacity(
            newJugA,
        );

        setJugBCapacity(
            newJugB,
        );

        setTarget(
            newTarget,
        );


        const newInitialState: WaterJugState = {
            jug_a: 0,
            jug_b: 0,
        };


        setState(
            newInitialState,
        );

        setInitialState(
            newInitialState,
        );

        setMoves([]);

        setCurrentStep(0);

        setIsSolved(false);

        setIsSolving(false);
        };



    const fillJugA = () => {
    if (isSolving || isSolved) return;

    addManualMove(
        {
        jug_a: jugACapacity,
        jug_b: state.jug_b,
        },
        "Fill Jug A",
    );
    };


    const fillJugB = () => {
    if (isSolving || isSolved) return;

    addManualMove(
        {
        jug_a: state.jug_a,
        jug_b: jugBCapacity,
        },
        "Fill Jug B",
    );
    };


    const emptyJugA = () => {
    if (isSolving || isSolved) return;

    addManualMove(
        {
        jug_a: 0,
        jug_b: state.jug_b,
        },
        "Empty Jug A",
    );
    };


    const emptyJugB = () => {
    if (isSolving || isSolved) return;

    addManualMove(
        {
        jug_a: state.jug_a,
        jug_b: 0,
        },
        "Empty Jug B",
    );
    };


    const pourAtoB = () => {
    if (isSolving || isSolved) return;

    const transfer = Math.min(
        state.jug_a,
        jugBCapacity - state.jug_b,
    );

    if (transfer === 0) return;

    addManualMove(
        {
        jug_a:
            state.jug_a - transfer,

        jug_b:
            state.jug_b + transfer,
        },
        "Pour A → B",
    );
    };


    const pourBtoA = () => {
    if (isSolving || isSolved) return;

    const transfer = Math.min(
        state.jug_b,
        jugACapacity - state.jug_a,
    );

    if (transfer === 0) return;

    addManualMove(
        {
        jug_a:
            state.jug_a + transfer,

        jug_b:
            state.jug_b - transfer,
        },
        "Pour B → A",
    );
};

  /*
   * Reset current problem
   */
  const resetGame = () => {

    setState(
      initialState,
    );

    setMoves([]);

    setCurrentStep(0);

    setIsSolved(false);

    setIsSolving(false);
  };


  /*
   * Solve using BFS
   */
  const handleSolve = async () => {

    try {

      setIsSolving(true);

      setMoves([]);
      setCurrentStep(0);
      setIsSolved(false);

      const result =
        await solveWaterJug(
          jugACapacity,
          jugBCapacity,
          target,
        );


      if (
        result.solution.length === 0
      ) {

        alert(
          "This Water Jug problem cannot be solved.",
        );

        return;
      }


      setMoves(
        result.moves,
      );


      /*
       * Save starting state
       */
      setInitialState(
        result.solution[0],
      );


      /*
       * Animate BFS solution
       */
      for (
        let i = 0;
        i <
        result.solution.length;
        i++
      ) {

        await new Promise(
          (resolve) =>
            setTimeout(
              resolve,
              700,
            ),
        );


        setState(
          result.solution[i],
        );

        setCurrentStep(i);
      }


      setIsSolved(true);

    } catch (error) {

      console.error(
        "Failed to solve Water Jug:",
        error,
      );

    } finally {

      setIsSolving(false);
    }
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
              Water Jug Problem
            </h1>

            <p className="mt-1 text-muted-foreground">
              Solve the classic Water Jug
              Problem using BFS.
            </p>

          </div>

        </div>

      </div>


      {/* Main Layout */}
      <div className="grid gap-6 lg:grid-cols-[1fr_300px]">


        {/* Board */}
        <Card>

          <CardHeader>

            <CardTitle className="text-center">

              {isSolved
                ? "🎉 Target Reached!"
                : isSolving
                  ? "🤖 BFS is solving..."
                  : `Target: ${target} Liters`}

            </CardTitle>

          </CardHeader>


          <CardContent className="flex min-h-[400px] flex-col items-center justify-center gap-8 pb-8">

            <WaterJugBoard
              state={state}
              jugACapacity={
                jugACapacity
              }
              jugBCapacity={
                jugBCapacity
              }
            />

          </CardContent>

        </Card>


        {/* Controls */}
        <Card>

          <CardHeader>

            <CardTitle>
              Game Settings
            </CardTitle>

          </CardHeader>


          <CardContent className="space-y-5">


            {/* Problem Information */}
            <div className="rounded-lg border p-4">

              <p className="text-sm text-muted-foreground">
                Problem
              </p>

              <div className="mt-3 space-y-2">

                <div className="flex justify-between">

                  <span>
                    Jug A
                  </span>

                  <span className="font-semibold">
                    {jugACapacity} L
                  </span>

                </div>


                <div className="flex justify-between">

                  <span>
                    Jug B
                  </span>

                  <span className="font-semibold">
                    {jugBCapacity} L
                  </span>

                </div>


                <div className="flex justify-between">

                  <span>
                    Target
                  </span>

                  <span className="font-semibold">
                    {target} L
                  </span>

                </div>

              </div>

            </div>


            {/* Current Step */}
            <div className="rounded-lg border p-4">

              <p className="text-sm text-muted-foreground">
                Current Step
              </p>

              <p className="mt-1 text-2xl font-bold">

                {currentStep}

              </p>

            </div>


            {/* Algorithm */}
            <div className="rounded-lg border bg-muted/30 p-4">

              <div className="flex items-center gap-2">

                <Brain className="h-5 w-5" />

                <span className="font-semibold">
                  BFS Algorithm
                </span>

              </div>


              <p className="mt-2 text-sm text-muted-foreground">

                Breadth-First Search explores
                all possible states level by
                level to find the shortest
                solution.

              </p>

            </div>

            <Button
                variant="outline"
                className="w-full"
                onClick={
                    generateNewProblem
                }
                disabled={
                    isSolving
                }
                >
                <Dices className="mr-2 h-4 w-4" />

                New Problem
            </Button>

            {/* Manual Play */}
            <div className="space-y-3">

            <p className="text-sm font-medium">
                Manual Play
            </p>

            <div className="grid grid-cols-2 gap-2">

                <Button
                variant="outline"
                onClick={fillJugA}
                disabled={
                    isSolving ||
                    isSolved ||
                    state.jug_a === jugACapacity
                }
                >
                Fill Jug A
                </Button>

                <Button
                variant="outline"
                onClick={fillJugB}
                disabled={
                    isSolving ||
                    isSolved ||
                    state.jug_b === jugBCapacity
                }
                >
                Fill Jug B
                </Button>

                <Button
                variant="outline"
                onClick={emptyJugA}
                disabled={
                    isSolving ||
                    isSolved ||
                    state.jug_a === 0
                }
                >
                Empty Jug A
                </Button>

                <Button
                variant="outline"
                onClick={emptyJugB}
                disabled={
                    isSolving ||
                    isSolved ||
                    state.jug_b === 0
                }
                >
                Empty Jug B
                </Button>

                <Button
                variant="outline"
                onClick={pourAtoB}
                disabled={
                    isSolving ||
                    isSolved ||
                    state.jug_a === 0 ||
                    state.jug_b === jugBCapacity
                }
                >
                A → B
                </Button>

                <Button
                variant="outline"
                onClick={pourBtoA}
                disabled={
                    isSolving ||
                    isSolved ||
                    state.jug_b === 0 ||
                    state.jug_a === jugACapacity
                }
                >
                B → A
                </Button>

            </div>

            </div>


            {/* Solve */}
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
                ? "BFS is Solving..."
                : "Solve with BFS"}

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

              Reset

            </Button>


          </CardContent>

        </Card>

      </div>


      {/* Solution History */}
      {moves.length > 0 && (

        <Card className="mt-6">

          <CardHeader>

            <CardTitle>
              BFS Solution Path
            </CardTitle>

          </CardHeader>


          <CardContent>

            <div className="flex flex-wrap gap-2">

              {moves.map(
                (
                  move,
                  index,
                ) => (

                  <div
                    key={index}
                    className={`
                      rounded-lg
                      border
                      px-3
                      py-2
                      text-sm
                      transition
                      ${
                        index <
                        currentStep
                          ? "bg-primary/10"
                          : ""
                      }
                    `}
                  >

                    <span className="mr-2 font-semibold">
                      {index + 1}.
                    </span>

                    {move}

                  </div>

                ),
              )}

            </div>

          </CardContent>

        </Card>

      )}

    </div>
  );
}


export default WaterJug;