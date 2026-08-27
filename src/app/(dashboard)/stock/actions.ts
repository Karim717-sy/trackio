'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const addSupplySchema = z.object({
  date: z.string().min(1),
  product_market_id: z.string().min(1),
  product_id: z.string().optional(),
  new_product_name: z.string().optional(),
  country: z.string().optional(),
  currency: z.string().optional(),
  selling_price: z.coerce.number().optional(),
  quantity: z.coerce.number().int().min(1),
  total_purchase_price: z.coerce.number().min(0),
  shipping_cost: z.coerce.number().min(0),
  other_costs: z.coerce.number().min(0),
})

export async function getSupplies() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Non autorisé")

  const { data, error } = await supabase
    .from('supplies')
    .select(`
      *,
      product_markets (
        country,
        currency,
        products ( name )
      )
    `)
    .eq('user_id', user.id)
    .order('date', { ascending: false })

  if (error) {
    console.error("Erreur getSupplies:", error)
    throw new Error("Erreur de récupération des données d'approvisionnement")
  }
  return data
}

export async function addSupply(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Non autorisé")

  const parsed = addSupplySchema.safeParse(Object.fromEntries(formData.entries()))
  if (!parsed.success) {
    throw new Error("Données invalides")
  }

  let { product_market_id } = parsed.data
  const { date, quantity, total_purchase_price, shipping_cost, other_costs, product_id, new_product_name, country, currency, selling_price } = parsed.data

  if (product_market_id === 'NEW') {
    if (!product_id || !country || !currency || selling_price === undefined) {
      throw new Error("Toutes les informations du marché sont requises.")
    }
    
    let final_product_id = product_id;

    if (product_id === 'NEW') {
      if (!new_product_name) throw new Error("Le nom du nouveau produit est requis.")
      // 1. Create Product
      const { data: newProduct, error: productError } = await supabase
        .from('products')
        .insert([{ user_id: user.id, name: new_product_name }])
        .select()
        .single()
        
      if (productError) {
        console.error("Erreur création produit:", productError)
        throw new Error("Impossible de créer le produit.")
      }
      final_product_id = newProduct.id
    }
    
    // 2. Create Market
    const cost_price = (total_purchase_price + shipping_cost + other_costs) / quantity
    const { data: newMarket, error: marketError } = await supabase
      .from('product_markets')
      .insert([{ 
        user_id: user.id, 
        product_id: final_product_id,
        country,
        currency,
        selling_price, 
        cost_price 
      }])
      .select()
      .single()

    if (marketError) {
      console.error("Erreur création marché:", marketError)
      throw new Error("Impossible de créer le marché.")
    }
    
    product_market_id = newMarket.id
  }

  const { error } = await supabase
    .from('supplies')
    .insert([
      { 
        user_id: user.id, 
        date,
        product_market_id,
        quantity,
        total_purchase_price,
        shipping_cost,
        other_costs
      }
    ])

  if (error) {
    console.error("Erreur insert supply:", error)
    throw new Error("Impossible d'ajouter l'approvisionnement.")
  }
  
  revalidatePath('/stock')
}

export async function deleteSupply(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Non autorisé")

  const { error } = await supabase
    .from('supplies')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    console.error("Erreur suppression supply:", error)
    throw new Error("Impossible de supprimer cet approvisionnement.")
  }
  revalidatePath('/stock')
}

export async function getStockOverview() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Non autorisé")

  // 1. Récupérer tous les marchés de l'utilisateur
  const { data: markets, error: marketsError } = await supabase
    .from('product_markets')
    .select('*, products(name)')
    .eq('user_id', user.id)
    .eq('active', true)

  if (marketsError) throw new Error("Erreur lors de la récupération des marchés")

  // 2. Récupérer tous les approvisionnements
  const { data: supplies, error: suppliesError } = await supabase
    .from('supplies')
    .select('*')
    .eq('user_id', user.id)

  if (suppliesError) throw new Error("Erreur lors de la récupération des approvisionnements")

  // 3. Récupérer toutes les performances (pour les sorties de stock et les moyennes historiques)
  const { data: performances, error: perfError } = await supabase
    .from('performances')
    .select('product_market_id, quantity, shipping_cost, ad_spend')
    .eq('user_id', user.id)

  if (perfError) throw new Error("Erreur lors de la récupération des performances")

  // Calculs par marché
  const overview = markets.map(market => {
    const marketSupplies = supplies.filter(s => s.product_market_id === market.id)
    const marketPerformances = performances.filter(p => p.product_market_id === market.id)

    // A. Calcul Entrées & CMUP
    let totalSuppliedQuantity = 0
    let totalInvested = 0

    marketSupplies.forEach(s => {
      totalSuppliedQuantity += s.quantity
      totalInvested += Number(s.total_purchase_price) + Number(s.shipping_cost) + Number(s.other_costs)
    })

    const cmup = totalSuppliedQuantity > 0 ? totalInvested / totalSuppliedQuantity : 0

    // B. Calcul Sorties (Livrées)
    let totalDeliveredQuantity = 0
    let totalHistoricalShipping = 0
    let totalHistoricalAdSpend = 0

    marketPerformances.forEach(p => {
      totalDeliveredQuantity += p.quantity
      totalHistoricalShipping += Number(p.shipping_cost)
      totalHistoricalAdSpend += Number(p.ad_spend)
    })

    // Moyennes historiques pour estimer le bénéfice futur
    const avgShippingPerUnit = totalDeliveredQuantity > 0 ? totalHistoricalShipping / totalDeliveredQuantity : 0
    const avgAdSpendPerUnit = totalDeliveredQuantity > 0 ? totalHistoricalAdSpend / totalDeliveredQuantity : 0

    // C. Stock Restant et Valeurs
    const remainingStock = Math.max(0, totalSuppliedQuantity - totalDeliveredQuantity)
    const stockValue = remainingStock * cmup
    const potentialRevenue = remainingStock * Number(market.selling_price)
    
    // Marge nette estimée = Prix vente - CMUP - Livraison moy - Pub moy
    const estimatedNetMarginPerUnit = Number(market.selling_price) - cmup - avgShippingPerUnit - avgAdSpendPerUnit
    const potentialProfit = remainingStock * estimatedNetMarginPerUnit

    return {
      market_id: market.id,
      product_name: market.products?.name,
      country: market.country,
      currency: market.currency,
      selling_price: market.selling_price,
      remainingStock,
      cmup,
      stockValue,
      potentialRevenue,
      potentialProfit,
      totalInvested,
      avgShippingPerUnit,
      avgAdSpendPerUnit
    }
  })

  // Exclure les marchés qui n'ont jamais eu de stock pour ne pas encombrer la vue
  return overview.filter(item => item.totalInvested > 0)
}
