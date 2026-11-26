"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createGame, type GameSettings, type GameSummary } from "../../lib/data/game-repository";
import { listQuotePacks, type QuotePackSummary } from "../../lib/data/quote-pack-repository";
import { isSupabaseConfigured, getSupabaseBrowserClient } from "../../lib/supabase/client";
import styles from "./teacher.module.css";

export default function TeacherDashboard() {
  const [packs, setPacks] = useState<QuotePackSummary[]>([]);
  const [selectedPack, setSelectedPack] = useState("");
  const [game, setGame] = useState<GameSummary | null>(null);
  const [error, setError] = useState("");
  const [settings, setSettings] = useState<GameSettings>({
    questionCount: 10,
    timeLimitSeconds: 15,
    confidenceEnabled: true,
    catchupPowerupsEnabled: true
  });

  useEffect(() => {
    void loadPacks();
  }, []);

  async function loadPacks() {
    try {
      setPacks(await listQuotePacks());
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Could not load quote packs.");
    }
  }

  async function startGame() {
    if (!selectedPack) {
      setError("Choose a quote pack first.");
      return;
    }

    const pack = packs.find((item) => item.id === selectedPack);
    if (!pack || pack.playableQuestionCount === 0) {
      setError("This pack needs at least one teacher-reviewed question.");
      return;
    }

    try {
      setError("");
      setGame(await createGame(selectedPack, settings));
    } catch (gameError) {
      setError(gameError instanceof Error ? gameError.message : "Could not create game.");
    }
  }

  async function signOut() {
    const client = getSupabaseBrowserClient();
    if (client) await client.auth.signOut();
    window.location.reload();
  }

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div><p className={styles.kicker}>Teacher control room</p><h1>Prophets or Princesses?</h1><p>Prepare quote packs and launch a classroom game.</p></div>
        <div className={styles.actions}><Link href="/teacher/quote-packs/new">New quote pack</Link><Link href="/play">Student preview</Link><button type="button" onClick={signOut}>Sign out</button></div>
      </header>

      {!isSupabaseConfigured() && <div className={styles.demo}>Demo mode: quote packs are stored in this browser until Supabase is configured.</div>}
      {error && <div className={styles.error}>{error}</div>}

      <section className={styles.grid}>
        <div className={styles.panel}>
          <div className={styles.panelHeading}><div><p className={styles.kicker}>Your library</p><h2>Quote packs</h2></div><button type="button" onClick={() => void loadPacks()}>Refresh</button></div>
          {packs.length === 0 ? <p className={styles.empty}>No quote packs yet. Create your first one.</p> : <div className={styles.packList}>{packs.map((pack) => <button type="button" className={selectedPack === pack.id ? styles.packSelected : styles.pack} key={pack.id} onClick={() => setSelectedPack(pack.id)}><strong>{pack.title}</strong><span>{pack.quoteCount} quote · {pack.playableQuestionCount} playable questions</span><small>{pack.status} · updated {new Date(pack.updatedAt).toLocaleDateString()}</small></button>)}</div>}
        </div>

        <div className={styles.panel}>
          <p className={styles.kicker}>Game setup</p>
          <h2>Launch a room</h2>
          <label>Questions<input type="number" min="1" max="50" value={settings.questionCount} onChange={(event) => setSettings({ ...settings, questionCount: Number(event.target.value) })} /></label>
          <label>Seconds per question<input type="number" min="5" max="120" value={settings.timeLimitSeconds} onChange={(event) => setSettings({ ...settings, timeLimitSeconds: Number(event.target.value) })} /></label>
          <label className={styles.checkbox}><input type="checkbox" checked={settings.confidenceEnabled} onChange={(event) => setSettings({ ...settings, confidenceEnabled: event.target.checked })} /> Confidence scoring</label>
          <label className={styles.checkbox}><input type="checkbox" checked={settings.catchupPowerupsEnabled} onChange={(event) => setSettings({ ...settings, catchupPowerupsEnabled: event.target.checked })} /> Catch-up power-ups</label>
          <button className={styles.launch} type="button" onClick={() => void startGame()}>Create game room</button>
          {game && <div className={styles.room}><span>Room PIN</span><strong>{game.joinCode}</strong><small>Game created in lobby mode. Realtime joining comes in the next feature.</small></div>}
        </div>
      </section>
    </main>
  );
}
