'use client'

import { useState } from 'react'
import { updateSettings } from './actions'
import { User, Mail, Globe, DollarSign, Lock, LogOut } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { COUNTRIES } from '@/utils/constants'

export default function SettingsForm({ initialProfile }: { initialProfile: any }) {
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false)
  const [passwordError, setPasswordError] = useState('')
  const [passwordSuccess, setPasswordSuccess] = useState('')

  const router = useRouter()

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage('')
    setError('')

    const formData = new FormData(e.currentTarget)
    try {
      await updateSettings(formData)
      setMessage("Vos paramètres ont été mis à jour avec succès.")
    } catch (err: any) {
      setError(err.message)
    }
    setIsLoading(false)
  }

  const handlePasswordSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsUpdatingPassword(true)
    setPasswordError('')
    setPasswordSuccess('')

    const formData = new FormData(e.currentTarget)
    try {
      const { updatePassword } = await import('./actions')
      await updatePassword(formData)
      setPasswordSuccess("Mot de passe mis à jour avec succès.")
      setTimeout(() => {
        setShowPasswordModal(false)
        setPasswordSuccess('')
      }, 2000)
    } catch (err: any) {
      setPasswordError(err.message)
    }
    setIsUpdatingPassword(false)
  }

  return (
    <div className="space-y-6">
      {message && <div className="p-4 bg-green-50 text-green-700 rounded-lg font-medium">{message}</div>}
      {error && <div className="p-4 bg-red-50 text-red-700 rounded-lg font-medium">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* SECTION: Mon compte */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-indigo-600" />
            Mon Compte
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Nom / Prénom</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input 
                  type="text" 
                  name="full_name" 
                  defaultValue={initialProfile.full_name}
                  className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none"
                  placeholder="Ex: Jean Dupont"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Adresse E-mail</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input 
                  type="email" 
                  defaultValue={initialProfile.email}
                  disabled
                  className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg bg-slate-50 text-slate-500 cursor-not-allowed outline-none"
                  title="L'email ne peut pas être modifié pour le moment."
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Mot de passe</label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(true)}
                  className="w-full text-left pl-9 pr-3 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition text-slate-600"
                >
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  ••••••••
                  <span className="absolute right-3 top-2.5 text-xs font-semibold text-indigo-600">Modifier</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION: Pays & Monnaie (Préférences globales) */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Globe className="w-5 h-5 text-indigo-600" />
            Préférences par défaut
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Mon Pays Principal</label>
              <div className="relative">
                <Globe className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <select 
                  name="main_country" 
                  defaultValue={initialProfile.main_country}
                  className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none bg-white"
                >
                  <option value="" disabled>Sélectionnez un pays...</option>
                  {COUNTRIES.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <p className="text-xs text-slate-500 mt-1">Utilisé par défaut lors de la création de nouveaux marchés.</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Ma Devise Principale</label>
              <div className="relative">
                <DollarSign className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <select 
                  name="main_currency" 
                  defaultValue={initialProfile.main_currency}
                  className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none bg-white"
                >
                  <option value="XOF">XOF - Franc CFA (BCEAO)</option>
                  <option value="XAF">XAF - Franc CFA (CEMAC)</option>
                  <option value="GNF">GNF - Franc Guinéen</option>
                  <option value="EUR">EUR - Euro</option>
                  <option value="USD">USD - Dollar US</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION: Affichage Dashboard */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-indigo-600" />
            Devise du Tableau de bord
          </h2>
          <p className="text-sm text-slate-600 mb-4">
            Si vous vendez dans plusieurs devises (ex: XOF et GNF), Trackio convertira automatiquement les montants 
            dans la devise sélectionnée ci-dessous pour afficher vos totaux sur le Tableau de bord.
          </p>
          
          <div className="max-w-md">
            <label className="block text-sm font-medium text-slate-700 mb-1">Monnaie d'affichage (Dashboard)</label>
            <select 
              name="display_currency" 
              defaultValue={initialProfile.display_currency}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none bg-white"
            >
              <option value="XOF">XOF - Franc CFA (BCEAO)</option>
              <option value="XAF">XAF - Franc CFA (CEMAC)</option>
              <option value="GNF">GNF - Franc Guinéen</option>
              <option value="EUR">EUR - Euro</option>
              <option value="USD">USD - Dollar US</option>
            </select>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4">
          <button
            type="button"
            onClick={handleSignOut}
            className="flex items-center gap-2 px-4 py-2 text-red-600 font-medium hover:bg-red-50 rounded-lg transition"
          >
            <LogOut className="w-5 h-5" />
            Déconnexion
          </button>
          
          <button 
            type="submit"
            disabled={isLoading}
            className="px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
          >
            {isLoading ? 'Enregistrement...' : 'Enregistrer les modifications'}
          </button>
        </div>

      </form>

      {/* MODAL DE MOT DE PASSE */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Lock className="w-5 h-5 text-indigo-600" />
              Modifier le mot de passe
            </h2>

            {passwordSuccess && <div className="mb-4 p-3 bg-green-50 text-green-700 text-sm rounded-lg border border-green-200">{passwordSuccess}</div>}
            {passwordError && <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-200">{passwordError}</div>}

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nouveau mot de passe</label>
                <input 
                  type="password" 
                  name="password"
                  required
                  minLength={6}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none"
                  placeholder="Minimum 6 caractères"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Confirmer le nouveau mot de passe</label>
                <input 
                  type="password" 
                  name="confirm_password"
                  required
                  minLength={6}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none"
                  placeholder="Répétez le mot de passe"
                />
              </div>

              <div className="flex gap-3 justify-end pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowPasswordModal(false)
                    setPasswordError('')
                    setPasswordSuccess('')
                  }}
                  className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-50 rounded-lg transition"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isUpdatingPassword}
                  className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
                >
                  {isUpdatingPassword ? 'Mise à jour...' : 'Confirmer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
