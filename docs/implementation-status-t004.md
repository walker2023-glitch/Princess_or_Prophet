# T-004 Implementation Status

## Added

- Draft PR #1 for the unmerged T-003 student prototype.
- T-004 feature branch.
- Supabase migration with tables, indexes, triggers, and ownership RLS.
- Public-key-only browser Supabase client.
- Local browser-storage fallback.
- Quote-pack and game repositories.
- Teacher sign-in/sign-up screen.
- Teacher dashboard.
- Persistent quote-pack creation flow.
- Basic game-room configuration and join-code generation.
- Environment setup documentation.

## Not yet complete

- Supabase migrations have not been run against a real project.
- No server-side route protection yet.
- No realtime multiplayer.
- No edit/reopen quote-pack screen yet.
- No integration tests against an isolated Supabase project.
- Production build and tests must still run in the local checkout.

## Verification required

- npm install
- npm test
- npm run build
- Test local mode at /teacher and /teacher/quote-packs/new
- Test Supabase mode with a private project
