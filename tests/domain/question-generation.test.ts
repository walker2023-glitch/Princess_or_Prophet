import { describe, expect, it } from "vitest";
import { generateQuestionDrafts } from "../../lib/domain/question-generation";
import type { Quote } from "../../lib/domain/quote-schema";

const quote: Quote = {
  text: "A verified sample quotation for testing.",
  speakerName: "Sample Speaker",
  speakerCategory: "prophet",
  year: 2020,
  sourceTitle: "Sample Talk",
  sourceType: "general_conference",
  sourceUrl: "",
  explanation: "",
  theme: "",
  alternativeSpeakers: ["Sample Princess", "Sample Author"],
  alternativeSources: ["Sample Movie", "Sample Book"],
  alternativeQuotes: [
    "A different sample quotation for testing.",
    "Another sample quotation for testing."
  ]
};

describe("generateQuestionDrafts", () => {
  it("creates the five initial question types", () => {
    const drafts = generateQuestionDrafts(quote);
    expect(drafts).toHaveLength(5);
    expect(drafts.map((draft) => draft.type)).toEqual([
      "category",
      "speaker",
      "authentic_quote",
      "year_or_decade",
      "source"
    ]);
  });

  it("keeps generated drafts unreviewed", () => {
    expect(generateQuestionDrafts(quote).every((draft) => !draft.reviewed)).toBe(true);
  });

  it("includes the correct answer in every draft", () => {
    for (const draft of generateQuestionDrafts(quote)) {
      expect(draft.options).toContain(draft.correctAnswer);
    }
  });
});