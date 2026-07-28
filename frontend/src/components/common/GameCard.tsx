import { ArrowRight, Brain, Sparkles } from "lucide-react";
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

const difficultyStyles = {
  Easy: "border-green-500/30 bg-green-500/10 text-green-600 dark:text-green-400",
  Medium:
    "border-yellow-500/30 bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
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
  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.2 }}
      className="h-full"
    >
      <Card className="group relative flex h-full flex-col overflow-hidden border-border/50 bg-card/70 backdrop-blur transition-all duration-300 hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/10">
        {/* Top gradient */}
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-purple-500 to-blue-500" />

        {/* Background glow */}
        <div className="pointer-events-none absolute -right-16 -top-16 h-32 w-32 rounded-full bg-primary/10 blur-3xl transition-all duration-500 group-hover:bg-primary/20" />

        <CardHeader className="relative">
          <div className="flex items-start justify-between">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-3xl transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
              {icon}
            </div>

            <div className="flex flex-col items-end gap-2">
              {category && (
                <Badge variant="secondary">
                  {category}
                </Badge>
              )}

              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Brain className="h-3.5 w-3.5" />
                AI
              </div>
            </div>
          </div>

          <CardTitle className="mt-5 text-xl">
            {title}
          </CardTitle>

          <CardDescription className="min-h-[48px]">
            {description}
          </CardDescription>
        </CardHeader>

        <CardContent className="relative flex-1">
          <div className="rounded-xl border bg-muted/40 p-3">
            <div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              AI Algorithms
            </div>

            <div className="flex flex-wrap gap-1.5">
              {algorithm.split(" + ").map((item) => (
                <Badge
                  key={item}
                  variant="outline"
                  className="text-xs"
                >
                  {item}
                </Badge>
              ))}
            </div>
          </div>

          {difficulty && (
            <div className="mt-4">
              <span
                className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${difficultyStyles[difficulty]}`}
              >
                {difficulty} Difficulty
              </span>
            </div>
          )}
        </CardContent>

        <CardFooter className="relative">
          <Button
            className="w-full"
            onClick={onPlay}
          >
            Play Now
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}

export default GameCard;