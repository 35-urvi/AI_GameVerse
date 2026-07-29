import axios from "axios";

import type {
  ConnectFourBoard,
  Difficulty,
} from "@/types/connectFour";


export const getConnectFourAIMove =
  async (
    board: ConnectFourBoard,
    difficulty: Difficulty,
  ): Promise<number | null> => {

    const response =
      await axios.post(
        "http://127.0.0.1:8000/api/games/connect-four/ai-move",
        {
          board,
          difficulty,
        },
      );

    return response.data.column;
  };