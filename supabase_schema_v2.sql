-- ==========================================
-- TRACKIO V2 : STRUCTURE DE LA BASE DE DONNÉES
-- ==========================================

-- ATTENTION : Ce script va supprimer les tables actuelles 
-- (sauf profiles) pour repartir sur une base saine.
-- N'exécutez ce script que si vous êtes sûr de vouloir réinitialiser vos données de test !

drop table if exists public.performance_records;
drop table if exists public.sales;
drop table if exists public.expenses;
drop table if exists public.product_markets;
drop table if exists public.products;

-- 1. Table products (Produit Parent)
create table public.products (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  name text not null,
  active boolean default true not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.products enable row level security;
create policy "Users manage their own products" on products for all using (auth.uid() = user_id);


-- 2. Table product_markets (Produit vendu dans un pays)
create table public.product_markets (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  product_id uuid references public.products on delete cascade not null,
  country text not null,
  selling_price numeric not null,
  cost_price numeric not null,
  active boolean default true not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (user_id, product_id, country) -- Un produit ne peut être ajouté qu'une seule fois par pays
);

alter table public.product_markets enable row level security;
create policy "Users manage their own product markets" on product_markets for all using (auth.uid() = user_id);


-- 3. Table sales (Ventes)
-- On enregistre les totaux journaliers par produit et par pays.
create table public.sales (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  date date not null,
  product_market_id uuid references public.product_markets on delete cascade not null,
  quantity integer not null default 0,
  unit_selling_price numeric not null,
  unit_cost_price numeric not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (user_id, product_market_id, date) -- Une seule entrée par marché et par jour
);

alter table public.sales enable row level security;
create policy "Users manage their own sales" on sales for all using (auth.uid() = user_id);


-- 4. Table expenses (Dépenses)
create table public.expenses (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  date date not null,
  country text not null,
  category text not null, -- 'Meta Ads', 'TikTok Ads', 'Livraison', 'Emballage', 'Autre'
  amount numeric not null default 0,
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.expenses enable row level security;
create policy "Users manage their own expenses" on expenses for all using (auth.uid() = user_id);
