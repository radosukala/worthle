"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { useKeyboard } from "@/hooks/useKeyboard";
import type { Identity, Sentiment } from "@/lib/types";

interface ConsentPingProps {
  identity: Identity;
  sentiment: Sentiment;
  location: string;
  onDone: () => void;
}

export function ConsentPing({ identity, sentiment, location, onDone }: ConsentPingProps) {
  const [selected, setSelected] = useState(0);
  const [sent, setSent] = useState(false);

  const submit = useCallback(async () => {
    if (sent) return;

    if (selected === 0) {
      // Yes — send anonymous ping
      setSent(true);
      try {
        await fetch("/api/ping", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            track: identity.track,
            experience: identity.experience,
            location,
            sentiment,
          }),
        });
      } catch {
        // Silently fail — this is optional
      }
      onDone();
    } else {
      // No — skip
      onDone();
    }
  }, [selected, sent, identity, sentiment, location, onDone]);

  useKeyboard({
    onUp: () => setSelected((s) => (s === 0 ? 1 : 0)),
    onDown: () => setSelected((s) => (s === 0 ? 1 : 0)),
    onEnter: submit,
    enabled: !sent,
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.4 }}
      className="flex flex-col items-center gap-3 mt-4"
    >
      <p className="text-xs tracking-wide text-fg-dim text-center max-w-xs">
        Mind if we count this anonymously?
        <br />
        Just track, experience, location &amp; sentiment. Nothing else.
      </p>

      <div className="flex gap-3">
        {["Sure", "No thanks"].map((label, i) => (
          <button
            key={label}
            onClick={() => {
              setSelected(i);
              if (i === 0) {
                // immediately submit
                setSelected(0);
              }
              // trigger submit via effect
              setTimeout(() => submit(), 0);
            }}
            onMouseEnter={() => setSelected(i)}
            className={`cursor-pointer text-xs tracking-widest border rounded px-4 py-2 transition-all duration-100 ${
              i === selected
                ? "text-fg-bright border-fg-bright/20 bg-white/5"
                : "text-fg-dim border-white/10 hover:text-fg"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </motion.div>
  );
}
