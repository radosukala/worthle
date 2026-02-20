"use client";

import { useState, useEffect, useCallback, useRef } from "react";

interface UseTimerOptions {
  durationMs: number;
  onExpire: () => void;
  running: boolean;
}

export function useTimer({ durationMs, onExpire, running }: UseTimerOptions) {
  const [elapsed, setElapsed] = useState(0);
  const startTimeRef = useRef<number>(0);
  const frameRef = useRef<number>(0);
  const onExpireRef = useRef(onExpire);
  onExpireRef.current = onExpire;

  const reset = useCallback(() => {
    setElapsed(0);
    startTimeRef.current = 0;
    if (frameRef.current) cancelAnimationFrame(frameRef.current);
  }, []);

  useEffect(() => {
    if (!running) {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      return;
    }

    startTimeRef.current = performance.now();

    const tick = (now: number) => {
      const ms = now - startTimeRef.current;
      setElapsed(ms);

      if (ms >= durationMs) {
        onExpireRef.current();
        return;
      }

      frameRef.current = requestAnimationFrame(tick);
    };

    frameRef.current = requestAnimationFrame(tick);

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [running, durationMs]);

  const progress = Math.min(elapsed / durationMs, 1);

  return { progress, elapsed, reset };
}
