import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Brain, Sparkles, Gamepad2, ShieldAlert } from "lucide-react";
import { games } from "@/data/games";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function GamePlaceholder() {
  const { gameId } = useParams<{ gameId: string }>();
  const game = games.find((g) => g.id === gameId);

  const title = game?.title || gameId?.replace("-", " ").toUpperCase() || "Game Arena";
  const icon = game?.icon || "🎮";
  const category = game?.category || "Interactive AI";
  const description = game?.description || "Explore intelligent algorithms solving complex strategic problems.";
  const algorithms = game?.algorithms || ["Artificial Intelligence", "Search Tree"];
  const difficulty = game?.difficulty || "Medium";

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Back button */}
      <div>
        <Link to="/games">
          <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
            Back to Games Arena
          </Button>
        </Link>
      </div>

      {/* Main Card */}
      <Card className="overflow-hidden border-border/60 bg-card/80 backdrop-blur-xl shadow-xl">
        <div className="h-2 bg-gradient-to-r from-primary via-purple-500 to-indigo-500" />
        
        <CardHeader className="p-8 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-primary/20 via-purple-500/10 to-indigo-500/20 text-5xl shadow-inner border border-primary/20">
              {icon}
            </div>

            <div className="space-y-2 flex-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <Badge variant="outline" className="border-primary/30 bg-primary/10 text-primary">
                  {category}
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  {difficulty} Difficulty
                </Badge>
              </div>

              <CardTitle className="text-3xl font-extrabold">{title}</CardTitle>
              <CardDescription className="text-base">{description}</CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-8 space-y-6 border-t bg-muted/20">
          {/* Algorithms Used */}
          <div>
            <h3 className="text-sm font-semibold flex items-center gap-2 mb-3 text-muted-foreground">
              <Brain className="h-4 w-4 text-primary" />
              Algorithms & AI Solvers:
            </h3>
            <div className="flex flex-wrap gap-2">
              {algorithms.map((algo) => (
                <Badge key={algo} className="bg-primary/10 text-primary border-primary/20 text-sm px-3 py-1.5 rounded-lg">
                  <Sparkles className="mr-1.5 h-3.5 w-3.5" />
                  {algo}
                </Badge>
              ))}
            </div>
          </div>

          {/* Status Box */}
          <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-6 flex items-start gap-4 text-amber-600 dark:text-amber-400">
            <ShieldAlert className="h-6 w-6 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-base">Game Module In Active Development</h4>
              <p className="text-sm mt-1 opacity-90">
                The visual interactive UI engine for <span className="font-semibold">{title}</span> is being built with {algorithms.join(", ")} solver support. Check out Tic-Tac-Toe, Connect Four, 8-Puzzle, Water Jug, Wumpus World, or Block World in the arena!
              </p>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <Link to="/games">
              <Button className="gap-2 bg-gradient-to-r from-primary to-purple-600 hover:opacity-90">
                <Gamepad2 className="h-4 w-4" />
                Explore Other Games
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
