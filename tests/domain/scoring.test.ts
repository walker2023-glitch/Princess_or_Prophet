import { describe, expect, it } from "vitest";
import { calculatePoints, confidenceMultiplier } from "../../lib/domain/scoring";

describe("confidence scoring", () => {
  it("maps confidence 1 to 0.65x and confidence 10 to 2x", () => {
    expect(confidenceMultiplier(1)).toBe(0.65);
    expect(confidenceMultiplier(10)).toBe(2);
  });

  it("awards more points for correct high-confidence answers", () => {
    expect(calculatePoints({
      basePoints: 100,
      isCorrect: true,
      confidence: 10
    }).pointsAwarded).toBe(200);

    expect(calculatePoints({
      basePoints: 100,
      isCorrect: true,
      confidence: 1
    }).pointsAwarded).toBe(65);
  });

  it("awards zero points for an incorrect answer in classroom mode", () => {
    expect(calculatePoints({
      basePoints: 100,
      isCorrect: false,
      confidence: 10
    }).pointsAwarded).toBe(0);
  });

  it("rejects confidence outside 1 through 10", () => {
    expect(() => confidenceMultiplier(0)).toThrow();
    expect(() => confidenceMultiplier(11)).toThrow();
  });
});