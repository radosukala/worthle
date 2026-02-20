import type { DailyStreak } from "./types";

const STREAK_KEY = "worthle-streak";
const DAILY_IDENTITY_KEY = "worthle-daily-identity";

function getTodayString(): string {
  return new Date().toISOString().split("T")[0]!;
}

/** Seeded PRNG — same seed produces same sequence every time */
function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

/** Generate a numeric seed from today's date string */
export function dailySeed(): number {
  const today = getTodayString();
  let hash = 0;
  for (let i = 0; i < today.length; i++) {
    hash = (hash << 5) - hash + today.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

/** Shuffle an array deterministically using a seed */
export function seededShuffle<T>(array: T[], seed: number): T[] {
  const shuffled = [...array];
  const rand = seededRandom(seed);
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j]!, shuffled[i]!];
  }
  return shuffled;
}

export function getStreak(): DailyStreak {
  if (typeof window === "undefined") {
    return { current: 0, best: 0, lastDate: "", completedToday: false };
  }

  try {
    const stored = localStorage.getItem(STREAK_KEY);
    if (!stored) return { current: 0, best: 0, lastDate: "", completedToday: false };

    const streak: DailyStreak = JSON.parse(stored);
    const today = getTodayString();

    // Check if streak is still active
    if (streak.lastDate === today) {
      return { ...streak, completedToday: true };
    }

    const lastDate = new Date(streak.lastDate);
    const todayDate = new Date(today);
    const diffDays = Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays > 1) {
      // Streak broken
      return { current: 0, best: streak.best, lastDate: streak.lastDate, completedToday: false };
    }

    return { ...streak, completedToday: false };
  } catch {
    return { current: 0, best: 0, lastDate: "", completedToday: false };
  }
}

export function completeDaily(): DailyStreak {
  const streak = getStreak();
  const today = getTodayString();

  if (streak.completedToday) return streak;

  const newCurrent = streak.current + 1;
  const newStreak: DailyStreak = {
    current: newCurrent,
    best: Math.max(newCurrent, streak.best),
    lastDate: today,
    completedToday: true,
  };

  try {
    localStorage.setItem(STREAK_KEY, JSON.stringify(newStreak));
  } catch {}

  return newStreak;
}

/** Save daily identity so user doesn't have to re-select */
export function saveDailyIdentity(identity: { track: string; language: string; experience: string }) {
  try {
    localStorage.setItem(DAILY_IDENTITY_KEY, JSON.stringify(identity));
  } catch {}
}

export function loadDailyIdentity(): { track: string; language: string; experience: string } | null {
  try {
    const stored = localStorage.getItem(DAILY_IDENTITY_KEY);
    if (!stored) return null;
    return JSON.parse(stored);
  } catch {
    return null;
  }
}
