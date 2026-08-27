'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getUserProfile() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Non autorisé")

  // On essaie de récupérer le profil. Si les colonnes n'existent pas encore, 
  // Supabase ignorera celles non demandées si on select *, mais pour être sûr on select *.
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (error && error.code !== 'PGRST116') {
    console.error("Erreur profile:", error.message)
    // Ne pas crash ici si la table n'a pas encore les colonnes, on renvoie des valeurs par défaut.
  }

  return {
    email: user.email,
    full_name: data?.full_name || '',
    main_country: data?.main_country || 'Sénégal',
    main_currency: data?.main_currency || 'XOF',
    display_currency: data?.display_currency || 'XOF',
  }
}

export async function updateSettings(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Non autorisé")

  const full_name = formData.get('full_name') as string
  const main_country = formData.get('main_country') as string
  const main_currency = formData.get('main_currency') as string
  const display_currency = formData.get('display_currency') as string
  const password = formData.get('password') as string

  // Mettre à jour le profil (nom, pays, devises)
  // On utilise upsert au cas où le profil n'aurait pas été créé lors de l'inscription
  const { error: profileError } = await supabase
    .from('profiles')
    .upsert({
      id: user.id,
      email: user.email,
      full_name,
      main_country,
      main_currency,
      display_currency
    })

  if (profileError) {
    throw new Error("Erreur de mise à jour du profil. Avez-vous exécuté le script SQL V4 ? (" + profileError.message + ")")
  }

  revalidatePath('/settings')
  revalidatePath('/dashboard') // Car le display_currency change peut-être
}

export async function updatePassword(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Non autorisé")

  const password = formData.get('password') as string
  const confirm = formData.get('confirm_password') as string

  if (!password || password.length < 6) {
    throw new Error("Le mot de passe doit contenir au moins 6 caractères.")
  }

  if (password !== confirm) {
    throw new Error("Les mots de passe ne correspondent pas.")
  }

  const { error: authError } = await supabase.auth.updateUser({
    password: password
  })

  if (authError) throw new Error("Erreur mise à jour mot de passe: " + authError.message)
}
