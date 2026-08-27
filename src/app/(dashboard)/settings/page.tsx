import { getUserProfile } from './actions'
import SettingsForm from './SettingsForm'

export default async function SettingsPage() {
  const profile = await getUserProfile()

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2 text-slate-900">Paramètres</h1>
        <p className="text-slate-600">Gérez vos informations personnelles et vos préférences d'affichage.</p>
      </div>

      <SettingsForm initialProfile={profile} />
    </div>
  )
}
