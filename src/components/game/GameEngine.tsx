"use client";

import { useCallback, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Round } from "./Round";
import { useGameStore } from "@/hooks/useGameStore";
import type { Question, Answer } from "@/lib/types";

interface GameEngineProps {
  questions: Question[];
  onComplete: (answers: Answer[]) => void;
}

export function GameEngine({ questions, onComplete }: GameEngineProps) {
  const [currentRound, setCurrentRound] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [transitioning, setTransitioning] = useState(false);

  const question = questions[currentRound];

  const handleAnswer = useCallback(
    (selected: 0 | 1 | 2 | null, timeMs: number) => {
      if (transitioning) return;

      const answer: Answer = {
        questionId: question.id,
        selected,
        timeMs: Math.round(timeMs),
        correct: selected === question.correct,
        category: question.category,
      };

      const newAnswers = [...answers, answer];
      setAnswers(newAnswers);
      setTransitioning(true);

      setTimeout(() => {
        if (currentRound + 1 >= questions.length) {
          onComplete(newAnswers);
        } else {
          setCurrentRound((r) => r + 1);
          setTransitioning(false);
        }
      }, 300);
    },
    [answers, currentRound, question, questions, onComplete, transitioning]
  );

  if (!question) return null;

  return (
    <AnimatePresence mode="wait">
      <Round
        key={question.id}
        question={question}
        roundNumber={currentRound + 1}
        totalRounds={questions.length}
        onAnswer={handleAnswer}
      />
    </AnimatePresence>
  );
}
