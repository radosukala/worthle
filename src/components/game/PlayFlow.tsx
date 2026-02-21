"use client";

import { useState, useCallback, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import { IdentityFlow } from "@/components/identity/IdentityFlow";
import { GameEngine } from "@/components/game/GameEngine";
import { Results } from "@/components/results/Results";
import { useGameStore } from "@/hooks/useGameStore";
import { getQuestions, getDailyQuestions } from "@/lib/questions";
import { computeFingerprint } from "@/lib/scoring";
import { completeDaily } from "@/lib/daily";
import type { Identity, Answer, Question, SkillFingerprint, GameMode } from "@/lib/types";

export function PlayFlow() {
  const searchParams = useSearchParams();
  const { phase, setPhase, mode, setMode, identity, setIdentity, reset } = useGameStore();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [fingerprint, setFingerprint] = useState<SkillFingerprint | null>(null);

  // Reset game state and set mode from URL when entering the play page
  useEffect(() => {
    reset();
    const urlMode = searchParams.get("mode") as GameMode | null;
    setMode(urlMode === "full" ? "full" : "daily");
    setPhase("identity");
  }, [reset, setPhase, setMode, searchParams]);

  const handleIdentityComplete = useCallback(
    (id: Identity) => {
      setIdentity(id);
      const qs = mode === "daily"
        ? getDailyQuestions(id.track, id.language, id.secondaryLanguage)
        : getQuestions(id.track, id.language, undefined, id.secondaryLanguage);
      setQuestions(qs);
      setPhase("playing");
    },
    [setIdentity, setPhase, mode]
  );

  const handleGameComplete = useCallback(
    (gameAnswers: Answer[]) => {
      setAnswers(gameAnswers);
      const fp = computeFingerprint(gameAnswers, identity!);
      setFingerprint(fp);

      // Track daily streak
      if (mode === "daily") {
        completeDaily();
      }

      setPhase("results");
    },
    [identity, setPhase, mode]
  );

  return (
    <AnimatePresence mode="wait">
      {phase === "identity" || !identity ? (
        <IdentityFlow key="identity" onComplete={handleIdentityComplete} />
      ) : phase === "playing" && questions.length > 0 ? (
        <GameEngine
          key="game"
          questions={questions}
          onComplete={handleGameComplete}
        />
      ) : phase === "results" && fingerprint && identity ? (
        <Results
          key="results"
          identity={identity}
          fingerprint={fingerprint}
          answers={answers}
          mode={mode}
        />
      ) : null}
    </AnimatePresence>
  );
}
