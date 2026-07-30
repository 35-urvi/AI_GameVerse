export interface BlockGameState {
  stacks: string[][];
  holding: string | null;
  initial_stacks: string[][];
  goal_stacks: string[][];
  moves_count: number;
  is_solved: boolean;
}

export interface BlockSolveResponse {
  moves: string[];
  solution_states: Array<{
    stacks: string[][];
    holding: string | null;
  }>;
  explanation: string[];
}
