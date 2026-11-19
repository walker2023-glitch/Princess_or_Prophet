"use client";

import { FormEvent, useMemo, useState } from "react";
import {
  defaultQuote,
  quoteSchema,
  type Quote,
  type SpeakerCategory,
  type SourceType
} from "../lib/domain/quote-schema";
import {
  generateQuestionDrafts,
  type QuestionDraft,
  type QuestionType
} from "../lib/domain/question-generation";

const questionLabels: Record<QuestionType, string> = {
  category: "Prophet or princess?",
  speaker: "Who said it?",
  authentic_quote: "Which quote is authentic?",
  year_or_decade: "What year was it?",
  source: "What was the source?"
};

function splitOptions(value: string): string[] {
  return value.split("\n").map((item) => item.trim()).filter(Boolean);
}

function updateDraftOption(
  drafts: QuestionDraft[],
  draftId: string,
  optionIndex: number,
  value: string
): QuestionDraft[] {
  return drafts.map((draft) => {
    if (draft.id !== draftId) return draft;
    return {
      ...draft,
      options: draft.options.map((option, index) =>
        index === optionIndex ? value : option
      )
    };
  });
}

export default function HomePage() {
  const [quote, setQuote] = useState<Quote>(defaultQuote);
  const [drafts, setDrafts] = useState<QuestionDraft[]>([]);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  const reviewedCount = useMemo(
    () => drafts.filter((draft) => draft.reviewed).length,
    [drafts]
  );

  function updateField<K extends keyof Quote>(field: K, value: Quote[K]) {
    setQuote((current) => ({ ...current, [field]: value }));
    setSaved(false);
  }

  function generateDrafts(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSaved(false);

    const result = quoteSchema.safeParse(quote);
    if (!result.success) {
      setError(result.error.issues[0]?.message ?? "Check the quote details.");
      return;
    }

    setDrafts(generateQuestionDrafts(result.data));
  }

  function saveQuotePack() {
    if (drafts.length === 0) {
      setError("Generate question variations before saving.");
      return;
    }

    if (drafts.some((draft) => !draft.reviewed)) {
      setError("Review every question variation before saving.");
      return;
    }

    setError("");
    setSaved(true);
  }

  return (
    <main className="shell">
      <header className="hero">
        <div>
          <p className="eyebrow">Teacher authoring prototype</p>
          <h1>Prophets or Princesses</h1>
          <p className="subtitle">
            Enter one quote. Build several classroom questions.
          </p>
        </div>
        <div className="status-card">
          <span>Question drafts reviewed</span>
          <strong>{reviewedCount}/{drafts.length || 5}</strong>
        </div>
      </header>

      <section className="panel">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Step 1</p>
            <h2>Add a quote</h2>
          </div>
          <p className="muted">Generated questions remain unplayable until reviewed.</p>
        </div>

        <form className="quote-form" onSubmit={generateDrafts}>
          <label className="wide">
            Quote text
            <textarea
              value={quote.text}
              onChange={(event) => updateField("text", event.target.value)}
              placeholder="Paste the quotation here"
              rows={4}
              required
            />
          </label>

          <label>
            Speaker
            <input
              value={quote.speakerName}
              onChange={(event) => updateField("speakerName", event.target.value)}
              placeholder="Speaker name"
              required
            />
          </label>

          <label>
            Category
            <select
              value={quote.speakerCategory}
              onChange={(event) =>
                updateField("speakerCategory", event.target.value as SpeakerCategory)
              }
            >
              <option value="prophet">Prophet</option>
              <option value="princess">Princess</option>
              <option value="other_real_person">Other real person</option>
              <option value="other_fictional_character">Other fictional character</option>
            </select>
          </label>

          <label>
            Year
            <input
              type="number"
              value={quote.year}
              onChange={(event) => updateField("year", Number(event.target.value))}
              min={1}
              max={3000}
              required
            />
          </label>

          <label>
            Source type
            <select
              value={quote.sourceType}
              onChange={(event) =>
                updateField("sourceType", event.target.value as SourceType)
              }
            >
              <option value="general_conference">General conference</option>
              <option value="church_talk">Church talk</option>
              <option value="scripture">Scripture</option>
              <option value="movie">Movie</option>
              <option value="book">Book</option>
              <option value="interview">Interview</option>
              <option value="other">Other</option>
            </select>
          </label>

          <label>
            Talk, movie, or book
            <input
              value={quote.sourceTitle}
              onChange={(event) => updateField("sourceTitle", event.target.value)}
              placeholder="Source title"
              required
            />
          </label>

          <label>
            Source URL
            <input
              type="url"
              value={quote.sourceUrl}
              onChange={(event) => updateField("sourceUrl", event.target.value)}
              placeholder="https://..."
            />
          </label>

          <label className="wide">
            Explanation <span className="optional">optional</span>
            <textarea
              value={quote.explanation}
              onChange={(event) => updateField("explanation", event.target.value)}
              placeholder="What should students learn from this quote?"
              rows={3}
            />
          </label>

          <label className="wide">
            Alternative speakers, one per line <span className="optional">optional</span>
            <textarea
              value={quote.alternativeSpeakers.join("\n")}
              onChange={(event) =>
                updateField("alternativeSpeakers", splitOptions(event.target.value))
              }
              placeholder="Add plausible wrong answers"
              rows={2}
            />
          </label>

          <label className="wide">
            Alternative sources, one per line <span className="optional">optional</span>
            <textarea
              value={quote.alternativeSources.join("\n")}
              onChange={(event) =>
                updateField("alternativeSources", splitOptions(event.target.value))
              }
              placeholder="Add plausible wrong source titles"
              rows={2}
            />
          </label>

          <label className="wide">
            Alternative quotes, one per line <span className="optional">optional</span>
            <textarea
              value={quote.alternativeQuotes.join("\n")}
              onChange={(event) =>
                updateField("alternativeQuotes", splitOptions(event.target.value))
              }
              placeholder="Add plausible wrong quotations"
              rows={3}
            />
          </label>

          {error && <p className="error wide" role="alert">{error}</p>}

          <button className="primary-button wide" type="submit">
            Generate question variations
          </button>
        </form>
      </section>

      {drafts.length > 0 && (
        <section className="panel">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Step 2</p>
              <h2>Review generated questions</h2>
            </div>
            <p className="muted">{reviewedCount} of {drafts.length} ready to play</p>
          </div>

          <div className="draft-list">
            {drafts.map((draft) => (
              <article className="draft-card" key={draft.id}>
                <div className="draft-header">
                  <div>
                    <span className="question-type">{questionLabels[draft.type]}</span>
                    <h3>{draft.prompt}</h3>
                  </div>
                  <label className="review-toggle">
                    <input
                      type="checkbox"
                      checked={draft.reviewed}
                      onChange={(event) =>
                        setDrafts((current) =>
                          current.map((item) =>
                            item.id === draft.id
                              ? { ...item, reviewed: event.target.checked }
                              : item
                          )
                        )
                      }
                    />
                    Teacher reviewed
                  </label>
                </div>

                <div className="options-grid">
                  {draft.options.map((option, index) => (
                    <label key={index}>
                      Option {index + 1}
                      <input
                        value={option}
                        onChange={(event) =>
                          setDrafts((current) =>
                            updateDraftOption(current, draft.id, index, event.target.value)
                          )
                        }
                      />
                    </label>
                  ))}
                </div>

                <p className="answer-note">
                  Correct answer: <strong>{draft.correctAnswer}</strong>
                </p>
              </article>
            ))}
          </div>

          <div className="save-row">
            <button className="secondary-button" type="button" onClick={saveQuotePack}>
              Save reviewed quote
            </button>
            {saved && <span className="success">Quote is ready for the next game.</span>}
          </div>
        </section>
      )}

      <footer className="footer">
        Independent educational project. Quote accuracy and permissions must be reviewed before public use.
      </footer>
    </main>
  );
}