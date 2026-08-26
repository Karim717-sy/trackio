-- ==========================================
-- TRACKIO V3 : MIGRATION VERS RENTABILITÉ
-- ==========================================

-- 1. On supprime les tables obsolètes
drop table if exists public.sales;
drop table if exists public.expenses;

-- 2. Création de la nouvelle table performances (Rentabilité)
create table public.performances (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  date date not null,
  product_market_id uuid references public.product_markets on delete cascade not null,
  quantity integer not null default 0,
  revenue numeric not null default 0, -- CA hors livraison
  ad_spend numeric not null default 0, -- Dépenses publicitaires
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (user_id, product_market_id, date) -- Une seule saisie par marché et par jour
);

-- Activation de la RLS pour la sécurité
alter table public.performances enable row level security;
create policy "Users manage their own performances" on performances for all using (auth.uid() = user_id);
