export type Player = "X" | "O";

export type Cell = Player | null;

export type Board = Cell[];

export type GameMode =
  | "human-ai"
  | "ai-ai"
  | "human-human";

export type Difficulty =
  | "easy"
  | "medium"
  | "hard";

export type AIAlgorithm =
  | "minimax"
  | "alpha-beta";

export interface TicTacToeSettings {
  mode: GameMode;
  difficulty: Difficulty;
  algorithm: AIAlgorithm;
}

export interface Move {
  player: Player;
  position: number;
  moveNumber: number;
}

export interface GameResult {
  winner: Player | null;
  isDraw: boolean;
}