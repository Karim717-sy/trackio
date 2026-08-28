import Link from "next/link";
import { signup } from "../actions";

import SubmitButton from "@/components/SubmitButton";

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedSearchParams = await searchParams;
  const error = resolvedSearchParams?.error;
  const message = resolvedSearchParams?.message;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-xl border border-slate-100 p-8 space-y-6">
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-black text-indigo-600 tracking-tighter block mb-4">
            Trackio
          </Link>
          <h1 className="text-2xl font-bold text-slate-900">Inscription</h1>
          <p className="text-slate-600 mt-2">Créez votre compte Trackio</p>
        </div>
        
        {error && (
          <div className="p-4 bg-red-50 text-red-700 text-sm rounded-lg border border-red-200">
            {error}
          </div>
        )}

        {message && (
          <div className="p-4 bg-green-50 text-green-700 text-sm rounded-lg border border-green-200">
            {message}
          </div>
        )}
        
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="email">Email</label>
            <input 
              id="email" 
              name="email" 
              type="email" 
              required 
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500" 
              placeholder="votre@email.com"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="password">Mot de passe</label>
            <input 
              id="password" 
              name="password" 
              type="password" 
              required 
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500" 
              placeholder="••••••••"
            />
          </div>

          <SubmitButton 
            formAction={signup}
            className="w-full bg-indigo-600 text-white font-semibold py-3 rounded-lg hover:bg-indigo-700 transition"
            pendingText="Création en cours..."
          >
            Créer mon compte
          </SubmitButton>
        </form>

        <div className="text-center text-sm text-slate-600 mt-6 pt-6 border-t border-slate-100">
          Déjà un compte ? <Link href="/login" className="text-indigo-600 hover:underline font-medium">Se connecter</Link>
        </div>
      </div>
    </div>
  );
}
