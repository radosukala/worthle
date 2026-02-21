export type Track = "backend" | "frontend" | "fullstack" | "mobile" | "devops" | "data" | "qa";

export type Language =
  | "javascript"
  | "typescript"
  | "python"
  | "rust"
  | "go"
  | "java"
  | "csharp"
  | "swift"
  | "kotlin"
  | "php"
  | "ruby";

export type Experience = "0-2" | "3-5" | "6-10" | "11-15" | "16+";

export type QuestionType = "bug" | "output" | "scales" | "slow" | "diff";

export type SkillCategory =
  | "systems_design"
  | "databases"
  | "concurrency"
  | "api_design"
  | "debugging"
  | "performance"
  | "security"
  | "testing"
  | "ui_components"
  | "state_management"
  | "css_layout"
  | "accessibility"
  | "data_modeling"
  | "algorithms";

export interface Question {
  id: string;
  track: Track;
  language: Language;
  category: SkillCategory;
  difficulty: 1 | 2 | 3 | 4 | 5;
  type: QuestionType;
  prompt: string;
  code: string;
  options: [string, string, string];
  correct: 0 | 1 | 2;
  timeLimitMs: number;
}

export interface Answer {
  questionId: string;
  selected: 0 | 1 | 2 | null;
  timeMs: number;
  correct: boolean;
  category: SkillCategory;
}

export interface Identity {
  track: Track;
  language: Language;
  secondaryLanguage?: Language;
  experience: Experience;
}

export interface SkillFingerprint {
  categories: { category: SkillCategory; label: string; score: number }[];
  overall: number;
  percentile: number;
}

export interface SalaryRange {
  location: string;
  min: number;
  max: number;
  currency: string;
}

export type Sentiment = "fair" | "below" | "underpaid";

export interface GameResult {
  fingerprint: SkillFingerprint;
  salaryRange: SalaryRange | null;
  identity: Identity;
  shareId: string;
  sentiment?: Sentiment;
}

export type GameMode = "daily" | "full";

export type GamePhase = "landing" | "identity" | "playing" | "results";

export interface DailyStreak {
  current: number;
  best: number;
  lastDate: string; // YYYY-MM-DD
  completedToday: boolean;
}
