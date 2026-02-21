import type { Track, Language, Experience, SkillCategory } from "./types";

export const TRACKS: { value: Track; label: string }[] = [
  { value: "backend", label: "Backend" },
  { value: "frontend", label: "Frontend" },
  { value: "fullstack", label: "Fullstack" },
  { value: "mobile", label: "Mobile" },
  { value: "devops", label: "DevOps" },
  { value: "data", label: "Data" },
  { value: "qa", label: "QA" },
];

export const LANGUAGES: { value: Language; label: string }[] = [
  { value: "javascript", label: "JavaScript" },
  { value: "typescript", label: "TypeScript" },
  { value: "python", label: "Python" },
  { value: "rust", label: "Rust" },
  { value: "go", label: "Go" },
  { value: "java", label: "Java" },
  { value: "csharp", label: "C#" },
  { value: "swift", label: "Swift" },
  { value: "kotlin", label: "Kotlin" },
  { value: "php", label: "PHP" },
  { value: "ruby", label: "Ruby" },
];

export const EXPERIENCE_LEVELS: { value: Experience; label: string }[] = [
  { value: "0-2", label: "0–2 years" },
  { value: "3-5", label: "3–5 years" },
  { value: "6-10", label: "6–10 years" },
  { value: "11-15", label: "11–15 years" },
  { value: "16+", label: "16+ years" },
];

export const TRACK_CATEGORIES: Record<Track, { category: SkillCategory; label: string }[]> = {
  backend: [
    { category: "systems_design", label: "Systems Design" },
    { category: "databases", label: "Databases" },
    { category: "concurrency", label: "Concurrency" },
    { category: "api_design", label: "API Design" },
    { category: "debugging", label: "Debugging" },
    { category: "performance", label: "Performance" },
  ],
  frontend: [
    { category: "ui_components", label: "Components" },
    { category: "state_management", label: "State Mgmt" },
    { category: "css_layout", label: "CSS & Layout" },
    { category: "performance", label: "Performance" },
    { category: "accessibility", label: "Accessibility" },
    { category: "debugging", label: "Debugging" },
  ],
  fullstack: [
    { category: "systems_design", label: "Systems Design" },
    { category: "api_design", label: "API Design" },
    { category: "databases", label: "Databases" },
    { category: "ui_components", label: "Components" },
    { category: "performance", label: "Performance" },
    { category: "debugging", label: "Debugging" },
  ],
  mobile: [
    { category: "ui_components", label: "UI/UX" },
    { category: "state_management", label: "State Mgmt" },
    { category: "performance", label: "Performance" },
    { category: "concurrency", label: "Concurrency" },
    { category: "debugging", label: "Debugging" },
    { category: "security", label: "Security" },
  ],
  devops: [
    { category: "systems_design", label: "Infrastructure" },
    { category: "security", label: "Security" },
    { category: "performance", label: "Performance" },
    { category: "debugging", label: "Debugging" },
    { category: "concurrency", label: "Concurrency" },
    { category: "data_modeling", label: "Monitoring" },
  ],
  data: [
    { category: "databases", label: "Databases" },
    { category: "algorithms", label: "Algorithms" },
    { category: "data_modeling", label: "Data Modeling" },
    { category: "performance", label: "Performance" },
    { category: "systems_design", label: "Pipelines" },
    { category: "debugging", label: "Debugging" },
  ],
  qa: [
    { category: "testing", label: "Test Design" },
    { category: "debugging", label: "Debugging" },
    { category: "performance", label: "Perf Testing" },
    { category: "api_design", label: "API Testing" },
    { category: "security", label: "Security" },
    { category: "systems_design", label: "Test Infra" },
  ],
};

/** Languages shown per track in the identity selector */
export const TRACK_LANGUAGES: Record<Track, Language[]> = {
  backend: ["typescript", "javascript", "python", "go", "rust", "java", "csharp"],
  frontend: ["typescript", "javascript"],
  fullstack: ["typescript", "javascript", "python", "csharp", "java", "go"],
  mobile: ["swift", "kotlin"],
  data: ["python"],
  devops: ["typescript"],
  qa: ["python", "typescript"],
};

export const DAILY_ROUND_COUNT = 5;
export const FULL_ROUND_COUNT = 20;
export const DEFAULT_TIME_LIMIT_MS = 20000;

export const LOCATIONS = [
  { value: "san-francisco", label: "San Francisco", currency: "$" },
  { value: "new-york", label: "New York", currency: "$" },
  { value: "london", label: "London", currency: "£" },
  { value: "berlin", label: "Berlin", currency: "€" },
  { value: "amsterdam", label: "Amsterdam", currency: "€" },
  { value: "paris", label: "Paris", currency: "€" },
  { value: "prague", label: "Prague", currency: "€" },
  { value: "zurich", label: "Zurich", currency: "CHF " },
  { value: "toronto", label: "Toronto", currency: "CA$" },
  { value: "sydney", label: "Sydney", currency: "A$" },
  { value: "singapore", label: "Singapore", currency: "S$" },
  { value: "bangalore", label: "Bangalore", currency: "₹" },
  { value: "remote-us", label: "Remote (US)", currency: "$" },
  { value: "remote-eu", label: "Remote (EU)", currency: "€" },
];
