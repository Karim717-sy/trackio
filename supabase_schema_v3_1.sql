-- ==========================================
-- TRACKIO V3.1 : MISE À JOUR (SANS PERTE DE DONNÉES)
-- ==========================================

-- 1. Ajout des nouvelles colonnes à la table performances existante
ALTER TABLE public.performances 
ADD COLUMN IF NOT EXISTS revenue_with_shipping numeric not null default 0,
ADD COLUMN IF NOT EXISTS unit_cost_price numeric not null default 0;

-- 2. (Optionnel) Pour les données déjà saisies aujourd'hui, 
-- on s'assure que revenue_with_shipping est au moins égal au CA existant
UPDATE public.performances
SET revenue_with_shipping = revenue
WHERE revenue_with_shipping = 0;

-- 3. Mise à jour rétroactive du coût unitaire pour les performances existantes
-- On copie le coût actuel du marché vers l'historique des performances existantes
UPDATE public.performances p
SET unit_cost_price = pm.cost_price
FROM public.product_markets pm
WHERE p.product_market_id = pm.id
AND p.unit_cost_price = 0;
