-- ==========================================
-- TRACKIO V5 : CORRECTIFS DE SÉCURITÉ (RLS)
-- ==========================================

-- Ce script met à jour les politiques RLS pour ajouter explicitement 
-- la clause WITH CHECK afin de prévenir le spoofing d'utilisateur.

-- 1. Table products
DROP POLICY IF EXISTS "Les utilisateurs gèrent leurs propres produits." ON public.products;
DROP POLICY IF EXISTS "Users manage their own products" ON public.products;
CREATE POLICY "Users manage their own products" ON public.products 
FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- 2. Table product_markets
DROP POLICY IF EXISTS "Users manage their own product markets" ON public.product_markets;
CREATE POLICY "Users manage their own product markets" ON public.product_markets 
FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- 3. Table performances (depuis rentability)
DROP POLICY IF EXISTS "Les utilisateurs gèrent leurs propres performances." ON public.performances;
DROP POLICY IF EXISTS "Users manage their own performances" ON public.performances;
CREATE POLICY "Users manage their own performances" ON public.performances 
FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- 4. Table profiles
DROP POLICY IF EXISTS "Les utilisateurs peuvent modifier leur propre profil." ON public.profiles;
CREATE POLICY "Les utilisateurs peuvent modifier leur propre profil." ON public.profiles 
FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
