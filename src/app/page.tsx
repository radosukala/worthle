"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Screen } from "@/components/ui/Screen";
import { KeyHint } from "@/components/ui/KeyHint";
import { useKeyboard } from "@/hooks/useKeyboard";
import { getStreak } from "@/lib/daily";
import type { DailyStreak } from "@/lib/types";

export default function LandingPage() {
  const router = useRouter();
  const [selected, setSelected] = useState(0);
  const [streak, setStreak] = useState<DailyStreak | null>(null);

  useEffect(() => {
    setStreak(getStreak());
  }, []);

  const dailyDone = streak?.completedToday ?? false;

  const options = [
    {
      label: "Daily Worthle",
      desc: "5 rounds · 2 min · same for everyone",
      href: "/play?mode=daily",
      disabled: dailyDone,
    },
    {
      label: "Full Assessment",
      desc: "20 rounds · 5 min · your salary range",
      href: "/play?mode=full",
      disabled: false,
    },
  ];

  const go = useCallback(() => {
    const opt = options[selected]!;
    if (opt.disabled) return;
    router.push(opt.href);
  }, [selected, options, router]);

  useKeyboard({
    onUp: () => setSelected((s) => (s > 0 ? s - 1 : options.length - 1)),
    onDown: () => setSelected((s) => (s < options.length - 1 ? s + 1 : 0)),
    onEnter: go,
  });

  return (
    <Screen>
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-2xl font-bold tracking-tight text-fg-bright"
      >
        worthle.dev
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="mt-6 text-sm tracking-wide"
      >
        Know your worth. No signup.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.4 }}
        className="mt-10 flex flex-col gap-2 w-full max-w-xs"
      >
        {options.map((opt, i) => (
          <button
            key={opt.label}
            onClick={() => {
              setSelected(i);
              if (!opt.disabled) router.push(opt.href);
            }}
            onMouseEnter={() => setSelected(i)}
            disabled={opt.disabled}
            className={`cursor-pointer text-left py-3 px-4 rounded border transition-all duration-100 ${
              opt.disabled
                ? "opacity-30 cursor-not-allowed border-transparent"
                : i === selected
                  ? "text-fg-bright border-fg-bright/20 bg-white/5"
                  : "text-fg-dim border-transparent hover:text-fg"
            }`}
          >
            <span className="block text-sm tracking-wide">
              {i === selected && !opt.disabled && (
                <span className="text-accent mr-2">&gt;</span>
              )}
              {opt.label}
              {opt.disabled && " — done today"}
            </span>
            <span className="block text-xs text-fg-dim mt-0.5 ml-5">{opt.desc}</span>
          </button>
        ))}
      </motion.div>

      {streak && streak.current > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ delay: 0.9, duration: 0.4 }}
          className="mt-6 text-xs tracking-widest text-fg-dim"
        >
          {streak.current} day streak{streak.best > streak.current ? ` · best: ${streak.best}` : ""}
        </motion.div>
      )}

      <KeyHint />

      <motion.a
        href="https://github.com/radosukala/worthle"
        target="_blank"
        rel="noopener noreferrer"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.25 }}
        transition={{ delay: 1.2, duration: 0.4 }}
        whileHover={{ opacity: 0.7 }}
        className="mt-8 text-[10px] tracking-widest text-fg-dim hover:text-fg transition-colors"
      >
        open source
      </motion.a>
    </Screen>
  );
}
