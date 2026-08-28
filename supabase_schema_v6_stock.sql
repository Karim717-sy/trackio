-- ==========================================
-- TRACKIO V6 : MODULE STOCK & INVESTISSEMENTS
-- ==========================================

-- 1. Table supplies (Approvisionnements)
create table public.supplies (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  date date not null,
  product_market_id uuid references public.product_markets on delete cascade not null,
  quantity integer not null check (quantity > 0),
  total_purchase_price numeric not null check (total_purchase_price >= 0),
  shipping_cost numeric not null default 0 check (shipping_cost >= 0),
  other_costs numeric not null default 0 check (other_costs >= 0),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Activation du RLS pour supplies
alter table public.supplies enable row level security;

-- Création des politiques RLS avec WITH CHECK pour la sécurité
create policy "Users manage their own supplies" on public.supplies 
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ==========================================
-- UPDATE : MIGRATION POUR GESTION DES APPROVISIONNEMENTS EN ATTENTE
-- A exécuter dans la console SQL de Supabase
-- ==========================================
ALTER TABLE public.supplies 
ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'arrived' CHECK (status IN ('pending', 'partial', 'arrived', 'lost')),
ADD COLUMN IF NOT EXISTS quantity_received integer NOT NULL DEFAULT 0;

-- Mise à jour des anciennes données pour qu'elles soient considérées comme déjà arrivées en stock
UPDATE public.supplies SET quantity_received = quantity WHERE quantity_received = 0 AND status = 'arrived';
