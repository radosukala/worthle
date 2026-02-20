"use client";

import { motion } from "framer-motion";
import type { Question } from "@/lib/types";

interface QuestionImageProps {
  question: Question;
}

export function QuestionImage({ question }: QuestionImageProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      className="w-full max-w-2xl"
    >
      <p className="text-xs text-fg-dim tracking-widest uppercase mb-4">
        {question.type === "bug" && "What's the bug?"}
        {question.type === "output" && "What happens next?"}
        {question.type === "scales" && "Which scales?"}
        {question.type === "slow" && "What's slow?"}
        {question.type === "diff" && "What changed?"}
      </p>

      {question.prompt && (
        <p className="text-sm text-fg mb-4">{question.prompt}</p>
      )}

      <div className="rounded-lg border border-white/10 bg-white/[0.02] p-5 overflow-x-auto">
        <pre className="text-sm leading-relaxed whitespace-pre-wrap">
          <code className="text-fg-bright">{question.code}</code>
        </pre>
      </div>
    </motion.div>
  );
}
