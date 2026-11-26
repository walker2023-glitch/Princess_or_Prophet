import type { PowerupType } from "../domain/powerups";

export type GameScreen =
  | "join"
  | "waiting"
  | "powerup"
  | "question"
  | "confidence"
  | "locked"
  | "reveal"
  | "leaderboard"
  | "results";

export type MockQuestion = {
  id: string;
  quote: string;
  prompt: string;
  options: string[];
  correctAnswer: string;
  speaker: string;
  category: string;
  year: number;
  sourceTitle: string;
  sourceType: string;
  explanation: string;
};

export type MockPlayer = {
  id: string;
  name: string;
  token: string;
  score: number;
  streak: number;
  position: number;
};

export type RevealState = {
  isCorrect: boolean;
  basePoints: number;
  confidenceMultiplier: number;
  pointsAwarded: number;
  powerupMessage: string;
};

export type StudentGameState = {
  screen: GameScreen;
  nickname: string;
  token: string;
  gamePin: string;
  questionIndex: number;
  score: number;
  streak: number;
  correctCount: number;
  bestConfidence: number;
  selectedAnswer: string | null;
  confidence: number;
  reservedPowerup: PowerupType | null;
  activePowerup: PowerupType | null;
  usedPowerups: PowerupType[];
  disabledOptions: string[];
  clues: string[];
  reveal: RevealState | null;
  powerupInventory: Record<PowerupType, number>;
  players: MockPlayer[];
  questions: MockQuestion[];
};