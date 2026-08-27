'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const addPerformanceSchema = z.object({
  date: z.string().min(1),
  product_market_id: z.string().uuid(),
  quantity: z.coerce.number().int().min(0),
  revenue: z.coerce.number().min(0),
  ad_spend: z.coerce.number().min(0),
})

const updatePerformanceSchema = z.object({
  quantity: z.coerce.number().int().min(0),
  revenue: z.coerce.number().min(0),
  ad_spend: z.coerce.number().min(0),
  unit_selling_price: z.coerce.number().min(0),
})

export async function getPerformances() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Non autorisé")

  const { data, error } = await supabase
    .from('performances')
    .select(`
      *,
      product_markets (
        country,
        cost_price,
        currency,
        products ( name )
      )
    `)
    .eq('user_id', user.id)
    .order('date', { ascending: false })

  if (error) {
    console.error("Erreur getPerformances:", error)
    throw new Error("Erreur de récupération des données")
  }
  return data
}

export async function addPerformance(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Non autorisé")

  const parsed = addPerformanceSchema.safeParse(Object.fromEntries(formData.entries()))
  if (!parsed.success) {
    throw new Error("Données invalides")
  }

  const { date, product_market_id, quantity, revenue, ad_spend } = parsed.data

  const { data: marketData, error: marketError } = await supabase
    .from('product_markets')
    .select('cost_price, selling_price')
    .eq('id', product_market_id)
    .single()

  if (marketError) {
    console.error("Erreur produit:", marketError)
    throw new Error("Impossible de récupérer les informations du produit.")
  }

  const unit_cost_price = marketData.cost_price;
  const unit_selling_price = marketData.selling_price;

  const generalRevenue = quantity * unit_selling_price;
  const shipping_cost = Math.max(0, generalRevenue - revenue);

  const { error } = await supabase
    .from('performances')
    .insert([
      { 
        user_id: user.id, 
        date,
        product_market_id,
        quantity,
        shipping_cost,
        ad_spend,
        unit_cost_price,
        unit_selling_price
      }
    ])

  if (error) {
    console.error("Erreur insert performance:", error)
    if (error.code === '23505') {
      throw new Error("Vous avez déjà enregistré les performances de ce produit pour cette date.")
    }
    throw new Error("Impossible d'ajouter la performance.")
  }
  
  revalidatePath('/rentability')
}

export async function deletePerformance(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Non autorisé")

  const { error } = await supabase
    .from('performances')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    console.error("Erreur suppression performance:", error)
    throw new Error("Impossible de supprimer cette entrée.")
  }
  revalidatePath('/rentability')
}

export async function updatePerformance(id: string, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Non autorisé")

  const parsed = updatePerformanceSchema.safeParse(Object.fromEntries(formData.entries()))
  if (!parsed.success) {
    throw new Error("Données invalides")
  }

  const { quantity, revenue, ad_spend, unit_selling_price } = parsed.data

  const generalRevenue = quantity * unit_selling_price;
  const shipping_cost = Math.max(0, generalRevenue - revenue);

  const { error } = await supabase
    .from('performances')
    .update({ quantity, shipping_cost, ad_spend })
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    console.error("Erreur update performance:", error)
    throw new Error("Impossible de mettre à jour la performance.")
  }
  revalidatePath('/rentability')
}
