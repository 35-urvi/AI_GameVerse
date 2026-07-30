import type { Game } from "@/types/game";

export const games: Game[] = [
  {
    id: "tic-tac-toe",
    title: "Tic-Tac-Toe",
    description:
      "Challenge an intelligent AI opponent in the classic strategy game.",
    icon: "⭕",
    algorithms: ["Minimax"],
    difficulty: "Easy",
    modes: ["AI vs Human", "AI vs AI", "Human vs Human"],
    category: "Board",
  },

  {
    id: "connect-four",
    title: "Connect Four",
    description:
      "Build your strategy and connect four pieces before your opponent.",
    icon: "🔴",
    algorithms: ["Alpha-Beta Pruning"],
    difficulty: "Medium",
    modes: ["AI vs Human", "AI vs AI"],
    category: "Board",
  },
  {
    id: "8-puzzle",
    title: "8 Puzzle",
    description:
      "Solve the classic sliding puzzle using multiple search algorithms.",
    icon: "🧱",
    algorithms: ["A*"],
    difficulty: "Medium",
    modes: ["AI vs Human", "AI vs AI"],
    category: "Puzzle",
  },
  {
    id: "water-jug",
    title: "Water Jug",
    description:
      "Use intelligent search algorithms to solve the classic water jug problem.",
    icon: "💧",
    algorithms: ["BFS"],
    difficulty: "Easy",
    modes: ["AI vs AI"],
    category: "Search",
  },
  {
    id: "wumpus-world",
    title: "Wumpus World",
    description:
      "Navigate a dangerous world using knowledge-based artificial intelligence.",
    icon: "👁️",
    algorithms: ["Knowledge Base"],
    difficulty: "Hard",
    modes: ["AI vs AI"],
    category: "Search",
  },

  {
    id: "block-world",
    title: "Block World",
    description:
      "Rearrange blocks to match the target configuration using Goal Stack Planning.",
    icon: "📦",
    algorithms: ["Goal Stack Planning"],
    difficulty: "Medium",
    modes: ["AI vs Human", "AI vs AI"],
    category: "Search",
  },
];