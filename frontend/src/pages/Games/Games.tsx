import { useMemo, useState } from "react";
import { Gamepad2, Search, SlidersHorizontal } from "lucide-react";

import { games } from "@/data/games";
import GameCard from "@/components/common/GameCard";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNavigate } from "react-router-dom";

function Games() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [difficulty, setDifficulty] = useState("all");
  const navigate = useNavigate();

  const filteredGames = useMemo(() => {
    return games.filter((game) => {
      const matchesSearch =
        game.title
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        game.description
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        game.algorithms.some((algorithm) =>
          algorithm
            .toLowerCase()
            .includes(search.toLowerCase()),
        );

      const matchesCategory =
        category === "all" ||
        game.category.toLowerCase() === category.toLowerCase();

      const matchesDifficulty =
        difficulty === "all" ||
        game.difficulty === difficulty;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesDifficulty
      );
    });
  }, [search, category, difficulty]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <section className="relative overflow-hidden rounded-3xl border bg-gradient-to-br from-primary/10 via-background to-purple-500/10 p-8">
        <div className="relative">
          <div className="mb-3 flex items-center gap-2 text-sm font-medium text-primary">
            <Gamepad2 className="h-4 w-4" />
            AI Game Library
          </div>

          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            Explore AI Games
          </h1>

          <p className="mt-3 max-w-2xl text-muted-foreground">
            Choose a game, explore different artificial intelligence
            algorithms, and challenge yourself against intelligent systems.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="flex flex-col gap-4 rounded-2xl border bg-card/50 p-4 backdrop-blur md:flex-row">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

          <Input
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search games, algorithms..."
            className="pl-9"
          />
        </div>

        {/* Category */}
        <Select
          value={category}
          onValueChange={(value) =>
            setCategory(value ?? "all")
          }
        >
          <SelectTrigger className="w-full md:w-44">
            <SelectValue placeholder="Category" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">
              All Categories
            </SelectItem>

            <SelectItem value="board">
              Board Games
            </SelectItem>

            <SelectItem value="puzzle">
              Puzzles
            </SelectItem>

            <SelectItem value="search">
              Search Problems
            </SelectItem>
          </SelectContent>
        </Select>

        {/* Difficulty */}
        <Select
          value={difficulty}
          onValueChange={(value) =>
            setDifficulty(value ?? "all")
          }
        >
          <SelectTrigger className="w-full md:w-44">
            <SelectValue placeholder="Difficulty" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">
              All Difficulties
            </SelectItem>

            <SelectItem value="Easy">
              Easy
            </SelectItem>

            <SelectItem value="Medium">
              Medium
            </SelectItem>

            <SelectItem value="Hard">
              Hard
            </SelectItem>
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          onClick={() => {
            setSearch("");
            setCategory("all");
            setDifficulty("all");
          }}
        >
          <SlidersHorizontal className="mr-2 h-4 w-4" />
          Reset
        </Button>
      </section>

      {/* Result count */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">
            Available Games
          </h2>

          <p className="text-sm text-muted-foreground">
            {filteredGames.length}{" "}
            {filteredGames.length === 1
              ? "game"
              : "games"}{" "}
            found
          </p>
        </div>
      </div>

      {/* Game Grid */}
      {filteredGames.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {filteredGames.map((game) => (
            <GameCard
              key={game.id}
              title={game.title}
              description={game.description}
              algorithm={game.algorithms.join(" + ")}
              icon={game.icon}
              difficulty={game.difficulty}
              category={game.category}
              onPlay={() => {
                if (game.id === "tic-tac-toe") {
                    navigate(
                    "/games/tic-tac-toe",
                    );
                }
            }}
            />
          ))}
        </div>
      ) : (
        <div className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-dashed">
          <Gamepad2 className="mb-4 h-10 w-10 text-muted-foreground" />

          <h3 className="text-lg font-semibold">
            No games found
          </h3>

          <p className="mt-1 text-sm text-muted-foreground">
            Try changing your search or filters.
          </p>
        </div>
      )}
    </div>
  );
}

export default Games;