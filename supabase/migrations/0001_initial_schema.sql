-- Market: initial database schema
-- Tables: profiles, marketplaces, searches, favorites, search_cache
-- Row Level Security is enabled on every table. search_cache is written and read
-- only by Edge Functions running with the service role (no policies = clients blocked).

-- gen_random_uuid() lives in pgcrypto (also built in on modern Postgres; safe to ensure).
create extension if not exists pgcrypto;

-- ============================================================
-- profiles: one row per auth user
-- ============================================================
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles_select_own"
  on public.profiles for select
  using (auth.uid() = id);

create policy "profiles_update_own"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Create a profile automatically on signup.
-- display_name defaults to the part of the email before the @ sign.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, split_part(new.email, '@', 1));
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
-- marketplaces: static registry, readable by everyone
-- ============================================================
create table public.marketplaces (
  id text primary key,
  name text not null,
  base_url text not null,
  is_b2b boolean not null default false,
  enabled boolean not null default true
);

alter table public.marketplaces enable row level security;

create policy "marketplaces_select_all"
  on public.marketplaces for select
  using (true);

insert into public.marketplaces (id, name, base_url, is_b2b, enabled) values
  ('wildberries', 'Wildberries', 'https://www.wildberries.ru', false, true),
  ('ozon',        'Ozon',        'https://www.ozon.ru',        false, true),
  ('aliexpress',  'AliExpress',  'https://www.aliexpress.com',  false, true),
  ('alibaba',     'Alibaba',     'https://www.alibaba.com',     true,  true),
  ('kaspi',       'Kaspi',       'https://kaspi.kz',            false, true);

-- ============================================================
-- searches: one row per query a signed in user runs
-- ============================================================
create table public.searches (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id) on delete set null,
  query text not null,
  source text not null default 'text' check (source in ('text', 'photo')),
  created_at timestamptz not null default now()
);

alter table public.searches enable row level security;

create policy "searches_select_own"
  on public.searches for select
  using (auth.uid() = user_id);

create policy "searches_insert_own"
  on public.searches for insert
  with check (auth.uid() = user_id);

create index searches_user_created_idx
  on public.searches (user_id, created_at desc);

-- ============================================================
-- favorites: saved offers, one per product url per user
-- ============================================================
create table public.favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  offer jsonb not null,
  created_at timestamptz not null default now()
);

create unique index favorites_user_producturl_idx
  on public.favorites (user_id, (offer ->> 'productUrl'));

alter table public.favorites enable row level security;

create policy "favorites_select_own"
  on public.favorites for select
  using (auth.uid() = user_id);

create policy "favorites_insert_own"
  on public.favorites for insert
  with check (auth.uid() = user_id);

create policy "favorites_update_own"
  on public.favorites for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "favorites_delete_own"
  on public.favorites for delete
  using (auth.uid() = user_id);

-- ============================================================
-- search_cache: server side cache, service role only
-- RLS is enabled with NO policies, so anon and authenticated clients
-- cannot read or write it. Only Edge Functions (service role) bypass RLS.
-- ============================================================
create table public.search_cache (
  id uuid primary key default gen_random_uuid(),
  query_normalized text not null,
  marketplace_id text not null references public.marketplaces (id),
  results jsonb not null,
  fetched_at timestamptz not null default now()
);

create unique index search_cache_query_marketplace_idx
  on public.search_cache (query_normalized, marketplace_id);

alter table public.search_cache enable row level security;
-- No policies on purpose.
