"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Screen } from "@/components/ui/Screen";
import { RadarChart } from "./RadarChart";
import { SalaryReveal } from "./SalaryReveal";
import { SentimentPrompt } from "./SentimentPrompt";
import { ConsentPing } from "./ConsentPing";
import { UnderpaidTease } from "./UnderpaidTease";
import { ShareCard } from "./ShareCard";
import type { Identity, SkillFingerprint, Answer, GameResult, GameMode, SalaryRange, Sentiment } from "@/lib/types";
import { TRACKS, LANGUAGES } from "@/lib/constants";

interface ResultsProps {
  identity: Identity;
  fingerprint: SkillFingerprint;
  answers: Answer[];
  mode: GameMode;
}

export function Results({ identity, fingerprint, answers, mode }: ResultsProps) {
  const [showChart, setShowChart] = useState(false);
  const [showSalary, setShowSalary] = useState(false);
  const [result, setResult] = useState<GameResult | null>(null);
  const [sentiment, setSentiment] = useState<Sentiment | null>(null);
  const [showSentiment, setShowSentiment] = useState(false);
  const [consentDone, setConsentDone] = useState(false);

  // Trigger chart reveal after 1 second
  useEffect(() => {
    const timer = setTimeout(() => setShowChart(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  // For full mode, show salary after chart. For daily, skip to share.
  useEffect(() => {
    if (mode === "full") {
      const timer = setTimeout(() => setShowSalary(true), 2500);
      return () => clearTimeout(timer);
    } else {
      // Daily mode: auto-create result for sharing (no salary)
      const timer = setTimeout(() => {
        setResult({
          fingerprint,
          salaryRange: null,
          identity,
          shareId: Math.random().toString(36).substring(2, 10),
        });
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [mode, fingerprint, identity]);

  const handleSalaryRevealed = useCallback(
    (salary: SalaryRange) => {
      setResult({
        fingerprint,
        salaryRange: salary,
        identity,
        shareId: Math.random().toString(36).substring(2, 10),
      });
      // Delay sentiment prompt so user can see their salary
      setTimeout(() => setShowSentiment(true), 2000);
    },
    [fingerprint, identity]
  );

  const handleSentiment = useCallback(
    (s: Sentiment) => {
      setSentiment(s);
      if (result) {
        setResult({ ...result, sentiment: s });
      }
    },
    [result]
  );

  const handleConsentDone = useCallback(() => {
    setConsentDone(true);
  }, []);

  const trackLabel = TRACKS.find((t) => t.value === identity.track)?.label ?? identity.track;
  const langLabel = LANGUAGES.find((l) => l.value === identity.language)?.label ?? identity.language;

  // Flow is done when: daily mode + result ready, OR full mode + consent done
  const flowComplete = mode === "daily" ? !!result : consentDone;

  return (
    <Screen>
      <AnimatePresence>
        {showChart && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center gap-6"
          >
            <RadarChart fingerprint={fingerprint} />

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.4 }}
              className="text-center"
            >
              <p className="text-sm text-fg">
                You are in the{" "}
                <span className="text-fg-bright font-bold">
                  {fingerprint.percentile}th percentile
                </span>{" "}
                of {langLabel} {trackLabel.toLowerCase()} developers.
              </p>
            </motion.div>

            {/* Full mode: salary reveal (stays visible after selection) */}
            {mode === "full" && showSalary && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
                className="mt-4"
              >
                <SalaryReveal
                  identity={identity}
                  fingerprint={fingerprint}
                  onSalaryRevealed={handleSalaryRevealed}
                />
              </motion.div>
            )}

            {/* Sentiment prompt — delayed after salary reveal */}
            {mode === "full" && showSentiment && !sentiment && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
                className="mt-4"
              >
                <SentimentPrompt onSelect={handleSentiment} />
              </motion.div>
            )}

            {/* Sentiment selected — ask consent to ping */}
            {mode === "full" && sentiment && !consentDone && result?.salaryRange && (
              <ConsentPing
                identity={identity}
                sentiment={sentiment}
                location={result.salaryRange.location}
                onDone={handleConsentDone}
              />
            )}

            {/* Show tease if underpaid and consent step done */}
            {sentiment === "underpaid" && consentDone && (
              <UnderpaidTease />
            )}

            {/* Share card — after flow is complete */}
            {flowComplete && result && (
              <ShareCard result={result} answers={answers} mode={mode} />
            )}

            {flowComplete && result && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.4 }}
                transition={{ delay: 0.6, duration: 0.4 }}
                whileHover={{ opacity: 0.8 }}
                onClick={() => (window.location.href = "/")}
                className="cursor-pointer mt-4 mb-8 text-xs tracking-widest text-fg-dim hover:text-fg transition-colors"
              >
                {mode === "daily" ? "Back home" : "Play again"}
              </motion.button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </Screen>
  );
}
