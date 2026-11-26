"use client";

import { useMemo, useReducer, useState } from "react";
import { canUsePowerup, type PowerupType } from "../../lib/domain/powerups";
import { confidenceMultiplier } from "../../lib/domain/scoring";
import { mockPlayers, mockQuestions } from "../../lib/game/mock-data";
import { createInitialState, gameReducer } from "../../lib/game/reducer";
import type { GameScreen, MockPlayer, StudentGameState } from "../../lib/game/types";
import styles from "./student-game.module.css";

const powerups: Array<{ type: PowerupType; name: string; icon: string; description: string }> = [
  { type: "reveal_decade", name: "Reveal the Decade", icon: "⏳", description: "Shows the era of the quotation." },
  { type: "reveal_reality", name: "Real or Fictional", icon: "🎭", description: "Tells whether the speaker is real or fictional." },
  { type: "remove_one", name: "Remove One Answer", icon: "✂️", description: "Disables one incorrect answer." },
  { type: "source_hint", name: "Source Hint", icon: "📖", description: "Reveals the type of source." }
];

const flowLabels: Record<GameScreen, string> = {
  join: "Join",
  waiting: "Wait",
  powerup: "Pit Stop",
  question: "Question",
  confidence: "Confidence",
  locked: "Locked",
  reveal: "Reveal",
  leaderboard: "Leaderboard",
  results: "Results"
};

function currentRank(state: StudentGameState): number {
  return 1 + state.players.filter((player) => player.score > state.score).length;
}

function sortedPlayers(state: StudentGameState): MockPlayer[] {
  const player = {
    id: "student",
    name: state.nickname || "You",
    token: state.token,
    score: state.score,
    streak: state.streak,
    position: Math.min(94, 42 + Math.round(state.score / 100))
  };

  return [...state.players.filter((item) => item.id !== "student"), player]
    .sort((a, b) => b.score - a.score);
}

function StatBar({ state }: { state: StudentGameState }) {
  return (
    <div className={styles.statBar}>
      <div>
        <span>Score</span>
        <strong>{state.score.toLocaleString()}</strong>
      </div>
      <div>
        <span>Rank</span>
        <strong>{currentRank(state)} / {state.players.length}</strong>
      </div>
      <div>
        <span>Streak</span>
        <strong>🔥 {state.streak}</strong>
      </div>
    </div>
  );
}

function RaceTrack({ state }: { state: StudentGameState }) {
  const racers = sortedPlayers(state);
  return (
    <div className={styles.trackWrap}>
      <div className={styles.trackMeta}>
        <span>Lap {Math.min(state.questionIndex + 1, state.questions.length)} / {state.questions.length}</span>
        <span>Your position: <b>{currentRank(state)}th</b></span>
      </div>
      <div className={styles.track}>
        <span className={styles.finish}>▦</span>
        {racers.map((racer, index) => (
          <span
            className={racer.id === "student" ? styles.racerYou : styles.racer}
            style={{ left: Math.min(92, 12 + index * 14) + "%" }}
            key={racer.id}
            title={racer.name}
          >
            {racer.token}
            {racer.id === "student" && <small>YOU</small>}
          </span>
        ))}
      </div>
    </div>
  );
}

function Hud({ state }: { state: StudentGameState }) {
  return (
    <header className={styles.hud}>
      <div className={styles.brand}>
        <span className={styles.brandIcon}>✦</span>
        <div>
          <strong>PROPHETS <em>or</em> PRINCESSES?</strong>
          <small>Classroom Live Game</small>
        </div>
      </div>
      <div className={styles.playerBadge}>
        <span>{state.token}</span>
        <div><b>{state.nickname || "Guest Racer"}</b><small>#{currentRank(state)} · {state.score.toLocaleString()} pts</small></div>
      </div>
    </header>
  );
}

function FlowBar({ state, onSelect }: { state: StudentGameState; onSelect: (screen: GameScreen) => void }) {
  const screens: GameScreen[] = ["join", "waiting", "powerup", "question", "confidence", "locked", "reveal", "leaderboard", "results"];
  return (
    <div className={styles.flowBar}>
      <span>Prototype flow</span>
      {screens.map((screen) => (
        <button
          type="button"
          key={screen}
          className={state.screen === screen ? styles.flowActive : ""}
          onClick={() => onSelect(screen)}
        >
          {flowLabels[screen]}
        </button>
      ))}
    </div>
  );
}

export function StudentGame() {
  const [state, dispatch] = useReducer(
    gameReducer,
    createInitialState(mockQuestions, mockPlayers)
  );
  const [showFlow, setShowFlow] = useState(true);
  const question = state.questions[state.questionIndex];
  const activePowerup = powerups.find((powerup) => powerup.type === state.reservedPowerup);
  const multiplier = confidenceMultiplier(state.confidence);

  const chooseFlowScreen = (screen: GameScreen) => dispatch({ type: "set_nickname", nickname: state.nickname }) || setShowFlow(true);

  const mainContent = useMemo(() => {
    if (state.screen === "join") {
      return <JoinScreen state={state} dispatch={dispatch} />;
    }

    if (state.screen === "waiting") {
      return <WaitingScreen state={state} dispatch={dispatch} />;
    }

    if (state.screen === "powerup") {
      return <PowerupScreen state={state} dispatch={dispatch} />;
    }

    if (state.screen === "question" || state.screen === "confidence") {
      return <QuestionScreen state={state} dispatch={dispatch} question={question} multiplier={multiplier} />;
    }

    if (state.screen === "locked") {
      return <LockedScreen state={state} dispatch={dispatch} />;
    }

    if (state.screen === "reveal") {
      return <RevealScreen state={state} dispatch={dispatch} question={question} />;
    }

    if (state.screen === "leaderboard") {
      return <LeaderboardScreen state={state} dispatch={dispatch} />;
    }

    return <ResultsScreen state={state} dispatch={dispatch} />;
  }, [state, question, multiplier]);

  return (
    <div className={styles.page}>
      <Hud state={state} />
      {state.screen !== "join" && <RaceTrack state={state} />}
      {showFlow && <FlowBar state={state} onSelect={() => undefined} />}
      <main className={styles.main}>{mainContent}</main>
      <footer className={styles.footer}>Prototype mode · Student answers are temporary · No account required</footer>
    </div>
  );
}

function JoinScreen({ state, dispatch }: { state: StudentGameState; dispatch: React.Dispatch<any> }) {
  const [nickname, setNickname] = useState(state.nickname);
  const [token, setToken] = useState(state.token);

  return (
    <section className={styles.card + " " + styles.narrowCard}>
      <span className={styles.iconTile}>⚑</span>
      <p className={styles.kicker}>Student game</p>
      <h1>Prophets <em className={styles.titleAccent}>or</em> Princesses?</h1>
      <p className={styles.goldText}>Can you tell who said it?</p>
      <p className={styles.muted}>Read quotes, choose your confidence, and climb the classroom track.</p>
      <label>Game room PIN<input value={state.gamePin} readOnly /></label>
      <label>Choose a nickname<input value={nickname} onChange={(event) => setNickname(event.target.value)} /></label>
      <div className={styles.tokenPicker}>
        {["🏎️", "👑", "⚡", "📜", "⭐"].map((candidate) => (
          <button type="button" className={token === candidate ? styles.tokenSelected : ""} key={candidate} onClick={() => setToken(candidate)}>{candidate}</button>
        ))}
      </div>
      <button className={styles.primaryButton} type="button" onClick={() => {
        dispatch({ type: "set_nickname", nickname: nickname.trim() || "Guest Racer" });
        dispatch({ type: "set_token", token });
        dispatch({ type: "join" });
      }}>Enter the Track →</button>
    </section>
  );
}

function WaitingScreen({ state, dispatch }: { state: StudentGameState; dispatch: React.Dispatch<any> }) {
  return (
    <section className={styles.card + " " + styles.narrowCard}>
      <span className={styles.livePill}>● GRID FORMING · ROOM {state.gamePin}</span>
      <span className={styles.waitingToken}>{state.token}</span>
      <p className={styles.kicker}>You’re in the race</p>
      <h2>Welcome, {state.nickname}!</h2>
      <StatBar state={state} />
      <div className={styles.playerGrid}>{state.players.map((player) => <span key={player.id}>{player.token} {player.name}</span>)}</div>
      <p className={styles.notice}>The teacher will launch Round 1 shortly. Hold tight!</p>
      <button className={styles.secondaryButton} type="button" onClick={() => dispatch({ type: "start_game" })}>Preview pre-question setup →</button>
    </section>
  );
}

function PowerupScreen({ state, dispatch }: { state: StudentGameState; dispatch: React.Dispatch<any> }) {
  const activePowerup = powerups.find((powerup) => powerup.type === state.reservedPowerup);

  return (
    <section className={styles.card + " " + styles.wideCard}>
      <div className={styles.cardHeader}><div><p className={styles.kicker}>Pit stop · Before question {state.questionIndex + 1}</p><h2>Equip a power-up?</h2></div><b className={styles.goldText}>Inventory</b></div>
      <StatBar state={state} />
      <p className={styles.muted}>Choose an optional advantage. You must use it before the answer is revealed.</p>
      <div className={styles.powerGrid}>
        {powerups.map((powerup) => {
          const available = state.powerupInventory[powerup.type] > 0;
          const selected = state.reservedPowerup === powerup.type;
          return (
            <button
              type="button"
              className={selected ? styles.powerSelected : styles.powerCard}
              disabled={!available}
              key={powerup.type}
              onClick={() => dispatch({ type: "select_powerup", powerup: selected ? null : powerup.type })}
            >
              <span className={styles.powerIcon}>{powerup.icon}</span>
              <span><b>{powerup.name}</b><small>{powerup.description}</small></span>
              <strong>{available ? state.powerupInventory[powerup.type] + "x" : "Used"}</strong>
            </button>
          );
        })}
      </div>
      <button className={styles.primaryButton} type="button" onClick={() => dispatch({ type: "begin_question" })}>
        {activePowerup ? "Equip " + activePowerup.name : "Continue without power-up"} →
      </button>
    </section>
  );
}

function QuestionScreen({ state, dispatch, question, multiplier }: { state: StudentGameState; dispatch: React.Dispatch<any>; question: StudentGameState["questions"][number]; multiplier: number }) {
  const canUse = state.reservedPowerup ? canUsePowerup({
    type: state.reservedPowerup,
    questionType: question.prompt.toLowerCase().includes("source") ? "source" : question.prompt.toLowerCase().includes("who") ? "speaker" : "category",
    phase: "question_open",
    inventory: state.powerupInventory[state.reservedPowerup]
  }) : false;

  return (
    <section className={styles.card + " " + styles.wideCard}>
      <div className={styles.questionMeta}><span>Question {state.questionIndex + 1} of {state.questions.length}</span><span className={styles.timer}>● 00:15</span></div>
      <p className={styles.kicker}>Quote challenge</p>
      <p className={styles.prompt}>{question.prompt}</p>
      <blockquote>“{question.quote}”</blockquote>
      {state.clues.length > 0 && <div className={styles.clueRow}>{state.clues.map((clue) => <span key={clue}>✦ {clue}</span>)}</div>}
      {state.reservedPowerup && !state.activePowerup && canUse && <button type="button" className={styles.powerUseButton} onClick={() => dispatch({ type: "use_powerup" })}>Use {powerups.find((powerup) => powerup.type === state.reservedPowerup)?.name}</button>}
      <div className={styles.answerGrid}>
        {question.options.map((option) => (
          <button type="button" disabled={state.disabledOptions.includes(option)} className={state.disabledOptions.includes(option) ? styles.answerDisabled : styles.answerButton} key={option} onClick={() => dispatch({ type: "select_answer", answer: option })}>{option}</button>
        ))}
      </div>
      {state.screen === "confidence" && (
        <div className={styles.confidenceBox}>
          <div className={styles.cardHeader}><div><p className={styles.kicker}>Lock your answer</p><h2>How confident are you?</h2></div><strong className={styles.multiplier}>{multiplier.toFixed(2)}x</strong></div>
          <input aria-label="Confidence from 1 to 10" type="range" min="1" max="10" value={state.confidence} onChange={(event) => dispatch({ type: "set_confidence", confidence: Number(event.target.value) })} />
          <div className={styles.sliderLabels}><span>Guessing · 1</span><b>{state.confidence}</b><span>Very confident · 10</span></div>
          <p className={styles.muted}>A correct answer at confidence {state.confidence} is worth {Math.round(1000 * multiplier).toLocaleString()} points.</p>
          <button className={styles.primaryButton} type="button" onClick={() => dispatch({ type: "lock_answer" })}>Lock in answer</button>
        </div>
      )}
    </section>
  );
}

function LockedScreen({ state, dispatch }: { state: StudentGameState; dispatch: React.Dispatch<any> }) {
  return <section className={styles.card + " " + styles.narrowCard}><span className={styles.waitingToken}>🔒</span><p className={styles.kicker}>Answer locked</p><h2>Waiting for the class…</h2><p className={styles.muted}>Your answer and confidence are saved. The correct answer will appear after the round closes.</p><div className={styles.lockedAnswer}>{state.selectedAnswer}<br /><small>Confidence {state.confidence}/10</small></div><button className={styles.secondaryButton} type="button" onClick={() => dispatch({ type: "reveal_answer" })}>Preview reveal →</button></section>;
}

function RevealScreen({ state, dispatch, question }: { state: StudentGameState; dispatch: React.Dispatch<any>; question: StudentGameState["questions"][number] }) {
  const reveal = state.reveal;
  if (!reveal) return null;
  return <section className={styles.card + " " + styles.wideCard}><div className={reveal.isCorrect ? styles.resultCorrect : styles.resultIncorrect}><span>{reveal.isCorrect ? "✦" : "↺"}</span><h2>{reveal.isCorrect ? "Correct!" : "Good try"}</h2><p>{reveal.isCorrect ? "You moved forward on the track." : "Every reveal is another clue for next time."}</p></div><div className={styles.sourceGrid}><div><span>Speaker</span><b>{question.speaker}</b></div><div><span>Category</span><b>{question.category}</b></div><div><span>Year</span><b>{question.year}</b></div><div><span>Source</span><b>{question.sourceTitle}</b></div></div><p className={styles.explanation}>{question.explanation}</p><div className={styles.pointsBox}><span>{reveal.basePoints} base × {reveal.confidenceMultiplier.toFixed(2)} confidence</span><strong>+{reveal.pointsAwarded.toLocaleString()} pts</strong><small>{reveal.powerupMessage}</small></div><button className={styles.primaryButton} type="button" onClick={() => dispatch({ type: "continue_after_reveal" })}>View leaderboard →</button></section>;
}

function LeaderboardScreen({ state, dispatch }: { state: StudentGameState; dispatch: React.Dispatch<any> }) {
  const players = sortedPlayers(state);
  const studentRank = currentRank(state);
  return <section className={styles.card + " " + styles.wideCard}><p className={styles.kicker}>Between rounds</p><h2>Live leaderboard</h2><p className={styles.muted}>Your position stays visible even when you are outside the top five.</p><div className={styles.leaderboard}>{players.map((player, index) => <div className={player.id === "student" ? styles.leaderYou : styles.leaderRow} key={player.id}><span>{index + 1}</span><span className={styles.leaderToken}>{player.token}</span><b>{player.name}{player.id === "student" ? " (You)" : ""}</b><small>🔥 {player.streak}</small><strong>{player.score.toLocaleString()}</strong></div>)}</div>{studentRank > Math.ceil(players.length / 2) && <div className={styles.catchup}>🎁 Catch-up boost available: an extra clue may be awarded next round.</div>}<button className={styles.primaryButton} type="button" onClick={() => dispatch({ type: "next_question" })}>Next question →</button></section>;
}

function ResultsScreen({ state, dispatch }: { state: StudentGameState; dispatch: React.Dispatch<any> }) {
  return <section className={styles.card + " " + styles.wideCard}><span className={styles.iconTile}>🏆</span><p className={styles.kicker}>Race complete</p><h2>Great run, {state.nickname}!</h2><div className={styles.podium}><span>🥈 Maya_Speeder</span><strong>🥇 Jordan_Q</strong><span>🥉 {state.nickname}</span></div><div className={styles.sourceGrid}><div><span>Final score</span><b>{state.score.toLocaleString()}</b></div><div><span>Correct answers</span><b>{state.correctCount}/{state.questions.length}</b></div><div><span>Best confidence</span><b>{state.bestConfidence || "—"}/10</b></div><div><span>Power-ups used</span><b>{state.usedPowerups.length}</b></div></div><p className={styles.muted}>Learning summary: review the speakers, sources, and years you found most difficult.</p><button className={styles.primaryButton} type="button" onClick={() => dispatch({ type: "play_again" })}>Play again →</button></section>;
}