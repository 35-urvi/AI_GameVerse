import axios from "axios";

import type {
  WumpusGameState,
} from "@/types/wumpusWorld";


const API_URL =
  "http://127.0.0.1:8000/api/games/wumpus-world";


export const createWumpusGame =
  async (): Promise<WumpusGameState> => {

    const response =
      await axios.post(
        `${API_URL}/new`,
      );

    return response.data.game;
  };


export const resetWumpusGame =
  async (): Promise<WumpusGameState> => {

    const response =
      await axios.post(
        `${API_URL}/reset`,
      );

    return response.data.game;
  };


export const moveWumpusPlayer =
  async (
    direction:
      | "up"
      | "down"
      | "left"
      | "right",
  ): Promise<WumpusGameState> => {

    const response =
      await axios.post(
        `${API_URL}/move`,
        {
          direction,
        },
      );

    return response.data.game;
  };

export const solveWumpusWorld =
  async (): Promise<string[]> => {

    const response =
      await axios.post(
        `${API_URL}/solve`,
      );

    return response.data.moves;
  };