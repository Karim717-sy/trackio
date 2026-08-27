'use client'

import { addSupply } from "./actions";
import { useState, useMemo } from "react";
import CustomDatePicker from "@/app/(dashboard)/rentability/CustomDatePicker";
import { COUNTRIES } from "@/utils/constants";

export default function SupplyForm({ markets }: { markets: any[] }) {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [selectedMarketId, setSelectedMarketId] = useState('')
  const [error, setError] = useState<string | null>(null)

  const selectedMarket = markets.find(m => m.id === selectedMarketId)
  const [isNewMarket, setIsNewMarket] = useState(false)
  
  const uniqueProducts = useMemo(() => {
    const map = new Map()
    markets.forEach(m => {
      if(!map.has(m.product_id) && m.products) {
        map.set(m.product_id, { id: m.product_id, name: m.products.name })
      }
    })
    return Array.from(map.values())
  }, [markets])
  
  const [isReallyNewProduct, setIsReallyNewProduct] = useState(uniqueProducts.length === 0)
  const [newCurrency, setNewCurrency] = useState('XOF')
  const currency = isNewMarket ? newCurrency : (selectedMarket?.currency || 'FCFA')

  async function handleSubmit(formData: FormData) {
    setError(null)
    try {
      await addSupply(formData)
      // Reset is handled by Next.js if no error
      if(isNewMarket) {
        setIsNewMarket(false)
        setSelectedMarketId('')
      }
    } catch (e: any) {
      setError(e.message)
    }
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
      <h2 className="text-xl font-bold text-slate-800 mb-4">Nouvel arrivage (Stock)</h2>
      
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
            onChange={(e) => {
              setSelectedMarketId(e.target.value)
              setIsNewMarket(e.target.value === 'NEW')
            }}
          >
            <option value="" disabled>Sélectionnez un marché...</option>
            <option value="NEW" className="font-bold text-indigo-600">➕ Créer un nouveau produit / marché</option>
            {markets.map(m => (
              <option key={m.id} value={m.id}>
                {m.products?.name} - {m.country}
              </option>
            ))}
          </select>
        </div>

        {isNewMarket && (
          <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-lg space-y-4 mb-4">
            <h3 className="text-sm font-bold text-indigo-800">Détails du nouveau produit / marché</h3>
            
            {/* On force la création d'un nouveau produit (product_id = NEW) de manière invisible */}
            <input type="hidden" name="product_id" value="NEW" />

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="new_product_name">Nom du produit</label>
              <input 
                id="new_product_name" name="new_product_name" type="text" required={isNewMarket}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500" 
                placeholder="Ex: Montre connectée"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="country">Pays / Marché</label>
                <select 
                  id="country" name="country" required={isNewMarket}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                >
                  <option value="" disabled selected>Sélectionnez un pays...</option>
                  {COUNTRIES.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="currency">Devise</label>
                <select 
                  id="currency" name="currency" required={isNewMarket}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                  value={newCurrency}
                  onChange={(e) => setNewCurrency(e.target.value)}
                >
                  <option value="XOF">XOF</option>
                  <option value="XAF">XAF</option>
                  <option value="GNF">GNF</option>
                  <option value="EUR">EUR</option>
                  <option value="USD">USD</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="selling_price">Prix de vente cible</label>
              <input 
                id="selling_price" name="selling_price" type="number" required={isNewMarket} min="0" step="0.01"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500" 
                placeholder="Ex: 25000"
              />
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="quantity">Quantité reçue (Pièces)</label>
          <input 
            id="quantity" name="quantity" type="number" required min="1" step="1"
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500" 
            placeholder="Ex: 100"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="total_purchase_price">Prix d'achat TOTAL en Chine ({currency})</label>
          <input 
            id="total_purchase_price" name="total_purchase_price" type="number" required min="0" step="0.01"
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500" 
            placeholder="Ex: 150000"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="shipping_cost">Transport Chine → Afrique ({currency})</label>
          <input 
            id="shipping_cost" name="shipping_cost" type="number" required min="0" step="0.01"
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500" 
            placeholder="Ex: 30000"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="other_costs">Autres frais (Dédouanement, etc.) ({currency})</label>
          <input 
            id="other_costs" name="other_costs" type="number" required min="0" step="0.01"
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500" 
            placeholder="Ex: 20000"
            defaultValue="0"
          />
        </div>

        <button 
          type="submit" 
          className="w-full bg-indigo-600 text-white font-semibold py-2.5 rounded-lg hover:bg-indigo-700 transition mt-4"
        >
          Ajouter au stock
        </button>
      </form>
    </div>
  )
}
