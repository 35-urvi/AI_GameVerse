export type GameDifficulty = "Easy" | "Medium" | "Hard";

export type GameMode =
  | "AI vs Human"
  | "AI vs AI"
  | "Human vs Human";

export interface Game {
  id: string;
  title: string;
  description: string;
  icon: string;
  algorithms: string[];
  difficulty: GameDifficulty;
  modes: GameMode[];
  category: "Board" | "Puzzle" | "Search";
}