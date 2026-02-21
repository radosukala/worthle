"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Selector } from "./Selector";
import { Screen } from "@/components/ui/Screen";
import { TRACKS, LANGUAGES, EXPERIENCE_LEVELS, TRACK_LANGUAGES } from "@/lib/constants";
import type { Track, Language, Experience, Identity } from "@/lib/types";

interface IdentityFlowProps {
  onComplete: (identity: Identity) => void;
}

type Step = "track" | "language" | "secondaryLanguage" | "experience";

export function IdentityFlow({ onComplete }: IdentityFlowProps) {
  const [step, setStep] = useState<Step>("track");
  const [track, setTrack] = useState<Track | null>(null);
  const [language, setLanguage] = useState<Language | null>(null);
  const [secondaryLanguage, setSecondaryLanguage] = useState<Language | undefined>(undefined);

  const stepNumber =
    step === "track" ? 1 :
    step === "language" ? 2 :
    step === "secondaryLanguage" ? 3 :
    track === "fullstack" ? 4 : 3;

  const totalSteps = track === "fullstack" ? 4 : 3;

  const question =
    step === "track" ? "What kind of developer are you?" :
    step === "language" ? "Primary language?" :
    step === "secondaryLanguage" ? "Second language?" :
    "Years of experience?";

  const getOptions = () => {
    if (step === "track") return TRACKS;
    if (step === "language") {
      const trackLangs = track ? TRACK_LANGUAGES[track] : [];
      return LANGUAGES.filter((l) => trackLangs.includes(l.value));
    }
    if (step === "secondaryLanguage") {
      const trackLangs = track ? TRACK_LANGUAGES[track] : [];
      const available = LANGUAGES.filter(
        (l) => trackLangs.includes(l.value) && l.value !== language
      );
      const primaryLabel = LANGUAGES.find((l) => l.value === language)?.label;
      return [{ value: "none" as const, label: `Just ${primaryLabel}` }, ...available];
    }
    return EXPERIENCE_LEVELS;
  };

  const handleSelect = useCallback(
    (value: string) => {
      if (step === "track") {
        setTrack(value as Track);
        setStep("language");
      } else if (step === "language") {
        setLanguage(value as Language);
        if (track === "fullstack") {
          setStep("secondaryLanguage");
        } else {
          setStep("experience");
        }
      } else if (step === "secondaryLanguage") {
        const secondary = value === "none" ? undefined : (value as Language);
        setSecondaryLanguage(secondary);
        setStep("experience");
      } else if (step === "experience") {
        onComplete({
          track: track!,
          language: language!,
          secondaryLanguage,
          experience: value as Experience,
        });
      }
    },
    [step, track, language, secondaryLanguage, onComplete]
  );

  return (
    <Screen>
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
          className="flex flex-col items-center gap-8"
        >
          <h2 className="text-lg tracking-wide text-fg-bright">
            {question}
          </h2>

          <Selector options={getOptions()} onSelect={handleSelect} />

          <p className="text-xs text-fg-dim tracking-widest mt-4">
            {stepNumber} / {totalSteps}
          </p>
        </motion.div>
      </AnimatePresence>
    </Screen>
  );
}
