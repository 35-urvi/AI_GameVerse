import axios from "axios";
import type { BlockGameState, BlockSolveResponse } from "@/types/blockWorld";

const API_URL = "http://127.0.0.1:8000/api/games/block-world";

export const createBlockGame = async (): Promise<BlockGameState> => {
  const response = await axios.post(`${API_URL}/new`);
  return response.data.game;
};

export const resetBlockGame = async (): Promise<BlockGameState> => {
  const response = await axios.post(`${API_URL}/reset`);
  return response.data.game;
};

export const moveBlock = async (
  action: "pickup" | "unstack" | "putdown" | "stack",
  block: string,
  target?: string,
): Promise<BlockGameState> => {
  const response = await axios.post(`${API_URL}/move`, {
    action,
    block,
    target,
  });
  return response.data.game;
};

export const solveBlockWorld = async (): Promise<BlockSolveResponse> => {
  const response = await axios.post(`${API_URL}/solve`);
  return response.data;
};
