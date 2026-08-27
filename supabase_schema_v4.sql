-- ==========================================
-- TRACKIO V4 : PARAMÈTRES ET MULTI-DEVISES
-- ==========================================

-- 1. Mise à jour de la table profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS full_name text,
ADD COLUMN IF NOT EXISTS main_country text,
ADD COLUMN IF NOT EXISTS main_currency text default 'XOF',
ADD COLUMN IF NOT EXISTS display_currency text default 'XOF';

-- 2. Mise à jour de la table product_markets
ALTER TABLE public.product_markets 
ADD COLUMN IF NOT EXISTS currency text not null default 'XOF';

-- 3. Ajout de la permission INSERT pour permettre l'upsert des paramètres
DROP POLICY IF EXISTS "Les utilisateurs peuvent créer leur propre profil." ON public.profiles;
CREATE POLICY "Les utilisateurs peuvent créer leur propre profil." ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
