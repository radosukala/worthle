"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Selector } from "./Selector";
import { Screen } from "@/components/ui/Screen";
import { TRACKS, LANGUAGES, EXPERIENCE_LEVELS } from "@/lib/constants";
import type { Track, Language, Experience, Identity } from "@/lib/types";

interface IdentityFlowProps {
  onComplete: (identity: Identity) => void;
}

type Step = "track" | "language" | "experience";

const STEPS: {
  key: Step;
  question: string;
}[] = [
  { key: "track", question: "What kind of developer are you?" },
  { key: "language", question: "Primary language?" },
  { key: "experience", question: "Years of experience?" },
];

export function IdentityFlow({ onComplete }: IdentityFlowProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const [track, setTrack] = useState<Track | null>(null);
  const [language, setLanguage] = useState<Language | null>(null);

  const step = STEPS[stepIndex];

  const handleSelect = useCallback(
    (value: string) => {
      if (step.key === "track") {
        setTrack(value as Track);
        setStepIndex(1);
      } else if (step.key === "language") {
        setLanguage(value as Language);
        setStepIndex(2);
      } else if (step.key === "experience") {
        onComplete({
          track: track!,
          language: language!,
          experience: value as Experience,
        });
      }
    },
    [step, track, language, onComplete]
  );

  const getOptions = () => {
    switch (step.key) {
      case "track":
        return TRACKS;
      case "language":
        return LANGUAGES;
      case "experience":
        return EXPERIENCE_LEVELS;
    }
  };

  return (
    <Screen>
      <AnimatePresence mode="wait">
        <motion.div
          key={step.key}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
          className="flex flex-col items-center gap-8"
        >
          <h2 className="text-lg tracking-wide text-fg-bright">
            {step.question}
          </h2>

          <Selector options={getOptions()} onSelect={handleSelect} />

          <p className="text-xs text-fg-dim tracking-widest mt-4">
            {stepIndex + 1} / {STEPS.length}
          </p>
        </motion.div>
      </AnimatePresence>
    </Screen>
  );
}
