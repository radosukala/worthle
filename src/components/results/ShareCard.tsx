"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import type { GameResult, Answer, GameMode } from "@/lib/types";
import { getStreak } from "@/lib/daily";

interface ShareCardProps {
  result: GameResult;
  answers: Answer[];
  mode: GameMode;
}

function generateGrid(answers: Answer[]): string {
  return answers
    .map((a) => {
      if (a.selected === null) return "\u2B1B"; // black square (timeout)
      return a.correct ? "\uD83D\uDFE9" : "\uD83D\uDFE8"; // green / yellow
    })
    .join("");
}

export function ShareCard({ result, answers, mode }: ShareCardProps) {
  const [copied, setCopied] = useState(false);

  const grid = generateGrid(answers);
  const { fingerprint, identity } = result;
  const streak = mode === "daily" ? getStreak() : null;

  const lines: string[] = [];

  if (mode === "daily") {
    const today = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" });
    lines.push(`worthle.dev daily · ${today}`);
  } else {
    lines.push(`worthle.dev ${fingerprint.percentile}th percentile`);
  }

  lines.push(`${identity.track} · ${identity.language}`);
  lines.push(grid);

  if (streak && streak.current > 0) {
    lines.push(`\uD83D\uDD25 ${streak.current} day streak`);
  }

  lines.push("");
  lines.push("https://worthle.dev");

  const shareText = lines.join("\n");

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = shareText;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [shareText]);

  const handleTwitter = useCallback(() => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  }, [shareText]);

  // For daily mode, show 5 in a row. For full, wrap at 10.
  const chunkSize = mode === "daily" ? 5 : 10;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.4 }}
      className="flex flex-col items-center gap-4 mt-6"
    >
      {/* Grid preview */}
      <div className="text-base tracking-wider leading-relaxed text-center">
        {grid.match(new RegExp(`.{1,${chunkSize}}`, "g"))?.map((row, i) => (
          <div key={i}>{row}</div>
        ))}
      </div>

      {streak && streak.current > 0 && (
        <p className="text-xs tracking-widest text-fg-dim">
          {streak.current} day streak
        </p>
      )}

      <div className="flex gap-3 mt-1">
        <button
          onClick={handleCopy}
          className="cursor-pointer text-xs tracking-widest border border-white/10 rounded px-4 py-2 text-fg-dim hover:text-fg-bright hover:border-white/20 transition-colors"
        >
          {copied ? "Copied!" : "Copy result"}
        </button>

        <button
          onClick={handleTwitter}
          className="cursor-pointer text-xs tracking-widest border border-white/10 rounded px-4 py-2 text-fg-dim hover:text-fg-bright hover:border-white/20 transition-colors"
        >
          Share on X
        </button>
      </div>
    </motion.div>
  );
}
