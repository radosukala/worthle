"use client";

import { useEffect, useCallback } from "react";

interface UseKeyboardOptions {
  onUp?: () => void;
  onDown?: () => void;
  onEnter?: () => void;
  onEscape?: () => void;
  enabled?: boolean;
}

export function useKeyboard({
  onUp,
  onDown,
  onEnter,
  onEscape,
  enabled = true,
}: UseKeyboardOptions) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!enabled) return;

      switch (e.key) {
        case "ArrowUp":
          e.preventDefault();
          onUp?.();
          break;
        case "ArrowDown":
          e.preventDefault();
          onDown?.();
          break;
        case "Enter":
          e.preventDefault();
          onEnter?.();
          break;
        case "Escape":
          e.preventDefault();
          onEscape?.();
          break;
      }
    },
    [onUp, onDown, onEnter, onEscape, enabled]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);
}
