"use client";

import { motion } from "framer-motion";

interface TimerBarProps {
  progress: number;
}

export function TimerBar({ progress }: TimerBarProps) {
  const remaining = 1 - progress;

  const color =
    remaining > 0.4
      ? "bg-fg-bright/30"
      : remaining > 0.2
        ? "bg-accent-warn/50"
        : "bg-accent-danger/60";

  return (
    <div className="fixed top-0 left-0 right-0 h-0.5">
      <motion.div
        className={`h-full ${color} transition-colors duration-500`}
        style={{ width: `${remaining * 100}%` }}
      />
    </div>
  );
}
