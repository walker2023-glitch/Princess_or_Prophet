import { z } from "zod";

export const speakerCategorySchema = z.enum([
  "prophet",
  "princess",
  "other_real_person",
  "other_fictional_character"
]);

export const sourceTypeSchema = z.enum([
  "general_conference",
  "church_talk",
  "scripture",
  "movie",
  "book",
  "interview",
  "other"
]);

export const quoteSchema = z.object({
  text: z.string().trim().min(5, "Enter the quotation text."),
  speakerName: z.string().trim().min(2, "Enter the speaker name."),
  speakerCategory: speakerCategorySchema,
  year: z.number().int().min(1).max(3000),
  sourceTitle: z.string().trim().min(2, "Enter the talk, movie, or book title."),
  sourceType: sourceTypeSchema,
  sourceUrl: z.string().trim().url("Enter a valid source URL.").or(z.literal("")),
  explanation: z.string().trim().max(1000),
  theme: z.string().trim().max(100),
  alternativeSpeakers: z.array(z.string().trim().min(1)).max(6),
  alternativeSources: z.array(z.string().trim().min(1)).max(6),
  alternativeQuotes: z.array(z.string().trim().min(5)).max(6)
});

export type Quote = z.infer<typeof quoteSchema>;
export type SpeakerCategory = z.infer<typeof speakerCategorySchema>;
export type SourceType = z.infer<typeof sourceTypeSchema>;

export const defaultQuote: Quote = {
  text: "",
  speakerName: "",
  speakerCategory: "prophet",
  year: new Date().getFullYear(),
  sourceTitle: "",
  sourceType: "general_conference",
  sourceUrl: "",
  explanation: "",
  theme: "",
  alternativeSpeakers: [],
  alternativeSources: [],
  alternativeQuotes: []
};