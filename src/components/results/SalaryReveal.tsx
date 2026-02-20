"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Selector } from "@/components/identity/Selector";
import { LOCATIONS } from "@/lib/constants";
import { computeSalaryRange, formatSalary } from "@/lib/salary";
import type { Identity, SkillFingerprint, SalaryRange } from "@/lib/types";

interface SalaryRevealProps {
  identity: Identity;
  fingerprint: SkillFingerprint;
  onSalaryRevealed: (salary: SalaryRange) => void;
}

export function SalaryReveal({
  identity,
  fingerprint,
  onSalaryRevealed,
}: SalaryRevealProps) {
  const [salary, setSalary] = useState<SalaryRange | null>(null);

  const handleLocationSelect = useCallback(
    (location: string) => {
      const range = computeSalaryRange(
        identity.track,
        identity.experience,
        fingerprint.percentile,
        location
      );
      setSalary(range);
      onSalaryRevealed(range);
    },
    [identity, fingerprint, onSalaryRevealed]
  );

  return (
    <div className="flex flex-col items-center gap-6">
      <AnimatePresence mode="wait">
        {!salary ? (
          <motion.div
            key="location-select"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="flex flex-col items-center gap-6"
          >
            <h3 className="text-sm tracking-widest text-fg-dim">
              Select your location
            </h3>
            <Selector options={LOCATIONS} onSelect={handleLocationSelect} />
          </motion.div>
        ) : (
          <motion.div
            key="salary-display"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="flex flex-col items-center gap-3"
          >
            <p className="text-xs tracking-widest text-fg-dim">
              {LOCATIONS.find((l) => l.value === salary.location)?.label ?? salary.location}
              {"  ·  "}
              {identity.language.charAt(0).toUpperCase() + identity.language.slice(1)}
              {"  ·  "}
              {identity.track.charAt(0).toUpperCase() + identity.track.slice(1)}
              {"  ·  "}
              {fingerprint.percentile}th percentile
            </p>

            <p className="text-3xl font-bold tracking-tight text-fg-bright">
              {formatSalary(salary.min, salary.currency)} — {formatSalary(salary.max, salary.currency)}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
