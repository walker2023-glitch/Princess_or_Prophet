create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  role text not null default 'teacher' check (role = 'teacher'),
  created_at timestamptz not null default now()
);

create table if not exists public.quote_packs (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  title text not null check (char_length(trim(title)) >= 2),
  description text not null default '',
  status text not null default 'draft' check (status in ('draft', 'ready', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.quotes (
  id uuid primary key default gen_random_uuid(),
  quote_pack_id uuid not null references public.quote_packs(id) on delete cascade,
  text text not null check (char_length(trim(text)) >= 5),
  speaker_name text not null,
  speaker_category text not null check (speaker_category in ('prophet', 'princess', 'other_real_person', 'other_fictional_character')),
  year integer not null check (year between 1 and 3000),
  source_title text not null,
  source_type text not null,
  source_url text not null default '',
  explanation text not null default '',
  theme text not null default '',
  verification_status text not null default 'draft' check (verification_status in ('draft', 'teacher_verified', 'needs_review', 'archived')),
  copyright_notes text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.question_variations (
  id uuid primary key default gen_random_uuid(),
  quote_id uuid not null references public.quotes(id) on delete cascade,
  question_type text not null,
  prompt text not null,
  answer_options jsonb not null default '[]'::jsonb,
  correct_answer text not null,
  enabled boolean not null default true,
  reviewed boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.games (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  quote_pack_id uuid not null references public.quote_packs(id) on delete restrict,
  join_code text not null unique check (join_code ~ '^[0-9]{6}$'),
  status text not null default 'lobby' check (status in ('lobby', 'active', 'finished', 'cancelled')),
  settings jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  started_at timestamptz,
  ended_at timestamptz
);

create index if not exists quote_packs_owner_idx on public.quote_packs(owner_id);
create index if not exists quotes_pack_idx on public.quotes(quote_pack_id);
create index if not exists question_variations_quote_idx on public.question_variations(quote_id);
create index if not exists games_owner_idx on public.games(owner_id);
create index if not exists games_join_code_idx on public.games(join_code);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists quote_packs_set_updated_at on public.quote_packs;
create trigger quote_packs_set_updated_at
before update on public.quote_packs
for each row execute function public.set_updated_at();

drop trigger if exists quotes_set_updated_at on public.quotes;
create trigger quotes_set_updated_at
before update on public.quotes
for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.quote_packs enable row level security;
alter table public.quotes enable row level security;
alter table public.question_variations enable row level security;
alter table public.games enable row level security;

drop policy if exists profiles_self on public.profiles;
create policy profiles_self on public.profiles
for all using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists quote_packs_owner on public.quote_packs;
create policy quote_packs_owner on public.quote_packs
for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);

drop policy if exists quotes_owner_via_pack on public.quotes;
create policy quotes_owner_via_pack on public.quotes
for all using (
  exists (
    select 1 from public.quote_packs
    where quote_packs.id = quotes.quote_pack_id
      and quote_packs.owner_id = auth.uid()
  )
) with check (
  exists (
    select 1 from public.quote_packs
    where quote_packs.id = quotes.quote_pack_id
      and quote_packs.owner_id = auth.uid()
  )
);

drop policy if exists variations_owner_via_quote on public.question_variations;
create policy variations_owner_via_quote on public.question_variations
for all using (
  exists (
    select 1
    from public.quotes
    join public.quote_packs on quote_packs.id = quotes.quote_pack_id
    where quotes.id = question_variations.quote_id
      and quote_packs.owner_id = auth.uid()
  )
) with check (
  exists (
    select 1
    from public.quotes
    join public.quote_packs on quote_packs.id = quotes.quote_pack_id
    where quotes.id = question_variations.quote_id
      and quote_packs.owner_id = auth.uid()
  )
);

drop policy if exists games_owner on public.games;
create policy games_owner on public.games
for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);
