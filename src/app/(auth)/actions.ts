'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { z } from 'zod'

const authSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

export async function login(formData: FormData) {
  const supabase = await createClient()

  const parsed = authSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  })

  if (!parsed.success) {
    redirect('/login?error=' + encodeURIComponent("Identifiants invalides"))
  }

  const { error } = await supabase.auth.signInWithPassword(parsed.data)

  if (error) {
    console.error("Erreur de connexion:", error)
    redirect('/login?error=' + encodeURIComponent("Identifiants incorrects"))
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  const parsed = authSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  })

  if (!parsed.success) {
    redirect('/register?error=' + encodeURIComponent("Email ou mot de passe invalide"))
  }

  const { data: authData, error } = await supabase.auth.signUp(parsed.data)

  if (error) {
    console.error("Erreur d'inscription:", error)
    redirect('/register?error=' + encodeURIComponent("Impossible de créer le compte"))
  }
  
  if (authData.user && authData.session === null) {
    redirect('/register?message=' + encodeURIComponent("Vérifiez votre boîte mail pour confirmer votre inscription."))
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}
