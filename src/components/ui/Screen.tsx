"use client";

import { motion } from "framer-motion";

interface ScreenProps {
  children: React.ReactNode;
  className?: string;
}

export function Screen({ children, className = "" }: ScreenProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex min-h-dvh w-full flex-col items-center justify-center px-6 ${className}`}
    >
      {children}
    </motion.div>
  );
}
