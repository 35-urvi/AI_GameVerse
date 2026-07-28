import type { Game } from "@/types/game";

export const games: Game[] = [
  {
    id: "tic-tac-toe",
    title: "Tic-Tac-Toe",
    description:
      "Challenge an intelligent AI opponent in the classic strategy game.",
    icon: "⭕",
    algorithms: ["Minimax", "Alpha-Beta Pruning"],
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
    algorithms: ["Minimax", "Alpha-Beta Pruning"],
    difficulty: "Medium",
    modes: ["AI vs Human", "AI vs AI"],
    category: "Board",
  },

  {
    id: "chess",
    title: "Chess",
    description:
      "Test your strategic thinking against an AI-powered chess opponent.",
    icon: "♟️",
    algorithms: ["Minimax", "Alpha-Beta Pruning"],
    difficulty: "Hard",
    modes: ["AI vs Human", "AI vs AI"],
    category: "Board",
  },

  {
    id: "sudoku",
    title: "Sudoku",
    description:
      "Solve challenging Sudoku puzzles using intelligent search techniques.",
    icon: "🧩",
    algorithms: ["Backtracking", "Constraint Satisfaction"],
    difficulty: "Medium",
    modes: ["Human vs Human"],
    category: "Puzzle",
  },

  {
    id: "8-puzzle",
    title: "8 Puzzle",
    description:
      "Solve the classic sliding puzzle using multiple search algorithms.",
    icon: "🧱",
    algorithms: ["BFS", "DFS", "IDDFS", "A*"],
    difficulty: "Medium",
    modes: ["AI vs Human", "AI vs AI"],
    category: "Puzzle",
  },

  {
    id: "maze-solver",
    title: "Maze Solver",
    description:
      "Watch AI algorithms find the optimal path through challenging mazes.",
    icon: "🗺️",
    algorithms: ["BFS", "DFS", "Dijkstra", "A*"],
    difficulty: "Easy",
    modes: ["AI vs AI"],
    category: "Search",
  },

  {
    id: "water-jug",
    title: "Water Jug",
    description:
      "Use intelligent search algorithms to solve the classic water jug problem.",
    icon: "💧",
    algorithms: ["BFS", "DFS"],
    difficulty: "Easy",
    modes: ["AI vs AI"],
    category: "Search",
  },

  {
    id: "othello",
    title: "Othello",
    description:
      "Capture territory and outsmart your opponent using strategic AI.",
    icon: "⚫",
    algorithms: ["Minimax", "Alpha-Beta Pruning"],
    difficulty: "Hard",
    modes: ["AI vs Human", "AI vs AI"],
    category: "Board",
  },

  {
    id: "checkers",
    title: "Checkers",
    description:
      "Jump, capture, and defeat your opponent with strategic AI gameplay.",
    icon: "🔴",
    algorithms: ["Minimax", "Alpha-Beta Pruning"],
    difficulty: "Medium",
    modes: ["AI vs Human", "AI vs AI"],
    category: "Board",
  },

  {
    id: "wumpus-world",
    title: "Wumpus World",
    description:
      "Navigate a dangerous world using knowledge-based artificial intelligence.",
    icon: "👁️",
    algorithms: ["Rule-Based AI", "Knowledge Base"],
    difficulty: "Hard",
    modes: ["AI vs AI"],
    category: "Search",
  },
];