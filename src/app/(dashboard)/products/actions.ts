'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getProducts() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Non autorisé")

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('user_id', user.id)
    .order('name', { ascending: true })

  if (error) throw new Error(error.message)
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

  if (error) throw new Error(error.message)
  return data
}

export async function addProductMarket(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Non autorisé")

  let productId = formData.get('product_id') as string
  const newProductName = formData.get('new_product_name') as string
  const country = formData.get('country') as string
  const selling_price = parseFloat(formData.get('selling_price') as string)
  const cost_price = parseFloat(formData.get('cost_price') as string)

  // Si on crée un nouveau produit parent
  if (productId === 'NEW' && newProductName) {
    const { data: newProduct, error: productError } = await supabase
      .from('products')
      .insert([{ user_id: user.id, name: newProductName }])
      .select()
      .single()
      
    if (productError) throw new Error(productError.message)
    productId = newProduct.id
  }

  // Création du marché
  const { error: marketError } = await supabase
    .from('product_markets')
    .insert([
      { 
        user_id: user.id, 
        product_id: productId,
        country,
        selling_price, 
        cost_price 
      }
    ])

  if (marketError) throw new Error("Vous avez déjà ajouté ce produit pour ce pays, ou une erreur est survenue.")
  
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

  if (error) throw new Error(error.message)
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

  if (error) throw new Error(error.message)
  revalidatePath('/products')
}

export async function updateProductMarket(id: string, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Non autorisé")

  const selling_price = parseFloat(formData.get('selling_price') as string)
  const cost_price = parseFloat(formData.get('cost_price') as string)

  const { error } = await supabase
    .from('product_markets')
    .update({ selling_price, cost_price })
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) throw new Error(error.message)
  revalidatePath('/products')
}
