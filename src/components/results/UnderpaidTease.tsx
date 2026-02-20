"use client";

import { motion } from "framer-motion";

export function UnderpaidTease() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.5 }}
      transition={{ delay: 0.8, duration: 0.6 }}
      className="mt-6 text-center"
    >
      <p className="text-xs tracking-wide text-fg-dim">
        You&apos;re not alone. We&apos;re building something about that.
      </p>
      <p className="mt-2 text-xs tracking-widest text-fg-dim">
        stay tuned.
      </p>
    </motion.div>
  );
}
