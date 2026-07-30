import { Hand, Table } from "lucide-react";
import type { BlockGameState } from "@/types/blockWorld";

interface BlockWorldBoardProps {
  game: BlockGameState;
  onBlockClick?: (block: string, stackIndex: number) => void;
  onTableClick?: () => void;
  onStackClick?: (targetBlock: string) => void;
  disabled?: boolean;
}

const BLOCK_COLORS: Record<string, string> = {
  A: "bg-red-500 hover:bg-red-600 text-white border-red-700 shadow-red-500/20",
  B: "bg-blue-500 hover:bg-blue-600 text-white border-blue-700 shadow-blue-500/20",
  C: "bg-emerald-500 hover:bg-emerald-600 text-white border-emerald-700 shadow-emerald-500/20",
  D: "bg-amber-500 hover:bg-amber-600 text-white border-amber-700 shadow-amber-500/20",
  E: "bg-purple-500 hover:bg-purple-600 text-white border-purple-700 shadow-purple-500/20",
  F: "bg-pink-500 hover:bg-pink-600 text-white border-pink-700 shadow-pink-500/20",
};

export default function BlockWorldBoard({
  game,
  onBlockClick,
  onTableClick,
  onStackClick,
  disabled = false,
}: BlockWorldBoardProps) {
  const { stacks, holding, goal_stacks } = game;

  const getBlockColor = (block: string) => {
    return BLOCK_COLORS[block] || "bg-primary text-primary-foreground border-primary";
  };

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-2xl">
      {/* Robot Arm / Hand Status */}
      <div
        className={`flex items-center gap-3 px-5 py-3 rounded-2xl border-2 transition-all duration-300 ${
          holding
            ? "border-primary bg-primary/10 shadow-md scale-105"
            : "border-border bg-muted/40"
        }`}
      >
        <Hand className={`h-6 w-6 ${holding ? "text-primary animate-pulse" : "text-muted-foreground"}`} />
        <span className="text-sm font-semibold">
          {holding ? (
            <span className="flex items-center gap-2">
              Gripper Holding:
              <span className={`inline-flex items-center justify-center w-8 h-8 rounded-lg font-bold border-2 shadow-sm ${getBlockColor(holding)}`}>
                {holding}
              </span>
            </span>
          ) : (
            <span className="text-muted-foreground">Gripper Empty (Click top block to pick up)</span>
          )}
        </span>
      </div>

      {/* Main Table Area */}
      <div className="relative w-full min-h-[260px] bg-gradient-to-b from-muted/20 to-muted/60 rounded-2xl border p-6 flex flex-col justify-between overflow-hidden">
        {/* Stacks Container */}
        <div className="flex items-end justify-center gap-6 sm:gap-10 min-h-[190px] pb-2">
          {stacks.map((stack, stackIndex) => {
            const topBlock = stack[stack.length - 1];

            return (
              <div
                key={stackIndex}
                className="flex flex-col-reverse items-center cursor-pointer group"
                onClick={() => {
                  if (disabled) return;
                  if (holding) {
                    onStackClick?.(topBlock);
                  } else {
                    onBlockClick?.(topBlock, stackIndex);
                  }
                }}
              >
                {stack.map((block, blockIndex) => {
                  const isTop = blockIndex === stack.length - 1;

                  return (
                    <button
                      key={blockIndex}
                      disabled={disabled}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (disabled) return;
                        if (holding) {
                          onStackClick?.(topBlock);
                        } else if (isTop) {
                          onBlockClick?.(block, stackIndex);
                        }
                      }}
                      className={`w-14 h-12 sm:w-16 sm:h-14 rounded-xl border-2 font-bold text-lg flex items-center justify-center shadow-md transition-all duration-200 ${getBlockColor(
                        block,
                      )} ${
                        isTop && !holding ? "ring-2 ring-offset-2 ring-primary/40 hover:-translate-y-1" : ""
                      }`}
                    >
                      {block}
                    </button>
                  );
                })}

                {/* Stack Label / Drop Target */}
                <div className="mt-2 text-xs font-semibold text-muted-foreground group-hover:text-primary transition-colors">
                  Stack {stackIndex + 1}
                </div>
              </div>
            );
          })}

          {/* Place on Table Drop Area */}
          {holding && (
            <div
              onClick={() => !disabled && onTableClick?.()}
              className="flex flex-col items-center justify-center w-16 h-20 rounded-xl border-2 border-dashed border-primary/50 bg-primary/5 hover:bg-primary/10 cursor-pointer transition-all animate-pulse"
            >
              <Table className="h-5 w-5 text-primary mb-1" />
              <span className="text-[10px] font-bold text-primary">Place on Table</span>
            </div>
          )}
        </div>

        {/* Table Surface */}
        <div className="w-full h-3 bg-amber-800/60 dark:bg-amber-900/80 rounded-full border-t border-amber-600/50 shadow-inner flex items-center justify-center">
          <span className="text-[10px] uppercase font-bold tracking-widest text-amber-200/60">TABLE</span>
        </div>
      </div>

      {/* Goal Preview Box */}
      <div className="w-full rounded-xl border bg-card p-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 text-center">
          🎯 Target Goal Configuration
        </h4>
        <div className="flex items-end justify-center gap-6 min-h-[90px]">
          {goal_stacks.map((gStack, idx) => (
            <div key={idx} className="flex flex-col-reverse items-center gap-1">
              {gStack.map((block, bIdx) => (
                <div
                  key={bIdx}
                  className={`w-10 h-8 rounded-lg border text-xs font-bold flex items-center justify-center ${getBlockColor(
                    block,
                  )}`}
                >
                  {block}
                </div>
              ))}
              <span className="text-[10px] text-muted-foreground mt-1">Goal {idx + 1}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
