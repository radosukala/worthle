"use client";

import { useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { TimerBar } from "./TimerBar";
import { QuestionImage } from "./QuestionImage";
import { OptionList } from "./OptionList";
import { useTimer } from "@/hooks/useTimer";
import type { Question } from "@/lib/types";

interface RoundProps {
  question: Question;
  roundNumber: number;
  totalRounds: number;
  onAnswer: (selected: 0 | 1 | 2 | null, timeMs: number) => void;
}

export function Round({ question, roundNumber, totalRounds, onAnswer }: RoundProps) {
  const answeredRef = useRef(false);
  const startTimeRef = useRef(performance.now());

  const handleExpire = useCallback(() => {
    if (answeredRef.current) return;
    answeredRef.current = true;
    onAnswer(null, question.timeLimitMs);
  }, [onAnswer, question.timeLimitMs]);

  const { progress } = useTimer({
    durationMs: question.timeLimitMs,
    onExpire: handleExpire,
    running: !answeredRef.current,
  });

  const handleSelect = useCallback(
    (index: 0 | 1 | 2) => {
      if (answeredRef.current) return;
      answeredRef.current = true;
      const elapsed = performance.now() - startTimeRef.current;
      onAnswer(index, elapsed);
    },
    [onAnswer]
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="flex min-h-dvh w-full flex-col items-center justify-center px-6 gap-8"
    >
      <TimerBar progress={progress} />

      <div className="fixed top-4 right-6 text-xs text-fg-dim tracking-widest">
        {roundNumber}/{totalRounds}
      </div>

      <QuestionImage question={question} />
      <OptionList
        options={question.options}
        onSelect={handleSelect}
        enabled={!answeredRef.current}
      />
    </motion.div>
  );
}
