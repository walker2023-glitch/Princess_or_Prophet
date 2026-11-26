# T-004 Data Model Addendum

The migration adds these persisted relationships:

- profiles.id references auth.users.id.
- quote_packs.owner_id references auth.users.id.
- quotes.quote_pack_id references quote_packs.id.
- question_variations.quote_id references quotes.id.
- games.owner_id references auth.users.id.
- games.quote_pack_id references quote_packs.id.

The quote-pack repository considers a question playable only when both reviewed and enabled are true. A quote pack is ready only when all generated questions supplied by the save operation are reviewed.

The local fallback mirrors only dashboard summaries and game settings. It is deliberately not treated as a secure substitute for Supabase.
