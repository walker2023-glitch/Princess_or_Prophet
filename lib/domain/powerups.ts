import type { QuestionType } from "./question-generation";

export type PowerupType =
  | "reveal_decade"
  | "reveal_reality"
  | "remove_one"
  | "source_hint";

export type PowerupContext = {
  type: PowerupType;
  questionType: QuestionType;
  phase: "power_up_selection" | "question_open" | "answer_lock" | "reveal";
  inventory: number;
};

const answerHelpTypes: Record<PowerupType, QuestionType[]> = {
  reveal_decade: ["year_or_decade"],
  reveal_reality: ["category", "speaker"],
  remove_one: ["category", "speaker", "authentic_quote", "year_or_decade", "source"],
  source_hint: ["source", "speaker", "authentic_quote"]
};

export function canUsePowerup(context: PowerupContext): boolean {
  if (context.inventory < 1) {
    return false;
  }

  if (context.phase === "reveal") {
    return false;
  }

  return answerHelpTypes[context.type].includes(context.questionType);
}