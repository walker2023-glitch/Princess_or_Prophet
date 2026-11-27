import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./types";

let browserClient: SupabaseClient<Database> | null = null;

export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  );
}

export function getSupabaseBrowserClient(): SupabaseClient<Database> | null {
  if (!isSupabaseConfigured()) return null;

  if (!browserClient) {
    browserClient = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL as string,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY as string
    );
  }

  return browserClient;
}
