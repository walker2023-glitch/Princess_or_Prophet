import { calculatePoints } from "../domain/scoring";
import type { PowerupType } from "../domain/powerups";
import type { MockPlayer, StudentGameState } from "./types";

export type GameAction =
  | { type: "set_nickname"; nickname: string }
  | { type: "set_token"; token: string }
  | { type: "join" }
  | { type: "start_game" }
  | { type: "select_powerup"; powerup: PowerupType | null }
  | { type: "begin_question" }
  | { type: "use_powerup" }
  | { type: "select_answer"; answer: string }
  | { type: "set_confidence"; confidence: number }
  | { type: "lock_answer" }
  | { type: "reveal_answer" }
  | { type: "continue_after_reveal" }
  | { type: "next_question" }
  | { type: "play_again" };

function rankPlayers(players: MockPlayer[], studentScore: number): number {
  return 1 + players.filter((player) => player.score > studentScore).length;
}

function powerupLabel(powerup: PowerupType | null): string {
  const labels: Record<PowerupType, string> = {
    reveal_decade: "Reveal the Decade",
    reveal_reality: "Real or Fictional",
    remove_one: "Remove One Answer",
    source_hint: "Source Hint"
  };
  return powerup ? labels[powerup] : "No power-up";
}

export function createInitialState(
  questions: StudentGameState["questions"],
  players: MockPlayer[],
  nickname = "Sam_Racer",
  token = "🏎️"
): StudentGameState {
  return {
    screen: "join",
    nickname,
    token,
    gamePin: "489204",
    questionIndex: 0,
    score: 3420,
    streak: 3,
    correctCount: 0,
    bestConfidence: 0,
    selectedAnswer: null,
    confidence: 5,
    reservedPowerup: null,
    activePowerup: null,
    usedPowerups: [],
    disabledOptions: [],
    clues: [],
    reveal: null,
    powerupInventory: {
      reveal_decade: 1,
      reveal_reality: 1,
      remove_one: 1,
      source_hint: 1
    },
    players,
    questions
  };
}

export function gameReducer(
  state: StudentGameState,
  action: GameAction
): StudentGameState {
  const question = state.questions[state.questionIndex];

  switch (action.type) {
    case "set_nickname":
      return { ...state, nickname: action.nickname };

    case "set_token":
      return { ...state, token: action.token };

    case "join":
      return { ...state, screen: "waiting" };

    case "start_game":
      return { ...state, screen: "powerup" };

    case "select_powerup":
      return { ...state, reservedPowerup: action.powerup };

    case "begin_question":
      return {
        ...state,
        screen: "question",
        selectedAnswer: null,
        activePowerup: null,
        disabledOptions: [],
        clues: [],
        reveal: null
      };

    case "use_powerup": {
      const powerup = state.reservedPowerup;
      if (!powerup || state.powerupInventory[powerup] < 1) return state;

      const remainingInventory = {
        ...state.powerupInventory,
        [powerup]: state.powerupInventory[powerup] - 1
      };

      if (powerup === "reveal_decade") {
        return {
          ...state,
          powerupInventory: remainingInventory,
          activePowerup: powerup,
          clues: ["The quotation is from the " + String(Math.floor(question.year / 10) * 10) + "s."],
          usedPowerups: [...state.usedPowerups, powerup]
        };
      }

      if (powerup === "reveal_reality") {
        const fictional = question.category.toLowerCase().includes("fictional");
        return {
          ...state,
          powerupInventory: remainingInventory,
          activePowerup: powerup,
          clues: [fictional ? "The speaker is fictional." : "The speaker is a real person."],
          usedPowerups: [...state.usedPowerups, powerup]
        };
      }

      if (powerup === "source_hint") {
        return {
          ...state,
          powerupInventory: remainingInventory,
          activePowerup: powerup,
          clues: ["Source type: " + question.sourceType + "."],
          usedPowerups: [...state.usedPowerups, powerup]
        };
      }

      const incorrectOption = question.options.find(
        (option) => option !== question.correctAnswer
      );

      return {
        ...state,
        powerupInventory: remainingInventory,
        activePowerup: powerup,
        disabledOptions: incorrectOption ? [incorrectOption] : [],
        usedPowerups: [...state.usedPowerups, powerup]
      };
    }

    case "select_answer":
      if (state.disabledOptions.includes(action.answer)) return state;
      return { ...state, selectedAnswer: action.answer, screen: "confidence" };

    case "set_confidence":
      if (!Number.isInteger(action.confidence) || action.confidence < 1 || action.confidence > 10) {
        return state;
      }
      return { ...state, confidence: action.confidence };

    case "lock_answer":
      if (!state.selectedAnswer) return state;
      return { ...state, screen: "locked" };

    case "reveal_answer": {
      if (!state.selectedAnswer) return state;

      const isCorrect = state.selectedAnswer === question.correctAnswer;
      const scoreResult = calculatePoints({
        basePoints: 1000,
        isCorrect,
        confidence: state.confidence
      });

      return {
        ...state,
        screen: "reveal",
        score: state.score + scoreResult.pointsAwarded,
        streak: isCorrect ? state.streak + 1 : 0,
        correctCount: state.correctCount + (isCorrect ? 1 : 0),
        bestConfidence: Math.max(state.bestConfidence, isCorrect ? state.confidence : 0),
        reveal: {
          isCorrect,
          basePoints: 1000,
          confidenceMultiplier: scoreResult.confidenceMultiplier,
          pointsAwarded: scoreResult.pointsAwarded,
          powerupMessage: powerupLabel(state.activePowerup)
        }
      };
    }

    case "continue_after_reveal":
      return { ...state, screen: "leaderboard" };

    case "next_question": {
      const nextIndex = state.questionIndex + 1;
      if (nextIndex >= state.questions.length) {
        return { ...state, screen: "results" };
      }

      const currentRank = rankPlayers(state.players, state.score);
      const catchupInventory =
        currentRank > Math.ceil(state.players.length / 2)
          ? { ...state.powerupInventory, reveal_decade: Math.max(1, state.powerupInventory.reveal_decade) }
          : state.powerupInventory;

      return {
        ...state,
        screen: "powerup",
        questionIndex: nextIndex,
        reservedPowerup: null,
        activePowerup: null,
        selectedAnswer: null,
        disabledOptions: [],
        clues: [],
        reveal: null,
        powerupInventory: catchupInventory
      };
    }

    case "play_again":
      return createInitialState(state.questions, state.players, state.nickname, state.token);

    default:
      return state;
  }
}