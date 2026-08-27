'use client'

import { addPerformance } from "./actions";
import { useState } from "react";
import CustomDatePicker from "./CustomDatePicker";

export default function RentabilityForm({ markets }: { markets: any[] }) {
  const today = new Date().toISOString().split('T')[0]
  const [selectedDate, setSelectedDate] = useState(today)
  const [selectedMarketId, setSelectedMarketId] = useState<string>('')
  const [error, setError] = useState<string | null>(null)

  const selectedMarket = markets.find(m => m.id === selectedMarketId)
  const currency = selectedMarket?.currency || 'XOF'

  async function handleSubmit(formData: FormData) {
    setError(null)
    try {
      await addPerformance(formData)
    } catch (e: any) {
      setError(e.message)
    }
  }

  if (markets.length === 0) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 text-center">
        <p className="text-slate-600 mb-4">Vous devez d'abord configurer un produit sur un marché dans la page Produits.</p>
      </div>
    )
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
      <h2 className="text-xl font-bold text-slate-800 mb-4">Saisir les performances</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-200">
          {error}
        </div>
      )}

      <form action={handleSubmit} className="space-y-4">
        
        <div className="relative">
          <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="date">Date</label>
          <CustomDatePicker 
            value={selectedDate}
            onChange={(val) => setSelectedDate(val)}
          />
          <input type="hidden" name="date" value={selectedDate} />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="product_market_id">Produit & Marché</label>
          <select 
            id="product_market_id" 
            name="product_market_id" 
            required 
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-white"
            value={selectedMarketId}
            onChange={(e) => setSelectedMarketId(e.target.value)}
          >
            <option value="" disabled>Sélectionnez un produit...</option>
            {markets.map(m => (
              <option key={m.id} value={m.id}>
                {m.products.name} - {m.country} (Coût: {m.cost_price} {m.currency || 'XOF'})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="quantity">Nombre de pièces livrées</label>
          <input 
            id="quantity" name="quantity" type="number" required min="0" step="1"
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500" 
            placeholder="Ex: 15"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="revenue">CA hors livraison (encaissé net) en {currency}</label>
          <input 
            id="revenue" name="revenue" type="number" required min="0" step="0.01"
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500" 
            placeholder="Ex: 8000"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="ad_spend">Dépenses Publicitaires ({currency})</label>
          <input 
            id="ad_spend" name="ad_spend" type="number" required min="0" step="0.01"
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500" 
            placeholder="Ex: 35000"
          />
        </div>

        <button 
          type="submit" 
          className="w-full bg-indigo-600 text-white font-semibold py-2.5 rounded-lg hover:bg-indigo-700 transition mt-2"
        >
          Enregistrer
        </button>
      </form>
    </div>
  )
}
