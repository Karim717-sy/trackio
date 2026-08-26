-- ==========================================
-- TRACKIO V3.2 : LOGIQUE COMPTABLE (SANS PERTE DE DONNÉES)
-- ==========================================

-- 1. Ajout des nouvelles colonnes à la table performances
ALTER TABLE public.performances 
ADD COLUMN IF NOT EXISTS shipping_cost numeric not null default 0,
ADD COLUMN IF NOT EXISTS unit_selling_price numeric not null default 0;

-- 2. Mise à jour rétroactive du prix de vente unitaire (historisation)
-- On copie le prix de vente actuel du marché vers l'historique des performances existantes
UPDATE public.performances p
SET unit_selling_price = pm.selling_price
FROM public.product_markets pm
WHERE p.product_market_id = pm.id
AND p.unit_selling_price = 0;

-- 3. Mise à jour rétroactive des frais de livraison
-- On déduit les frais de livraison à partir des anciens champs CA saisis manuellement (s'ils existent)
-- Si la soustraction est négative (erreur de saisie passée), on met 0
UPDATE public.performances
SET shipping_cost = GREATEST(revenue_with_shipping - revenue, 0)
WHERE shipping_cost = 0;

-- (Optionnel mais recommandé à long terme : supprimer les colonnes revenue et revenue_with_shipping
-- car elles sont désormais obsolètes. Toutefois, pour plus de sécurité, nous les laissons intactes
-- pour l'instant. Elles seront juste ignorées par le code V3.2).
