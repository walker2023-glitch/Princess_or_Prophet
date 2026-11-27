import { getSupabaseBrowserClient } from "../supabase/client";

export type GameSettings = {
  questionCount: number;
  timeLimitSeconds: number;
  confidenceEnabled: boolean;
  catchupPowerupsEnabled: boolean;
};

export type GameSummary = {
  id: string;
  joinCode: string;
  quotePackId: string;
  status: "lobby" | "active" | "finished" | "cancelled";
  settings: GameSettings;
};

const LOCAL_GAMES_KEY = "prophets-or-princesses.games";

function createJoinCode(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export async function createGame(quotePackId: string, settings: GameSettings): Promise<GameSummary> {
  const client = getSupabaseBrowserClient();
  const joinCode = createJoinCode();

  if (!client) {
    const game: GameSummary = {
      id: typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : String(Date.now()),
      joinCode,
      quotePackId,
      status: "lobby",
      settings
    };
    const current = typeof window === "undefined"
      ? []
      : JSON.parse(window.localStorage.getItem(LOCAL_GAMES_KEY) ?? "[]") as GameSummary[];
    window.localStorage.setItem(LOCAL_GAMES_KEY, JSON.stringify([game, ...current]));
    return game;
  }

  const { data: userData, error: userError } = await client.auth.getUser();
  if (userError || !userData.user) throw new Error("Sign in before creating a game.");

  const { data, error } = await client
    .from("games")
    .insert({
      owner_id: userData.user.id,
      quote_pack_id: quotePackId,
      join_code: joinCode,
      settings
    })
    .select("id,join_code,quote_pack_id,status,settings")
    .single();

  if (error || !data) throw error ?? new Error("Could not create game.");

  return {
    id: data.id,
    joinCode: data.join_code,
    quotePackId: data.quote_pack_id,
    status: data.status,
    settings: data.settings as unknown as GameSettings
  };
}
