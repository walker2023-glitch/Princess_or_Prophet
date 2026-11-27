"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowserClient, isSupabaseConfigured } from "../../../lib/supabase/client";
import styles from "./sign-in.module.css";

export default function TeacherSignInPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"sign-in" | "sign-up">("sign-in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent) {
    event.preventDefault();
    setMessage("");

    const client = getSupabaseBrowserClient();
    if (!client) {
      router.push("/teacher");
      return;
    }

    const result = mode === "sign-in"
      ? await client.auth.signInWithPassword({ email, password })
      : await client.auth.signUp({ email, password });

    if (result.error) {
      setMessage(result.error.message);
      return;
    }

    if (mode === "sign-up" && result.data.user) {
      await client.from("profiles").upsert({
        id: result.data.user.id,
        display_name: email.split("@")[0],
        role: "teacher"
      });
    }

    router.push("/teacher");
  }

  return (
    <main className={styles.page}>
      <section className={styles.card}>
        <p className={styles.kicker}>Teacher access</p>
        <h1>{mode === "sign-in" ? "Welcome back" : "Create a teacher account"}</h1>
        <p>Save quote packs and prepare classroom games.</p>
        {!isSupabaseConfigured() && <div className={styles.demo}>Supabase is not configured. Continue to use local demo mode.</div>}
        <form onSubmit={submit}>
          <label>Email<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required /></label>
          <label>Password<input type="password" minLength={8} value={password} onChange={(event) => setPassword(event.target.value)} required /></label>
          {message && <p className={styles.error}>{message}</p>}
          <button type="submit">{isSupabaseConfigured() ? mode === "sign-in" ? "Sign in" : "Sign up" : "Continue in demo mode"}</button>
        </form>
        <button className={styles.linkButton} type="button" onClick={() => setMode(mode === "sign-in" ? "sign-up" : "sign-in")}>
          {mode === "sign-in" ? "Create an account" : "I already have an account"}
        </button>
      </section>
    </main>
  );
}
