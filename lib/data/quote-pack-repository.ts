import type { QuestionDraft } from "../domain/question-generation";
import type { Quote } from "../domain/quote-schema";
import { getSupabaseBrowserClient } from "../supabase/client";

export type QuotePackSummary = {
  id: string;
  title: string;
  description: string;
  status: "draft" | "ready" | "archived";
  quoteCount: number;
  playableQuestionCount: number;
  updatedAt: string;
};

export type QuotePackInput = {
  title: string;
  description: string;
  quote: Quote;
  drafts: QuestionDraft[];
};

const LOCAL_KEY = "prophets-or-princesses.quote-packs";

function readLocal(): QuotePackSummary[] {
  if (typeof window === "undefined") return [];
  const raw = window.localStorage.getItem(LOCAL_KEY);
  return raw ? (JSON.parse(raw) as QuotePackSummary[]) : [];
}

function writeLocal(packs: QuotePackSummary[]) {
  window.localStorage.setItem(LOCAL_KEY, JSON.stringify(packs));
}

export async function listQuotePacks(): Promise<QuotePackSummary[]> {
  const client = getSupabaseBrowserClient();
  const isReady = input.drafts.length > 0 && input.drafts.every((draft) => draft.reviewed);

  if (!client) {
    return readLocal();
  }

  const { data, error } = await (client as any)
    .from("quote_packs")
    .select("id,title,description,status,updated_at,quotes(id,question_variations(id,reviewed,enabled))")
    .order("updated_at", { ascending: false });

  if (error) throw error;

  return (data ?? []).map((pack) => {
    const quotes = pack.quotes ?? [];
    const playableQuestionCount = quotes.reduce(
      (total, quote) =>
        total + (quote.question_variations ?? []).filter((variation) => variation.reviewed && variation.enabled).length,
      0
    );

    return {
      id: pack.id,
      title: pack.title,
      description: pack.description,
      status: pack.status,
      quoteCount: quotes.length,
      playableQuestionCount,
      updatedAt: pack.updated_at
    };
  });
}

export async function saveQuotePack(input: QuotePackInput): Promise<QuotePackSummary> {
  const client = getSupabaseBrowserClient();

  if (!client) {
    const now = new Date().toISOString();
    const pack: QuotePackSummary = {
      id: typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : String(Date.now()),
      title: input.title,
      description: input.description,
      status: isReady ? "ready" : "draft",
      quoteCount: 1,
      playableQuestionCount: input.drafts.filter((draft) => draft.reviewed).length,
      updatedAt: now
    };
    writeLocal([pack, ...readLocal().filter((item) => item.id !== pack.id)]);
    return pack;
  }

  const { data: userData, error: userError } = await client.auth.getUser();
  if (userError || !userData.user) throw new Error("Sign in as a teacher before saving quote packs.");

  const { data: pack, error: packError } = await (client as any)
    .from("quote_packs")
    .insert({ owner_id: userData.user.id, title: input.title, description: input.description, status: isReady ? "ready" : "draft" })
    .select("id,title,description,status,updated_at")
    .single();

  if (packError || !pack) throw packError ?? new Error("Could not create quote pack.");

  const { data: quote, error: quoteError } = await client
    .from("quotes")
    .insert({
      quote_pack_id: pack.id,
      text: input.quote.text,
      speaker_name: input.quote.speakerName,
      speaker_category: input.quote.speakerCategory,
      year: input.quote.year,
      source_title: input.quote.sourceTitle,
      source_type: input.quote.sourceType,
      source_url: input.quote.sourceUrl,
      explanation: input.quote.explanation,
      theme: input.quote.theme,
      verification_status: isReady ? "teacher_verified" : "draft",
      copyright_notes: ""
    })
    .select("id")
    .single();

  if (quoteError || !quote) throw quoteError ?? new Error("Could not save quote.");

  const { error: variationError } = await client.from("question_variations").insert(
    input.drafts.map((draft) => ({
      quote_id: quote.id,
      question_type: draft.type,
      prompt: draft.prompt,
      answer_options: draft.options,
      correct_answer: draft.correctAnswer,
      enabled: true,
      reviewed: draft.reviewed
    }))
  );

  if (variationError) throw variationError;

  return {
    id: pack.id,
    title: pack.title,
    description: pack.description,
    status: isReady ? "ready" : "draft",
    quoteCount: 1,
    playableQuestionCount: input.drafts.filter((draft) => draft.reviewed).length,
    updatedAt: pack.updated_at
  };
}
