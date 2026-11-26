# T-004 Environment Setup

## Local mode

Without Supabase variables, the teacher dashboard uses local browser storage. This is useful for UI development and does not provide multi-device persistence or account security.

Run the app normally and open:

- /teacher
- /teacher/sign-in
- /teacher/quote-packs/new

## Supabase mode

Create a Supabase project and run supabase/migrations/001_initial_schema.sql in the project SQL editor or through the Supabase CLI.

Copy .env.example to .env.local and fill in:

- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

Never add service-role keys to this app’s browser environment. Never commit .env.local.

## Current security boundary

Supabase row-level security limits teacher-owned records to auth.uid(). The current teacher route uses client-side session behavior for the UI, while RLS protects persisted records. Server-side route protection should be added before public deployment.

## Current limitations

- Local mode does not support cross-device sharing.
- Game rooms are stored/configured but are not realtime yet.
- The new quote-pack screen is intentionally a functional first pass and should later share the polished authoring components.
