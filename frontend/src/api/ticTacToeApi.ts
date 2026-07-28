import axios from "axios";

import type {
  Board,
  Difficulty,
} from "@/types/ticTacToe";


const API_BASE_URL =
  "http://127.0.0.1:8000";


export async function getAIMove(
  board: Board,
  difficulty: Difficulty,
): Promise<number | null> {

  const response =
    await axios.post(
      `${API_BASE_URL}/api/games/tic-tac-toe/ai-move`,
      {
        board,
        difficulty,
      },
    );

  return response.data.move;
}