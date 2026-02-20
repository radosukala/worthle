import type { Track, Experience, SalaryRange } from "./types";

interface SalaryBand {
  p25: number;
  p50: number;
  p75: number;
  p90: number;
}

// Location multipliers relative to US base
const LOCATION_MULTIPLIERS: Record<string, { multiplier: number; currency: string }> = {
  "san-francisco": { multiplier: 1.15, currency: "$" },
  "new-york": { multiplier: 1.1, currency: "$" },
  "london": { multiplier: 0.75, currency: "£" },
  "berlin": { multiplier: 0.6, currency: "€" },
  "amsterdam": { multiplier: 0.65, currency: "€" },
  "paris": { multiplier: 0.6, currency: "€" },
  "prague": { multiplier: 0.4, currency: "€" },
  "zurich": { multiplier: 0.95, currency: "CHF " },
  "toronto": { multiplier: 0.7, currency: "CA$" },
  "sydney": { multiplier: 0.72, currency: "A$" },
  "singapore": { multiplier: 0.65, currency: "S$" },
  "bangalore": { multiplier: 0.25, currency: "₹" },
  "remote-us": { multiplier: 1.0, currency: "$" },
  "remote-eu": { multiplier: 0.65, currency: "€" },
};

// Base salary bands (US, annual) by track × experience
const BASE_SALARY: Record<Track, Record<Experience, SalaryBand>> = {
  backend: {
    "0-2": { p25: 85000, p50: 105000, p75: 130000, p90: 155000 },
    "3-5": { p25: 120000, p50: 145000, p75: 175000, p90: 210000 },
    "6-10": { p25: 150000, p50: 185000, p75: 225000, p90: 270000 },
    "11-15": { p25: 175000, p50: 215000, p75: 260000, p90: 310000 },
    "16+": { p25: 195000, p50: 240000, p75: 290000, p90: 350000 },
  },
  frontend: {
    "0-2": { p25: 78000, p50: 95000, p75: 120000, p90: 145000 },
    "3-5": { p25: 110000, p50: 135000, p75: 165000, p90: 195000 },
    "6-10": { p25: 140000, p50: 170000, p75: 210000, p90: 250000 },
    "11-15": { p25: 160000, p50: 200000, p75: 245000, p90: 290000 },
    "16+": { p25: 180000, p50: 225000, p75: 270000, p90: 325000 },
  },
  fullstack: {
    "0-2": { p25: 82000, p50: 100000, p75: 125000, p90: 150000 },
    "3-5": { p25: 115000, p50: 140000, p75: 170000, p90: 200000 },
    "6-10": { p25: 145000, p50: 178000, p75: 218000, p90: 260000 },
    "11-15": { p25: 168000, p50: 208000, p75: 252000, p90: 300000 },
    "16+": { p25: 188000, p50: 232000, p75: 280000, p90: 338000 },
  },
  mobile: {
    "0-2": { p25: 80000, p50: 98000, p75: 122000, p90: 148000 },
    "3-5": { p25: 112000, p50: 138000, p75: 168000, p90: 198000 },
    "6-10": { p25: 142000, p50: 175000, p75: 215000, p90: 255000 },
    "11-15": { p25: 165000, p50: 205000, p75: 248000, p90: 295000 },
    "16+": { p25: 185000, p50: 228000, p75: 275000, p90: 330000 },
  },
  devops: {
    "0-2": { p25: 88000, p50: 108000, p75: 132000, p90: 158000 },
    "3-5": { p25: 125000, p50: 150000, p75: 180000, p90: 215000 },
    "6-10": { p25: 155000, p50: 190000, p75: 230000, p90: 275000 },
    "11-15": { p25: 178000, p50: 220000, p75: 265000, p90: 315000 },
    "16+": { p25: 198000, p50: 245000, p75: 295000, p90: 355000 },
  },
  data: {
    "0-2": { p25: 82000, p50: 102000, p75: 128000, p90: 155000 },
    "3-5": { p25: 118000, p50: 145000, p75: 175000, p90: 210000 },
    "6-10": { p25: 150000, p50: 185000, p75: 228000, p90: 272000 },
    "11-15": { p25: 172000, p50: 215000, p75: 262000, p90: 315000 },
    "16+": { p25: 192000, p50: 240000, p75: 292000, p90: 350000 },
  },
};

export function computeSalaryRange(
  track: Track,
  experience: Experience,
  percentile: number,
  location: string
): SalaryRange {
  const band = BASE_SALARY[track][experience];
  const loc = LOCATION_MULTIPLIERS[location] ?? LOCATION_MULTIPLIERS["remote-us"]!;

  // Interpolate salary based on percentile
  let baseSalary: number;
  if (percentile <= 25) {
    baseSalary = band.p25;
  } else if (percentile <= 50) {
    const t = (percentile - 25) / 25;
    baseSalary = band.p25 + t * (band.p50 - band.p25);
  } else if (percentile <= 75) {
    const t = (percentile - 50) / 25;
    baseSalary = band.p50 + t * (band.p75 - band.p50);
  } else {
    const t = (percentile - 75) / 25;
    baseSalary = band.p75 + t * (band.p90 - band.p75);
  }

  const localSalary = baseSalary * loc.multiplier;

  // Create a range (±12% around the point estimate)
  const min = Math.round(localSalary * 0.88 / 1000) * 1000;
  const max = Math.round(localSalary * 1.12 / 1000) * 1000;

  return {
    location,
    min,
    max,
    currency: loc.currency,
  };
}

export function formatSalary(amount: number, currency: string): string {
  if (currency === "₹") {
    // Indian rupees: use lakhs
    if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)}L`;
    }
  }
  return `${currency}${amount.toLocaleString("en-US")}`;
}
