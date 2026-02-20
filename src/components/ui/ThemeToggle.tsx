"use client";

import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";

export function ThemeToggle() {
  const [light, setLight] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("worthle-theme");
    if (stored === "light") {
      document.documentElement.classList.add("light");
      setLight(true);
    }
  }, []);

  const toggle = useCallback(() => {
    const next = !light;
    setLight(next);
    if (next) {
      document.documentElement.classList.add("light");
      localStorage.setItem("worthle-theme", "light");
    } else {
      document.documentElement.classList.remove("light");
      localStorage.setItem("worthle-theme", "dark");
    }
  }, [light]);

  return (
    <motion.button
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.3 }}
      whileHover={{ opacity: 0.6 }}
      onClick={toggle}
      className="fixed top-4 left-4 cursor-pointer text-xs tracking-widest text-fg-dim hover:text-fg transition-colors z-50"
      aria-label="Toggle theme"
    >
      {light ? "dark" : "light"}
    </motion.button>
  );
}
