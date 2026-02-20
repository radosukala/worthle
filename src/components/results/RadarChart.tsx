"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import type { SkillFingerprint } from "@/lib/types";

interface RadarChartProps {
  fingerprint: SkillFingerprint;
  size?: number;
}

export function RadarChart({ fingerprint, size = 280 }: RadarChartProps) {
  const { categories } = fingerprint;
  const n = categories.length;
  const cx = size / 2;
  const cy = size / 2;
  const radius = size * 0.38;
  const labelRadius = size * 0.48;

  const angles = useMemo(
    () =>
      categories.map((_, i) => {
        const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
        return angle;
      }),
    [categories, n]
  );

  // Grid rings
  const rings = [0.25, 0.5, 0.75, 1.0];

  // Build polygon path for scores
  const scorePath = useMemo(() => {
    const points = categories.map((cat, i) => {
      const r = (cat.score / 100) * radius;
      const x = cx + r * Math.cos(angles[i]!);
      const y = cy + r * Math.sin(angles[i]!);
      return `${x},${y}`;
    });
    return points.join(" ");
  }, [categories, angles, radius, cx, cy]);

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg
        viewBox={`0 0 ${size} ${size}`}
        width={size}
        height={size}
        className="overflow-visible"
      >
        {/* Grid rings */}
        {rings.map((ring) => (
          <polygon
            key={ring}
            points={angles
              .map((angle) => {
                const r = ring * radius;
                return `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`;
              })
              .join(" ")}
            fill="none"
            stroke="currentColor"
            strokeOpacity={0.08}
            strokeWidth={1}
          />
        ))}

        {/* Axis lines */}
        {angles.map((angle, i) => (
          <line
            key={i}
            x1={cx}
            y1={cy}
            x2={cx + radius * Math.cos(angle)}
            y2={cy + radius * Math.sin(angle)}
            stroke="currentColor"
            strokeOpacity={0.06}
            strokeWidth={1}
          />
        ))}

        {/* Score polygon */}
        <motion.polygon
          points={scorePath}
          fill="rgba(34, 197, 94, 0.12)"
          stroke="rgba(34, 197, 94, 0.8)"
          strokeWidth={1.5}
          strokeLinejoin="round"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
          style={{ transformOrigin: `${cx}px ${cy}px` }}
        />

        {/* Score dots */}
        {categories.map((cat, i) => {
          const r = (cat.score / 100) * radius;
          const x = cx + r * Math.cos(angles[i]!);
          const y = cy + r * Math.sin(angles[i]!);
          return (
            <motion.circle
              key={cat.category}
              cx={x}
              cy={y}
              r={3}
              fill="rgba(34, 197, 94, 1)"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.8 + i * 0.08 }}
            />
          );
        })}
      </svg>

      {/* Labels */}
      {categories.map((cat, i) => {
        const x = cx + labelRadius * Math.cos(angles[i]!);
        const y = cy + labelRadius * Math.sin(angles[i]!);
        const isLeft = Math.cos(angles[i]!) < -0.1;
        const isRight = Math.cos(angles[i]!) > 0.1;

        return (
          <motion.div
            key={cat.category}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.0 + i * 0.08, duration: 0.3 }}
            className="absolute text-[10px] tracking-wider text-fg-dim whitespace-nowrap"
            style={{
              left: x,
              top: y,
              transform: `translate(${isLeft ? "-100%" : isRight ? "0%" : "-50%"}, -50%)`,
            }}
          >
            {cat.label}
          </motion.div>
        );
      })}
    </div>
  );
}
