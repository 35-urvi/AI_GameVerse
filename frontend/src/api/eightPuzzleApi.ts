import axios from "axios";

import type {
  PuzzleBoard,
  PuzzleSolveResponse,
} from "@/types/eightPuzzle";


const API_URL =
  "http://127.0.0.1:8000";


export const solveEightPuzzle =
  async (
    board: PuzzleBoard,
  ): Promise<PuzzleSolveResponse> => {

    const response =
      await axios.post(
        `${API_URL}/api/games/8-puzzle/solve`,
        {
          board,
        },
      );

    return response.data;
  };