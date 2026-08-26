import Link from "next/link";

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow p-8 space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900">Inscription</h1>
          <p className="text-slate-600 mt-2">Créez votre compte Trackio</p>
        </div>
        {/* Placeholder pour le formulaire d'inscription Supabase */}
        <div className="p-4 bg-slate-100 rounded text-center text-slate-500 flex flex-col gap-4">
          <p>Formulaire d'inscription à venir (Phase 4)</p>
          <Link href="/dashboard" className="inline-block px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition">
            Aller au Dashboard (Test)
          </Link>
        </div>
        <div className="text-center text-sm text-slate-600">
          Déjà un compte ? <Link href="/login" className="text-indigo-600 hover:underline">Se connecter</Link>
        </div>
      </div>
    </div>
  );
}
