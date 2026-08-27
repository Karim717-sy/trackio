'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const addProductMarketSchema = z.object({
  product_id: z.string().min(1),
  new_product_name: z.string().optional(),
  country: z.string().min(1),
  currency: z.string().min(1),
  selling_price: z.coerce.number().min(0),
  cost_price: z.coerce.number().min(0),
})

const updateProductMarketSchema = z.object({
  selling_price: z.coerce.number().min(0),
  cost_price: z.coerce.number().min(0),
})

export async function getProducts() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Non autorisé")

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('user_id', user.id)
    .order('name', { ascending: true })

  if (error) {
    console.error("Erreur getProducts:", error)
    throw new Error("Erreur de récupération des produits")
  }
  return data
}

export async function getProductMarkets() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Non autorisé")

  const { data, error } = await supabase
    .from('product_markets')
    .select(`
      *,
      products (
        name
      )
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error("Erreur getProductMarkets:", error)
    throw new Error("Erreur de récupération des marchés")
  }
  return data
}

export async function addProductMarket(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Non autorisé")

  const parsed = addProductMarketSchema.safeParse(Object.fromEntries(formData.entries()))
  if (!parsed.success) {
    throw new Error("Données invalides")
  }

  let { product_id } = parsed.data
  const { new_product_name, country, currency, selling_price, cost_price } = parsed.data

  if (product_id === 'NEW' && new_product_name) {
    const { data: newProduct, error: productError } = await supabase
      .from('products')
      .insert([{ user_id: user.id, name: new_product_name }])
      .select()
      .single()
      
    if (productError) {
      console.error("Erreur création produit:", productError)
      throw new Error("Impossible de créer le produit.")
    }
    product_id = newProduct.id
  }

  const { error: marketError } = await supabase
    .from('product_markets')
    .insert([
      { 
        user_id: user.id, 
        product_id: product_id,
        country,
        currency,
        selling_price, 
        cost_price 
      }
    ])

  if (marketError) {
    console.error("Erreur création marché:", marketError)
    throw new Error("Vous avez déjà ajouté ce produit pour ce pays, ou une erreur est survenue.")
  }
  
  revalidatePath('/products')
}

export async function toggleProductMarketStatus(id: string, currentStatus: boolean) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Non autorisé")

  const { error } = await supabase
    .from('product_markets')
    .update({ active: !currentStatus })
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    console.error("Erreur toggle status:", error)
    throw new Error("Impossible de changer le statut.")
  }
  revalidatePath('/products')
}

export async function deleteProductMarket(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Non autorisé")

  const { error } = await supabase
    .from('product_markets')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    console.error("Erreur suppression marché:", error)
    throw new Error("Impossible de supprimer le marché.")
  }
  revalidatePath('/products')
}

export async function updateProductMarket(id: string, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Non autorisé")

  const parsed = updateProductMarketSchema.safeParse(Object.fromEntries(formData.entries()))
  if (!parsed.success) {
    throw new Error("Données invalides")
  }

  const { selling_price, cost_price } = parsed.data

  const { error } = await supabase
    .from('product_markets')
    .update({ selling_price, cost_price })
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    console.error("Erreur update marché:", error)
    throw new Error("Impossible de mettre à jour le marché.")
  }
  revalidatePath('/products')
}
