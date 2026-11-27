"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { generateQuestionDrafts, type QuestionDraft } from "../../../../lib/domain/question-generation";
import { defaultQuote, quoteSchema, type Quote, type SpeakerCategory, type SourceType } from "../../../../lib/domain/quote-schema";
import { saveQuotePack } from "../../../../lib/data/quote-pack-repository";

export default function NewQuotePackPage() {
  const router = useRouter();
  const [title, setTitle] = useState("My classroom quote pack");
  const [description, setDescription] = useState("");
  const [quote, setQuote] = useState<Quote>(defaultQuote);
  const [drafts, setDrafts] = useState<QuestionDraft[]>([]);
  const [message, setMessage] = useState("");

  function updateField<K extends keyof Quote>(field: K, value: Quote[K]) {
    setQuote((current) => ({ ...current, [field]: value }));
  }

  function generate(event: FormEvent) {
    event.preventDefault();
    const result = quoteSchema.safeParse(quote);
    if (!result.success) {
      setMessage(result.error.issues[0]?.message ?? "Check the quote.");
      return;
    }
    setDrafts(generateQuestionDrafts(result.data));
    setMessage("Review the generated questions before saving.");
  }

  async function save(event: FormEvent) {
    event.preventDefault();
    if (drafts.length === 0) {
      setMessage("Generate and review the questions first.");
      return;
    }
    if (drafts.some((draft) => !draft.reviewed)) {
      setMessage("Mark every generated question as teacher reviewed first.");
      return;
    }

    try {
      await saveQuotePack({ title, description, quote, drafts });
      router.push("/teacher");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not save quote pack.");
    }
  }

  return (
    <main style={{ maxWidth: 900, margin: "0 auto", padding: 32, color: "#173b3f" }}>
      <p>Teacher quote authoring</p>
      <h1>Create a quote pack</h1>
      <form onSubmit={generate}>
        <label>Pack title<input value={title} onChange={(event) => setTitle(event.target.value)} required /></label>
        <label>Description<textarea value={description} onChange={(event) => setDescription(event.target.value)} /></label>
        <label>Quote<textarea rows={5} value={quote.text} onChange={(event) => updateField("text", event.target.value)} required /></label>
        <label>Speaker<input value={quote.speakerName} onChange={(event) => updateField("speakerName", event.target.value)} required /></label>
        <label>Category<select value={quote.speakerCategory} onChange={(event) => updateField("speakerCategory", event.target.value as SpeakerCategory)}><option value="prophet">Prophet</option><option value="princess">Princess</option><option value="other_real_person">Other real person</option><option value="other_fictional_character">Other fictional character</option></select></label>
        <label>Year<input type="number" value={quote.year} onChange={(event) => updateField("year", Number(event.target.value))} required /></label>
        <label>Source title<input value={quote.sourceTitle} onChange={(event) => updateField("sourceTitle", event.target.value)} required /></label>
        <label>Source type<select value={quote.sourceType} onChange={(event) => updateField("sourceType", event.target.value as SourceType)}><option value="general_conference">General conference</option><option value="church_talk">Church talk</option><option value="scripture">Scripture</option><option value="movie">Movie</option><option value="book">Book</option><option value="interview">Interview</option><option value="other">Other</option></select></label>
        <label>Source URL<input type="url" value={quote.sourceUrl} onChange={(event) => updateField("sourceUrl", event.target.value)} /></label>
        <label>Explanation<textarea value={quote.explanation} onChange={(event) => updateField("explanation", event.target.value)} /></label>
        <button type="submit">Generate questions</button>
      </form>

      {message && <p>{message}</p>}

      {drafts.length > 0 && (
        <form onSubmit={save}>
          <h2>Review before saving</h2>
          {drafts.map((draft, index) => (
            <fieldset key={draft.id} style={{ margin: "16px 0", padding: 16 }}>
              <legend>{draft.type}</legend>
              <p>{draft.prompt}</p>
              {draft.options.map((option, optionIndex) => <input key={optionIndex} value={option} readOnly aria-label={"Option " + (optionIndex + 1)} />)}
              <label><input type="checkbox" checked={draft.reviewed} onChange={(event) => setDrafts((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, reviewed: event.target.checked } : item))} /> Teacher reviewed</label>
            </fieldset>
          ))}
          <button type="submit">Save quote pack</button>
        </form>
      )}
    </main>
  );
}
