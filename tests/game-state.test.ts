import { describe, expect, it } from "vitest";
import { mockPlayers, mockQuestions } from "../lib/game/mock-data";
import { createInitialState, gameReducer } from "../lib/game/reducer";

function state() {
  return createInitialState(mockQuestions, mockPlayers);
}

describe("student game state", () => {
  it("moves from joining to waiting to power-up selection", () => {
    const joined = gameReducer(state(), { type: "join" });
    expect(joined.screen).toBe("waiting");

    const started = gameReducer(joined, { type: "start_game" });
    expect(started.screen).toBe("powerup");
  });

  it("uses a power-up once and exposes its clue", () => {
    let current = gameReducer(state(), { type: "start_game" });
    current = gameReducer(current, { type: "select_powerup", powerup: "reveal_decade" });
    current = gameReducer(current, { type: "begin_question" });
    current = gameReducer(current, { type: "use_powerup" });

    expect(current.clues[0]).toContain("2010s");
    expect(current.powerupInventory.reveal_decade).toBe(0);

    const again = gameReducer(current, { type: "use_powerup" });
    expect(again.powerupInventory.reveal_decade).toBe(0);
  });

  it("locks the selected answer before revealing it", () => {
    let current = gameReducer(state(), { type: "start_game" });
    current = gameReducer(current, { type: "begin_question" });
    current = gameReducer(current, { type: "select_answer", answer: "Princess Merida" });
    current = gameReducer(current, { type: "set_confidence", confidence: 10 });
    current = gameReducer(current, { type: "lock_answer" });

    expect(current.screen).toBe("locked");
    expect(current.reveal).toBeNull();

    current = gameReducer(current, { type: "reveal_answer" });
    expect(current.screen).toBe("reveal");
    expect(current.reveal?.pointsAwarded).toBe(2000);
  });

  it("moves to results after the final question", () => {
    let current = state();
    current = { ...current, questionIndex: current.questions.length - 1, screen: "leaderboard" };
    current = gameReducer(current, { type: "next_question" });
    expect(current.screen).toBe("results");
  });

  it("does not allow confidence outside the 1 to 10 range", () => {
    const current = state();
    const unchanged = gameReducer(current, { type: "set_confidence", confidence: 11 });
    expect(unchanged.confidence).toBe(5);
  });
});