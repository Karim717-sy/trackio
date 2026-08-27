'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const updateSettingsSchema = z.object({
  full_name: z.string().optional(),
  main_country: z.string().min(1),
  main_currency: z.string().min(1),
  display_currency: z.string().min(1),
})

const updatePasswordSchema = z.object({
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères."),
  confirm_password: z.string(),
}).refine(data => data.password === data.confirm_password, {
  message: "Les mots de passe ne correspondent pas.",
  path: ["confirm_password"]
})

export async function getUserProfile() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Non autorisé")

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (error && error.code !== 'PGRST116') {
    console.error("Erreur profile:", error.message)
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

  const parsed = updateSettingsSchema.safeParse(Object.fromEntries(formData.entries()))
  if (!parsed.success) {
    throw new Error("Données de paramètres invalides")
  }

  const { full_name, main_country, main_currency, display_currency } = parsed.data

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
    console.error("Erreur mise à jour profil:", profileError)
    throw new Error("Erreur de mise à jour du profil.")
  }

  revalidatePath('/settings')
  revalidatePath('/dashboard') 
}

export async function updatePassword(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Non autorisé")

  const parsed = updatePasswordSchema.safeParse(Object.fromEntries(formData.entries()))
  if (!parsed.success) {
    throw new Error(parsed.error.issues?.[0]?.message || "Données invalides")
  }

  const { password } = parsed.data

  const { error: authError } = await supabase.auth.updateUser({
    password: password
  })

  if (authError) {
    console.error("Erreur updateUser mot de passe:", authError)
    throw new Error("Erreur de mise à jour du mot de passe.")
  }
}
