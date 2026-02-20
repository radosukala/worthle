"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useKeyboard } from "@/hooks/useKeyboard";

interface SelectorProps<T extends string> {
  options: { value: T; label: string }[];
  onSelect: (value: T) => void;
  enabled?: boolean;
}

export function Selector<T extends string>({
  options,
  onSelect,
  enabled = true,
}: SelectorProps<T>) {
  const [index, setIndex] = useState(0);

  const moveUp = useCallback(() => {
    setIndex((i) => (i > 0 ? i - 1 : options.length - 1));
  }, [options.length]);

  const moveDown = useCallback(() => {
    setIndex((i) => (i < options.length - 1 ? i + 1 : 0));
  }, [options.length]);

  const confirm = useCallback(() => {
    onSelect(options[index].value);
  }, [index, onSelect, options]);

  useKeyboard({
    onUp: moveUp,
    onDown: moveDown,
    onEnter: confirm,
    enabled,
  });

  return (
    <div className="flex flex-col gap-1">
      <AnimatePresence mode="popLayout">
        {options.map((option, i) => (
          <motion.button
            key={option.value}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.03, duration: 0.2 }}
            onClick={() => {
              setIndex(i);
              onSelect(option.value);
            }}
            onMouseEnter={() => setIndex(i)}
            className={`cursor-pointer text-left text-sm tracking-wide py-1.5 px-3 rounded transition-colors duration-100 ${
              i === index
                ? "text-fg-bright bg-white/5"
                : "text-fg-dim hover:text-fg"
            }`}
          >
            {i === index && (
              <motion.span
                layoutId="selector-indicator"
                className="inline-block mr-2 text-accent"
              >
                &gt;
              </motion.span>
            )}
            {i !== index && <span className="inline-block mr-2 opacity-0">&gt;</span>}
            {option.label}
          </motion.button>
        ))}
      </AnimatePresence>
    </div>
  );
}
