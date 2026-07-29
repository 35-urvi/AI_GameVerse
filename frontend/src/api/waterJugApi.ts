import axios from "axios";

export interface WaterJugState {
  jug_a: number;
  jug_b: number;
}

export interface WaterJugSolveResponse {
  solution: WaterJugState[];
  moves: string[];
}

export const solveWaterJug = async (
  jugACapacity: number,
  jugBCapacity: number,
  target: number,
): Promise<WaterJugSolveResponse> => {

  const response =
    await axios.post<WaterJugSolveResponse>(
      "http://127.0.0.1:8000/api/games/water-jug/solve",
      {
        jug_a_capacity: jugACapacity,
        jug_b_capacity: jugBCapacity,
        target,
      },
    );

  return response.data;
};