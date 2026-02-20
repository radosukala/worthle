"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useKeyboard } from "@/hooks/useKeyboard";
import type { Sentiment } from "@/lib/types";

interface SentimentPromptProps {
  onSelect: (sentiment: Sentiment) => void;
}

const SENTIMENTS: { value: Sentiment; emoji: string; label: string }[] = [
  { value: "fair", emoji: "\uD83D\uDFE2", label: "About right" },
  { value: "below", emoji: "\uD83D\uDFE1", label: "A bit low" },
  { value: "underpaid", emoji: "\uD83D\uDD34", label: "Way below this" },
];

export function SentimentPrompt({ onSelect }: SentimentPromptProps) {
  const [index, setIndex] = useState(0);

  const moveUp = useCallback(() => {
    setIndex((i) => (i > 0 ? i - 1 : SENTIMENTS.length - 1));
  }, []);

  const moveDown = useCallback(() => {
    setIndex((i) => (i < SENTIMENTS.length - 1 ? i + 1 : 0));
  }, []);

  const confirm = useCallback(() => {
    onSelect(SENTIMENTS[index]!.value);
  }, [index, onSelect]);

  useKeyboard({
    onUp: moveUp,
    onDown: moveDown,
    onEnter: confirm,
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center gap-4"
    >
      <p className="text-sm tracking-widest text-fg-dim">
        How does that feel?
      </p>

      <div className="flex flex-col gap-1.5">
        {SENTIMENTS.map((s, i) => (
          <button
            key={s.value}
            onClick={() => {
              setIndex(i);
              onSelect(s.value);
            }}
            onMouseEnter={() => setIndex(i)}
            className={`cursor-pointer text-left text-sm tracking-wide py-2 px-4 rounded transition-all duration-100 ${
              i === index
                ? "text-fg-bright bg-white/5"
                : "text-fg-dim hover:text-fg"
            }`}
          >
            <span className="mr-3">{s.emoji}</span>
            {s.label}
          </button>
        ))}
      </div>
    </motion.div>
  );
}
