import { z } from 'zod'

const envSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url("SUPABASE_URL doit être une URL valide"),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1, "SUPABASE_ANON_KEY est requis"),
})

const parsedEnv = envSchema.safeParse({
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
})

if (!parsedEnv.success) {
  console.error("❌ Erreur de validation des variables d'environnement :", parsedEnv.error.format())
  throw new Error("Variables d'environnement invalides")
}

export const env = parsedEnv.data
