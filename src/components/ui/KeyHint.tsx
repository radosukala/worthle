"use client";

import { motion } from "framer-motion";

export function KeyHint() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.4 }}
      transition={{ delay: 0.8, duration: 0.6 }}
      className="mt-16 flex items-center gap-3 text-sm tracking-widest"
    >
      <span className="border border-white/20 rounded px-2 py-0.5">↑</span>
      <span className="border border-white/20 rounded px-2 py-0.5">↓</span>
      <span className="border border-white/20 rounded px-2.5 py-0.5">Enter</span>
    </motion.div>
  );
}
