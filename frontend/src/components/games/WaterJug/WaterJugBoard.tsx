import { motion } from "framer-motion";

import type {
  WaterJugState,
} from "@/types/waterJug";


interface WaterJugBoardProps {
  state: WaterJugState;
  jugACapacity: number;
  jugBCapacity: number;
}


function Jug({
  label,
  amount,
  capacity,
}: {
  label: string;
  amount: number;
  capacity: number;
}) {

  const fillPercentage =
    capacity > 0
      ? (amount / capacity) * 100
      : 0;


  return (
    <div className="flex flex-col items-center gap-3">

      <div className="text-center">

        <p className="text-lg font-semibold">
          {label}
        </p>

        <p className="text-sm text-muted-foreground">
          {amount}L / {capacity}L
        </p>

      </div>


      {/* Jug */}
      <div className="relative flex h-64 w-36 items-end overflow-hidden rounded-b-3xl border-4 border-foreground/30 bg-muted/20">

        {/* Water */}
        <motion.div
          className="absolute bottom-0 left-0 w-full rounded-b-2xl bg-blue-500/80"
          initial={{
            height: 0,
          }}
          animate={{
            height: `${fillPercentage}%`,
          }}
          transition={{
            duration: 0.5,
            ease: "easeInOut",
          }}
        />

        {/* Water shine */}
        <motion.div
          className="absolute left-3 w-2 rounded-full bg-white/20"
          style={{
            bottom: `${Math.min(
              fillPercentage,
              85,
            )}%`,
          }}
          animate={{
            opacity:
              fillPercentage > 0
                ? 1
                : 0,
          }}
        />

      </div>


      <div className="text-2xl font-bold">
        {amount} L
      </div>

    </div>
  );
}


function WaterJugBoard({
  state,
  jugACapacity,
  jugBCapacity,
}: WaterJugBoardProps) {

  return (
    <div className="flex flex-wrap items-end justify-center gap-12">

      <Jug
        label="Jug A"
        amount={state.jug_a}
        capacity={
          jugACapacity
        }
      />

      <Jug
        label="Jug B"
        amount={state.jug_b}
        capacity={
          jugBCapacity
        }
      />

    </div>
  );
}


export default WaterJugBoard;