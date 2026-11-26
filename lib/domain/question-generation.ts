import type { Quote } from "./quote-schema";

export type QuestionType =
  | "category"
  | "speaker"
  | "authentic_quote"
  | "year_or_decade"
  | "source";

export type QuestionDraft = {
  id: string;
  type: QuestionType;
  prompt: string;
  options: string[];
  correctAnswer: string;
  reviewed: boolean;
};

function uniqueOptions(correctAnswer: string, alternatives: string[]): string[] {
  const values = [correctAnswer, ...alternatives]
    .map((value) => value.trim())
    .filter(Boolean)
    .filter((value, index, all) => all.indexOf(value) === index);

  while (values.length < 4) {
    values.push("Add an answer option");
  }

  return values.slice(0, 4);
}

function decade(year: number): string {
  return String(Math.floor(year / 10) * 10) + "s";
}

export function generateQuestionDrafts(quote: Quote): QuestionDraft[] {
  const categoryLabel: Record<Quote["speakerCategory"], string> = {
    prophet: "Prophet",
    princess: "Princess",
    other_real_person: "Other real person",
    other_fictional_character: "Other fictional character"
  };

  const categoryOptions = uniqueOptions(categoryLabel[quote.speakerCategory], [
    "Prophet",
    "Princess",
    "Other real person",
    "Other fictional character"
  ]);

  const yearOptions = uniqueOptions(String(quote.year), [
    String(quote.year - 10),
    String(quote.year + 10),
    decade(quote.year)
  ]);

  return [
    {
      id: "category",
      type: "category",
      prompt: "Was this said by a prophet, princess, or another type of speaker?",
      options: categoryOptions,
      correctAnswer: categoryLabel[quote.speakerCategory],
      reviewed: false
    },
    {
      id: "speaker",
      type: "speaker",
      prompt: "Who actually said this quotation?",
      options: uniqueOptions(quote.speakerName, quote.alternativeSpeakers),
      correctAnswer: quote.speakerName,
      reviewed: false
    },
    {
      id: "authentic_quote",
      type: "authentic_quote",
      prompt: "Which of these is the authentic quotation?",
      options: uniqueOptions(quote.text, quote.alternativeQuotes),
      correctAnswer: quote.text,
      reviewed: false
    },
    {
      id: "year_or_decade",
      type: "year_or_decade",
      prompt: "Which year is associated with this quotation?",
      options: yearOptions,
      correctAnswer: String(quote.year),
      reviewed: false
    },
    {
      id: "source",
      type: "source",
      prompt: "Where did this quotation come from?",
      options: uniqueOptions(quote.sourceTitle, quote.alternativeSources),
      correctAnswer: quote.sourceTitle,
      reviewed: false
    }
  ];
}