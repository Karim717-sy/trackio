'use client'

import { useState } from "react"
import { addProductMarket } from "./actions"
import { COUNTRIES } from "@/utils/constants"

export default function ProductForm({ existingProducts }: { existingProducts: any[] }) {
  const [isNewProduct, setIsNewProduct] = useState(existingProducts.length === 0)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(formData: FormData) {
    setError(null)
    try {
      await addProductMarket(formData)
      // Optional: reset form or show success state
    } catch (e: any) {
      setError(e.message)
    }
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
      <h2 className="text-xl font-bold text-slate-800 mb-4">Ajouter sur un marché</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-200">
          {error}
        </div>
      )}

      <form action={handleSubmit} className="space-y-4">
        
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="product_id">Produit</label>
          <select 
            id="product_id" 
            name="product_id" 
            required 
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-white"
            onChange={(e) => setIsNewProduct(e.target.value === 'NEW')}
            defaultValue={existingProducts.length === 0 ? 'NEW' : ''}
          >
            {existingProducts.length > 0 && <option value="" disabled>Sélectionnez un produit...</option>}
            {existingProducts.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
            <option value="NEW">+ Nouveau produit</option>
          </select>
        </div>

        {isNewProduct && (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="new_product_name">Nom du nouveau produit</label>
            <input 
              id="new_product_name" name="new_product_name" type="text" required={isNewProduct} 
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500" 
              placeholder="Ex: Montre connectée X1"
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="country">Pays / Marché</label>
          <select 
            id="country" name="country" required 
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-white"
            defaultValue=""
          >
            <option value="" disabled>Sélectionnez un pays...</option>
            {COUNTRIES.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="selling_price">Prix de vente (FCFA)</label>
          <input 
            id="selling_price" name="selling_price" type="number" required min="0" step="1"
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500" 
            placeholder="Ex: 15000"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="cost_price">Coût de revient (FCFA)</label>
          <input 
            id="cost_price" name="cost_price" type="number" required min="0" step="1"
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500" 
            placeholder="Ex: 4500"
          />
          <p className="text-xs text-slate-500 mt-1">Incluez le prix d'achat, packaging, etc.</p>
        </div>

        <button 
          type="submit" 
          className="w-full bg-indigo-600 text-white font-semibold py-2.5 rounded-lg hover:bg-indigo-700 transition"
        >
          Enregistrer
        </button>
      </form>
    </div>
  )
}
