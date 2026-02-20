import type { Question, Track, Language } from "./types";
import { DAILY_ROUND_COUNT, FULL_ROUND_COUNT } from "./constants";
import { dailySeed, seededShuffle } from "./daily";

// Import all question data
import typescriptBackend from "@/data/questions/backend/typescript.json";
import typescriptFrontend from "@/data/questions/frontend/typescript.json";
import javascriptBackend from "@/data/questions/backend/javascript.json";
import javascriptFrontend from "@/data/questions/frontend/javascript.json";
import pythonBackend from "@/data/questions/backend/python.json";
import goBackend from "@/data/questions/backend/go.json";
import rustBackend from "@/data/questions/backend/rust.json";
import javaBackend from "@/data/questions/backend/java.json";
import typescriptFullstack from "@/data/questions/fullstack/typescript.json";
import swiftMobile from "@/data/questions/mobile/swift.json";
import kotlinMobile from "@/data/questions/mobile/kotlin.json";
import pythonData from "@/data/questions/data/python.json";
import typescriptDevops from "@/data/questions/devops/typescript.json";

type QuestionPool = Record<string, Question[]>;

const pools: QuestionPool = {
  // Backend
  "backend:typescript": typescriptBackend as Question[],
  "backend:javascript": javascriptBackend as Question[],
  "backend:python": pythonBackend as Question[],
  "backend:go": goBackend as Question[],
  "backend:rust": rustBackend as Question[],
  "backend:java": javaBackend as Question[],

  // Frontend
  "frontend:typescript": typescriptFrontend as Question[],
  "frontend:javascript": javascriptFrontend as Question[],

  // Fullstack
  "fullstack:typescript": typescriptFullstack as Question[],
  "fullstack:javascript": [...(javascriptBackend as Question[]), ...(javascriptFrontend as Question[])],

  // Mobile
  "mobile:swift": swiftMobile as Question[],
  "mobile:kotlin": kotlinMobile as Question[],

  // Data
  "data:python": pythonData as Question[],

  // DevOps
  "devops:typescript": typescriptDevops as Question[],
};

// For languages/tracks without dedicated questions, fall back to the closest match
const FALLBACK_MAP: Record<string, string> = {
  // Backend languages → fall back to typescript backend
  "backend:csharp": "backend:typescript",
  "backend:swift": "backend:typescript",
  "backend:kotlin": "backend:typescript",
  "backend:php": "backend:typescript",
  "backend:ruby": "backend:typescript",

  // Frontend languages → fall back to javascript frontend
  "frontend:python": "frontend:javascript",
  "frontend:rust": "frontend:javascript",
  "frontend:go": "frontend:javascript",
  "frontend:java": "frontend:javascript",
  "frontend:csharp": "frontend:javascript",
  "frontend:swift": "frontend:javascript",
  "frontend:kotlin": "frontend:javascript",
  "frontend:php": "frontend:javascript",
  "frontend:ruby": "frontend:javascript",

  // Fullstack → fall back to typescript fullstack
  "fullstack:python": "fullstack:typescript",
  "fullstack:rust": "fullstack:typescript",
  "fullstack:go": "fullstack:typescript",
  "fullstack:java": "fullstack:typescript",
  "fullstack:csharp": "fullstack:typescript",
  "fullstack:swift": "fullstack:typescript",
  "fullstack:kotlin": "fullstack:typescript",
  "fullstack:php": "fullstack:typescript",
  "fullstack:ruby": "fullstack:typescript",

  // Mobile → fall back to swift mobile (closest mobile content)
  "mobile:typescript": "mobile:swift",
  "mobile:javascript": "mobile:swift",
  "mobile:python": "mobile:swift",
  "mobile:rust": "mobile:swift",
  "mobile:go": "mobile:swift",
  "mobile:java": "mobile:kotlin",
  "mobile:csharp": "mobile:swift",
  "mobile:php": "mobile:swift",
  "mobile:ruby": "mobile:swift",

  // DevOps → fall back to typescript devops
  "devops:javascript": "devops:typescript",
  "devops:python": "devops:typescript",
  "devops:rust": "devops:typescript",
  "devops:go": "devops:typescript",
  "devops:java": "devops:typescript",
  "devops:csharp": "devops:typescript",
  "devops:swift": "devops:typescript",
  "devops:kotlin": "devops:typescript",
  "devops:php": "devops:typescript",
  "devops:ruby": "devops:typescript",

  // Data → fall back to python data
  "data:typescript": "data:python",
  "data:javascript": "data:python",
  "data:rust": "data:python",
  "data:go": "data:python",
  "data:java": "data:python",
  "data:csharp": "data:python",
  "data:swift": "data:python",
  "data:kotlin": "data:python",
  "data:php": "data:python",
  "data:ruby": "data:python",
};

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j]!, shuffled[i]!];
  }
  return shuffled;
}

function getPool(track: Track, language: Language): Question[] {
  const key = `${track}:${language}`;

  // Direct match
  if (pools[key] && pools[key].length > 0) {
    return pools[key];
  }

  // Fallback match
  const fallbackKey = FALLBACK_MAP[key];
  if (fallbackKey && pools[fallbackKey] && pools[fallbackKey].length > 0) {
    return pools[fallbackKey];
  }

  // Last resort
  const firstAvailable = Object.values(pools).find((p) => p.length > 0);
  return firstAvailable ?? [];
}

/** Get randomized questions for the full assessment */
export function getQuestions(track: Track, language: Language, count: number = FULL_ROUND_COUNT): Question[] {
  const pool = getPool(track, language);
  const shuffled = shuffleArray(pool);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

/** Get today's daily questions — same for everyone with the same track/language */
export function getDailyQuestions(track: Track, language: Language): Question[] {
  const pool = getPool(track, language);
  const seed = dailySeed();
  const shuffled = seededShuffle(pool, seed);
  return shuffled.slice(0, Math.min(DAILY_ROUND_COUNT, shuffled.length));
}
