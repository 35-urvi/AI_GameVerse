import {
  Gamepad2,
  Sparkles,
  Target,
  Trophy,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import GameCard from "@/components/common/GameCard";

const games = [
  {
    title: "Tic-Tac-Toe",
    description:
      "Challenge an intelligent AI opponent in the classic strategy game.",
    algorithm: "Minimax + Alpha-Beta Pruning",
    icon: "⭕",
  },
  {
    title: "Connect Four",
    description:
      "Build your strategy and connect four pieces before your opponent.",
    algorithm: "Minimax + Alpha-Beta Pruning",
    icon: "🔴",
  },
  {
    title: "Chess",
    description:
      "Test your strategic thinking against an AI-powered chess opponent.",
    algorithm: "Minimax + Alpha-Beta Pruning",
    icon: "♟️",
  },
  {
    title: "Sudoku",
    description:
      "Solve challenging Sudoku puzzles using intelligent search techniques.",
    algorithm: "Backtracking + CSP",
    icon: "🧩",
  },
];

const stats = [
  {
    title: "Available Games",
    value: "10",
    description: "AI-powered games",
    icon: Gamepad2,
  },
  {
    title: "Games Played",
    value: "0",
    description: "Start your journey",
    icon: Target,
  },
  {
    title: "Victories",
    value: "0",
    description: "Your AI wins",
    icon: Trophy,
  },
];

function Dashboard() {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl border bg-gradient-to-br from-primary/10 via-background to-purple-500/10 p-8 md:p-10">
        {/* Decorative background */}
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />

        <div className="relative">
          <div className="mb-4 flex items-center gap-2 text-sm font-medium text-primary">
            <Sparkles className="h-4 w-4" />
            AI-Powered Gaming
          </div>

          <h1 className="max-w-2xl text-3xl font-bold tracking-tight md:text-5xl">
            Welcome to{" "}
            <span className="bg-gradient-to-r from-primary via-purple-500 to-blue-500 bg-clip-text text-transparent">
              AI GameVerse
            </span>
          </h1>

          <p className="mt-4 max-w-2xl text-base text-muted-foreground md:text-lg">
            Explore intelligent games, challenge powerful AI algorithms,
            and sharpen your problem-solving skills.
          </p>
        </div>
      </section>

      {/* Statistics */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <Card
              key={stat.title}
              className="border-border/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <CardContent className="flex items-center gap-4 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                  <Icon className="h-6 w-6 text-primary" />
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">
                    {stat.title}
                  </p>

                  <p className="text-2xl font-bold">
                    {stat.value}
                  </p>

                  <p className="text-xs text-muted-foreground">
                    {stat.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </section>

      {/* Games */}
      <section>
        <div className="mb-6">
          <h2 className="text-2xl font-bold">
            Featured Games
          </h2>

          <p className="mt-1 text-muted-foreground">
            Choose a game and put your AI skills to the test.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {games.map((game) => (
            <GameCard
              key={game.title}
              title={game.title}
              description={game.description}
              algorithm={game.algorithm}
              icon={game.icon}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

export default Dashboard;