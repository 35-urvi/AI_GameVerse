import { useMemo, useState, useEffect } from "react";
import { Gamepad2, Search, SlidersHorizontal, Sparkles, Brain, Zap, Layers } from "lucide-react";
import { useSearchParams, useNavigate } from "react-router-dom";

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

function Games() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [category, setCategory] = useState("all");
  const [difficulty, setDifficulty] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    const urlSearch = searchParams.get("search");
    if (urlSearch !== null && urlSearch !== search) {
      setSearch(urlSearch);
    }
  }, [searchParams]);

  const filteredGames = useMemo(() => {
    return games.filter((game) => {
      const matchesSearch =
        game.title.toLowerCase().includes(search.toLowerCase()) ||
        game.description.toLowerCase().includes(search.toLowerCase()) ||
        game.algorithms.some((algorithm) =>
          algorithm.toLowerCase().includes(search.toLowerCase())
        );

      const matchesCategory =
        category === "all" ||
        game.category.toLowerCase() === category.toLowerCase();

      const matchesDifficulty =
        difficulty === "all" || game.difficulty === difficulty;

      return matchesSearch && matchesCategory && matchesDifficulty;
    });
  }, [search, category, difficulty]);

  const handleGameSelect = (gameId: string) => {
    navigate(`/games/${gameId}`);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Hero Banner Section */}
      <section className="relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/10 via-purple-500/10 to-indigo-500/10 p-8 md:p-12 shadow-2xl backdrop-blur-xl">
        {/* Glow Spheres */}
        <div className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-primary/20 blur-3xl" />
        <div className="pointer-events-none absolute -left-20 -bottom-20 h-80 w-80 rounded-full bg-purple-500/15 blur-3xl" />

        <div className="relative z-10 max-w-3xl space-y-4">
          {/* <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            AI Algorithm & Problem Solving Arena
          </div> */}

          <h1 className="text-3xl font-black tracking-tight sm:text-5xl lg:text-6xl">
            Welcome to{" "}
            <span className="bg-gradient-to-r from-primary via-purple-500 to-indigo-500 bg-clip-text text-transparent">
              AI GameVerse
            </span>
          </h1>

          <p className="text-base text-muted-foreground sm:text-lg leading-relaxed">
            Challenge intelligent AI agents, visualize real-time search trees, and explore state-of-the-art problem solving algorithms.
          </p>

          {/* Quick Statistics Bar */}
          {/* <div className="pt-4 flex flex-wrap items-center gap-4 text-xs">
            <div className="flex items-center gap-2 rounded-2xl border border-border/60 bg-card/60 px-4 py-2 backdrop-blur-md shadow-sm">
              <Gamepad2 className="h-4 w-4 text-primary" />
              <span className="font-bold text-foreground">{games.length} Interactive Games</span>
            </div>

            <div className="flex items-center gap-2 rounded-2xl border border-border/60 bg-card/60 px-4 py-2 backdrop-blur-md shadow-sm">
              <Brain className="h-4 w-4 text-purple-500" />
              <span className="font-bold text-foreground">15+ AI Solvers & Heuristics</span>
            </div>

            <div className="flex items-center gap-2 rounded-2xl border border-border/60 bg-card/60 px-4 py-2 backdrop-blur-md shadow-sm">
              <Zap className="h-4 w-4 text-amber-500" />
              <span className="font-bold text-foreground">Instant Step Trajectories</span>
            </div>
          </div> */}
        </div>
      </section>

      {/* Filter and Search Bar */}
      <section className="flex flex-col gap-4 rounded-2xl border border-border/60 bg-card/70 p-4 backdrop-blur-xl shadow-lg md:flex-row md:items-center">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              if (!e.target.value) {
                searchParams.delete("search");
                setSearchParams(searchParams);
              }
            }}
            placeholder="Search games by name or algorithm (e.g. Minimax, A*, BFS)..."
            className="pl-10 h-10 rounded-xl bg-background/60 border-border/60 focus-visible:ring-primary/40 text-sm"
          />
        </div>

        {/* Category Pills */}
        <Select
          value={category}
          onValueChange={(value) => setCategory(value ?? "all")}
        >
          <SelectTrigger className="w-full md:w-48 h-10 rounded-xl bg-background/60 border-border/60 text-sm font-medium">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent className="rounded-xl border-border/60 backdrop-blur-xl">
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="board">Board Games</SelectItem>
            <SelectItem value="puzzle">Puzzles</SelectItem>
            <SelectItem value="search">Search Problems</SelectItem>
          </SelectContent>
        </Select>

        {/* Difficulty Filter */}
        <Select
          value={difficulty}
          onValueChange={(value) => setDifficulty(value ?? "all")}
        >
          <SelectTrigger className="w-full md:w-44 h-10 rounded-xl bg-background/60 border-border/60 text-sm font-medium">
            <SelectValue placeholder="Difficulty" />
          </SelectTrigger>
          <SelectContent className="rounded-xl border-border/60 backdrop-blur-xl">
            <SelectItem value="all">All Difficulties</SelectItem>
            <SelectItem value="Easy">Easy</SelectItem>
            <SelectItem value="Medium">Medium</SelectItem>
            <SelectItem value="Hard">Hard</SelectItem>
          </SelectContent>
        </Select>

        {/* Reset Button */}
        {(search || category !== "all" || difficulty !== "all") && (
          <Button
            variant="outline"
            className="h-10 rounded-xl border-border/60 hover:bg-muted font-medium text-xs gap-1.5"
            onClick={() => {
              setSearch("");
              setCategory("all");
              setDifficulty("all");
              setSearchParams({});
            }}
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            Reset Filters
          </Button>
        )}
      </section>

      {/* Header Result Count */}
      <div className="flex items-center justify-between px-1">
        <div>
          <h2 className="text-2xl font-black tracking-tight flex items-center gap-2">
            <Layers className="h-5 w-5 text-primary" />
            Games Arena Catalog
          </h2>
          <p className="text-xs text-muted-foreground">
            {filteredGames.length} {filteredGames.length === 1 ? "game" : "games"} available to play
          </p>
        </div>
      </div>

      {/* Game Cards Grid */}
      {filteredGames.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
          {filteredGames.map((game) => (
            <GameCard
              key={game.id}
              title={game.title}
              description={game.description}
              algorithm={game.algorithms.join(" + ")}
              icon={game.icon}
              difficulty={game.difficulty}
              category={game.category}
              onPlay={() => handleGameSelect(game.id)}
            />
          ))}
        </div>
      ) : (
        <div className="flex min-h-[320px] flex-col items-center justify-center rounded-3xl border border-dashed border-border/80 bg-card/30 p-8 text-center backdrop-blur-md">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-4">
            <Gamepad2 className="h-8 w-8" />
          </div>
          <h3 className="text-lg font-extrabold">No games match your query</h3>
          <p className="mt-1.5 max-w-sm text-xs text-muted-foreground">
            Try adjusting your search terms or clearing your category and difficulty filters.
          </p>
          <Button
            variant="outline"
            size="sm"
            className="mt-5 rounded-full"
            onClick={() => {
              setSearch("");
              setCategory("all");
              setDifficulty("all");
              setSearchParams({});
            }}
          >
            Clear All Filters
          </Button>
        </div>
      )}
    </div>
  );
}

export default Games;