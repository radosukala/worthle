"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { useKeyboard } from "@/hooks/useKeyboard";

interface OptionListProps {
  options: [string, string, string];
  onSelect: (index: 0 | 1 | 2) => void;
  enabled?: boolean;
}

const LABELS = ["A", "B", "C"] as const;

export function OptionList({ options, onSelect, enabled = true }: OptionListProps) {
  const [index, setIndex] = useState(0);

  const moveUp = useCallback(() => {
    setIndex((i) => (i > 0 ? i - 1 : 2));
  }, []);

  const moveDown = useCallback(() => {
    setIndex((i) => (i < 2 ? i + 1 : 0));
  }, []);

  const confirm = useCallback(() => {
    onSelect(index as 0 | 1 | 2);
  }, [index, onSelect]);

  useKeyboard({
    onUp: moveUp,
    onDown: moveDown,
    onEnter: confirm,
    enabled,
  });

  return (
    <div className="flex flex-col gap-2 w-full max-w-xl">
      {options.map((option, i) => (
        <motion.button
          key={i}
          initial={{ opacity: 0, x: -6 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.05, duration: 0.15 }}
          onClick={() => {
            setIndex(i);
            onSelect(i as 0 | 1 | 2);
          }}
          onMouseEnter={() => setIndex(i)}
          className={`cursor-pointer text-left text-sm tracking-wide py-2.5 px-4 rounded border transition-all duration-100 ${
            i === index
              ? "text-fg-bright border-fg-bright/20 bg-white/5"
              : "text-fg-dim border-transparent hover:text-fg"
          }`}
        >
          <span
            className={`inline-block w-8 font-bold ${
              i === index ? "text-accent" : "text-fg-dim"
            }`}
          >
            {LABELS[i]}
          </span>
          {option}
        </motion.button>
      ))}
    </div>
  );
}
