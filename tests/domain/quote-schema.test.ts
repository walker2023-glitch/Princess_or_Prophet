import { describe, expect, it } from "vitest";
import { quoteSchema } from "../../lib/domain/quote-schema";

const validQuote = {
  text: "A verified sample quotation for testing.",
  speakerName: "Sample Speaker",
  speakerCategory: "prophet" as const,
  year: 2020,
  sourceTitle: "Sample Talk",
  sourceType: "general_conference" as const,
  sourceUrl: "https://example.com/source",
  explanation: "",
  theme: "",
  alternativeSpeakers: [],
  alternativeSources: [],
  alternativeQuotes: []
};

describe("quoteSchema", () => {
  it("accepts a complete quote", () => {
    expect(quoteSchema.safeParse(validQuote).success).toBe(true);
  });

  it("rejects a missing speaker", () => {
    expect(quoteSchema.safeParse({ ...validQuote, speakerName: "" }).success).toBe(false);
  });

  it("allows optional explanation and theme to be empty", () => {
    expect(quoteSchema.safeParse(validQuote).success).toBe(true);
  });
});