export type ConnectFourCell =
  | 0
  | 1
  | 2;

export type ConnectFourBoard =
  ConnectFourCell[][];

export type ConnectFourPlayer =
  1
  | 2;

export type GameMode =
  | "human-human"
  | "human-ai";

export type Difficulty =
  | "easy"
  | "hard";

export const ROWS = 6;

export const COLUMNS = 7;

export const EMPTY = 0;

export const PLAYER: ConnectFourPlayer = 1;

export const AI: ConnectFourPlayer = 2;