export interface WumpusPosition {
  row: number;
  column: number;
}


export interface WumpusGameState {
  size: number;

  player: WumpusPosition;

  visited: boolean[][];

  safe_cells: boolean[][];

  breeze: boolean[][];

  stench: boolean[][];

  glitter: boolean[][];

  has_gold: boolean;

  game_over: boolean;

  won: boolean;

  score: number;

  game_over_reason: string | null;
}