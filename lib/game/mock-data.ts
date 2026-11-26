import type { MockPlayer, MockQuestion } from "./types";

export const mockQuestions: MockQuestion[] = [
  {
    id: "question-1",
    quote: "Courage is not the absence of fear, but the judgment that something else is more important than fear.",
    prompt: "Who actually said this?",
    options: ["Princess Merida", "President Thomas S. Monson", "Mulan", "Jane Eyre"],
    correctAnswer: "Princess Merida",
    speaker: "Princess Merida",
    category: "Fictional character",
    year: 2012,
    sourceTitle: "Brave",
    sourceType: "Movie",
    explanation: "This quote is commonly associated with Merida in Brave. The game should link to a reviewed source before public use."
  },
  {
    id: "question-2",
    quote: "Small and simple things can bring about great things.",
    prompt: "Was this said by a prophet or a princess?",
    options: ["Prophet", "Princess", "Other real person", "Other fictional character"],
    correctAnswer: "Prophet",
    speaker: "A scripture prophet",
    category: "Prophet",
    year: 1980,
    sourceTitle: "A reviewed scripture or conference source",
    sourceType: "Talk or scripture",
    explanation: "This sample is intentionally labeled for review. Replace it with a verified quotation before classroom use."
  },
  {
    id: "question-3",
    quote: "The flower that blooms in adversity is the most rare and beautiful of all.",
    prompt: "What source type is associated with this quote?",
    options: ["Movie", "General conference", "Scripture", "Interview"],
    correctAnswer: "Movie",
    speaker: "The Emperor",
    category: "Fictional character",
    year: 1998,
    sourceTitle: "Mulan",
    sourceType: "Movie",
    explanation: "This sample demonstrates a source-type question. All public quotations must be reviewed for accuracy and permissions."
  }
];

export const mockPlayers: MockPlayer[] = [
  { id: "maya", name: "Maya_Speeder", token: "⚡", score: 4120, streak: 4, position: 78 },
  { id: "jordan", name: "Jordan_Q", token: "🚀", score: 3890, streak: 2, position: 69 },
  { id: "caleb", name: "Caleb_G", token: "🛸", score: 3650, streak: 3, position: 62 },
  { id: "student", name: "Sam_Racer", token: "🏎️", score: 3420, streak: 3, position: 54 },
  { id: "emma", name: "Emma_K", token: "✨", score: 3010, streak: 1, position: 41 },
  { id: "liam", name: "Liam_B", token: "🛞", score: 1850, streak: 0, position: 24 }
];