import type { Answer, Identity, SkillFingerprint, SkillCategory } from "./types";
import { TRACK_CATEGORIES } from "./constants";

export function computeFingerprint(
  answers: Answer[],
  identity: Identity
): SkillFingerprint {
  const categories = TRACK_CATEGORIES[identity.track];
  const categoryScores: Record<string, { total: number; count: number }> = {};

  for (const cat of categories) {
    categoryScores[cat.category] = { total: 0, count: 0 };
  }

  for (const answer of answers) {
    const bucket = categoryScores[answer.category];
    if (!bucket) continue;

    bucket.count += 1;

    if (answer.correct) {
      // Base score for correct answer
      let score = 70;
      // Speed bonus: faster answers get up to 30 extra points
      const timeRatio = answer.timeMs / 12000;
      if (timeRatio < 0.5) score += 30;
      else if (timeRatio < 0.75) score += 20;
      else score += 10;

      bucket.total += score;
    } else if (answer.selected !== null) {
      // Attempted but wrong
      bucket.total += 15;
    }
    // Timeout = 0 points
  }

  const computedCategories = categories.map((cat) => {
    const bucket = categoryScores[cat.category];
    const score = bucket.count > 0 ? Math.round(bucket.total / bucket.count) : 50;
    return {
      category: cat.category as SkillCategory,
      label: cat.label,
      score: Math.min(100, Math.max(0, score)),
    };
  });

  const overall =
    computedCategories.length > 0
      ? Math.round(
          computedCategories.reduce((sum, c) => sum + c.score, 0) /
            computedCategories.length
        )
      : 50;

  // Map overall score to a percentile (simplified model)
  const percentile = scoreToPercentile(overall, identity.experience);

  return {
    categories: computedCategories,
    overall,
    percentile,
  };
}

function scoreToPercentile(score: number, experience: string): number {
  // Higher experience brackets are weighted to account for harder competition
  const expMultiplier: Record<string, number> = {
    "0-2": 1.1,
    "3-5": 1.0,
    "6-10": 0.95,
    "11-15": 0.9,
    "16+": 0.85,
  };

  const multiplier = expMultiplier[experience] ?? 1.0;
  const adjustedScore = Math.min(100, score * multiplier);

  // S-curve mapping: scores cluster around middle percentiles
  const normalized = adjustedScore / 100;
  const percentile = Math.round(
    100 / (1 + Math.exp(-8 * (normalized - 0.5)))
  );

  return Math.min(99, Math.max(1, percentile));
}
