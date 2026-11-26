export function confidenceMultiplier(confidence: number): number {
  if (!Number.isInteger(confidence) || confidence < 1 || confidence > 10) {
    throw new Error("Confidence must be an integer from 1 through 10.");
  }

  return Number((0.5 + confidence * 0.15).toFixed(2));
}

export type ScoreInput = {
  basePoints: number;
  isCorrect: boolean;
  confidence: number;
  bonusMultiplier?: number;
};

export type ScoreResult = {
  confidenceMultiplier: number;
  pointsAwarded: number;
};

export function calculatePoints(input: ScoreInput): ScoreResult {
  if (!Number.isFinite(input.basePoints) || input.basePoints < 0) {
    throw new Error("Base points must be a nonnegative number.");
  }

  const multiplier = confidenceMultiplier(input.confidence);
  const bonusMultiplier = input.bonusMultiplier ?? 1;

  if (!Number.isFinite(bonusMultiplier) || bonusMultiplier < 0) {
    throw new Error("Bonus multiplier must be nonnegative.");
  }

  const pointsAwarded = input.isCorrect
    ? Math.round(input.basePoints * multiplier * bonusMultiplier)
    : 0;

  return {
    confidenceMultiplier: multiplier,
    pointsAwarded
  };
}