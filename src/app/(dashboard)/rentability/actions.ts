'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

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
        products ( name )
      )
    `)
    .eq('user_id', user.id)
    .order('date', { ascending: false })

  if (error) throw new Error(error.message)
  return data
}

export async function addPerformance(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Non autorisé")

  const date = formData.get('date') as string
  const product_market_id = formData.get('product_market_id') as string
  const quantity = parseInt(formData.get('quantity') as string, 10)
  const revenue = parseFloat(formData.get('revenue') as string)
  const ad_spend = parseFloat(formData.get('ad_spend') as string)

  // Récupérer les prix actuels pour les historiser
  const { data: marketData, error: marketError } = await supabase
    .from('product_markets')
    .select('cost_price, selling_price')
    .eq('id', product_market_id)
    .single()

  if (marketError) throw new Error("Impossible de récupérer les informations du produit.")
  const unit_cost_price = marketData.cost_price;
  const unit_selling_price = marketData.selling_price;

  // Calculer les frais de livraison automatiquement
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
    if (error.code === '23505') {
      throw new Error("Vous avez déjà enregistré les performances de ce produit pour cette date.")
    }
    throw new Error(error.message)
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

  if (error) throw new Error(error.message)
  revalidatePath('/rentability')
}

export async function updatePerformance(id: string, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Non autorisé")

  const quantity = parseInt(formData.get('quantity') as string, 10)
  const revenue = parseFloat(formData.get('revenue') as string)
  const ad_spend = parseFloat(formData.get('ad_spend') as string)
  const unit_selling_price = parseFloat(formData.get('unit_selling_price') as string)

  const generalRevenue = quantity * unit_selling_price;
  const shipping_cost = Math.max(0, generalRevenue - revenue);

  const { error } = await supabase
    .from('performances')
    .update({ quantity, shipping_cost, ad_spend })
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) throw new Error(error.message)
  revalidatePath('/rentability')
}
