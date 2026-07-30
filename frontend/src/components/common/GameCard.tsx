import { ArrowRight, Brain, Sparkles, Gamepad2 } from "lucide-react";
import { motion } from "framer-motion";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface GameCardProps {
  title: string;
  description: string;
  algorithm: string;
  icon: string;
  difficulty?: "Easy" | "Medium" | "Hard";
  category?: string;
  onPlay?: () => void;
}

const categoryStyles: Record<string, string> = {
  Board: "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  Puzzle: "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400",
  Search: "border-indigo-500/30 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400",
};

const difficultyStyles: Record<string, string> = {
  Easy: "border-green-500/30 bg-green-500/10 text-green-600 dark:text-green-400",
  Medium: "border-yellow-500/30 bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
  Hard: "border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400",
};

function GameCard({
  title,
  description,
  algorithm,
  icon,
  difficulty,
  category,
  onPlay,
}: GameCardProps) {
  const algorithmList = algorithm ? algorithm.split(" + ") : [];

  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="h-full cursor-pointer"
      onClick={onPlay}
    >
      <Card className="group relative flex h-full flex-col overflow-hidden border-border/60 bg-gradient-to-b from-card/90 via-card/70 to-card/90 backdrop-blur-xl transition-all duration-300 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/15">
        {/* Top glowing gradient line */}
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-purple-500 to-indigo-500 transition-all duration-300 group-hover:h-1.5" />

        {/* Ambient background blur orb */}
        <div className="pointer-events-none absolute -right-16 -top-16 h-36 w-36 rounded-full bg-primary/10 blur-3xl transition-all duration-500 group-hover:bg-primary/25" />

        <CardHeader className="relative pb-3">
          <div className="flex items-start justify-between gap-3">
            {/* Game Icon */}
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/15 via-purple-500/10 to-indigo-500/15 border border-primary/20 text-3xl shadow-inner transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
              {icon}
            </div>

            {/* Category & Difficulty Badges */}
            <div className="flex flex-col items-end gap-1.5">
              {category && (
                <Badge
                  variant="outline"
                  className={`font-semibold text-[11px] px-2.5 py-0.5 rounded-full ${
                    categoryStyles[category] || "border-primary/30 bg-primary/10 text-primary"
                  }`}
                >
                  {category}
                </Badge>
              )}

              {/* {difficulty && (
                <span
                  className={`inline-flex rounded-full border px-2 py-0.5 text-[10px] font-medium ${
                    difficultyStyles[difficulty] || "border-muted bg-muted text-muted-foreground"
                  }`}
                >
                  {difficulty}
                </span>
              )} */}
            </div>
          </div>

          {/* Game Title */}
          <CardTitle className="mt-4 text-xl font-extrabold tracking-tight group-hover:text-primary transition-colors">
            {title}
          </CardTitle>

          {/* Description */}
          <CardDescription className="line-clamp-2 min-h-[40px] text-xs text-muted-foreground/90">
            {description}
          </CardDescription>
        </CardHeader>

        <CardContent className="relative flex-1 pt-0">
          {/* Algorithms List */}
          <div className="rounded-xl border border-border/50 bg-muted/30 p-3 backdrop-blur-sm">
            <div className="mb-2 flex items-center justify-between text-[11px] font-semibold text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Brain className="h-3.5 w-3.5 text-purple-500" />
                Algorithm
              </span>
              <Sparkles className="h-3 w-3 text-primary/70" />
            </div>

            <div className="flex flex-wrap gap-1.5">
              {algorithmList.map((item) => (
                <Badge
                  key={item}
                  variant="secondary"
                  className="bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20 text-[11px] font-medium px-2 py-0.5 rounded-md"
                >
                  {item}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>

        {/* <CardFooter className="relative pt-2">
          <Button
            className="w-full bg-gradient-to-r from-primary via-purple-600 to-indigo-600 hover:opacity-95 font-semibold text-white shadow-md shadow-primary/20 group-hover:shadow-lg group-hover:shadow-primary/30 transition-all"
            onClick={(e) => {
              e.stopPropagation();
              onPlay?.();
            }}
          >
            <Gamepad2 className="mr-2 h-4 w-4" />
            Play Game
            <ArrowRight className="ml-auto h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Button>
        </CardFooter> */}
      </Card>
    </motion.div>
  );
}

export default GameCard;