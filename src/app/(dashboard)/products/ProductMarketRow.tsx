'use client'

import { useState } from "react"
import { toggleProductMarketStatus, deleteProductMarket, updateProductMarket } from "./actions"

export default function ProductMarketRow({ market }: { market: any }) {
  const [isEditing, setIsEditing] = useState(false)
  const [sellingPrice, setSellingPrice] = useState(market.selling_price)
  const [costPrice, setCostPrice] = useState(market.cost_price)
  const [isUpdating, setIsUpdating] = useState(false)

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsUpdating(true)
    const formData = new FormData()
    formData.append('selling_price', sellingPrice.toString())
    formData.append('cost_price', costPrice.toString())
    
    try {
      await updateProductMarket(market.id, formData)
      setIsEditing(false)
    } catch (err) {
      alert("Erreur lors de la mise à jour")
    }
    setIsUpdating(false)
  }

  if (isEditing) {
    return (
      <tr className="bg-indigo-50 transition">
        <td className="py-4 px-6 font-bold text-slate-900">{market.products.name}</td>
        <td className="py-4 px-6 text-slate-700">{market.country}</td>
        <td className="py-4 px-6">
          <input 
            type="number" 
            value={sellingPrice} 
            onChange={e => setSellingPrice(e.target.value)}
            className="w-24 px-2 py-1 border border-slate-300 rounded text-sm"
          />
        </td>
        <td className="py-4 px-6">
          <input 
            type="number" 
            value={costPrice} 
            onChange={e => setCostPrice(e.target.value)}
            className="w-24 px-2 py-1 border border-slate-300 rounded text-sm"
          />
        </td>
        <td className="py-4 px-6 text-center">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${market.active ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-800'}`}>
            {market.active ? 'Actif' : 'Inactif'}
          </span>
        </td>
        <td className="py-4 px-6 text-right space-x-2">
          <button 
            onClick={handleSave} 
            disabled={isUpdating}
            className="text-sm bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700 font-medium"
          >
            {isUpdating ? '...' : 'Sauver'}
          </button>
          <button 
            onClick={() => {
              setIsEditing(false)
              setSellingPrice(market.selling_price)
              setCostPrice(market.cost_price)
            }}
            className="text-sm text-slate-500 hover:text-slate-800 font-medium"
          >
            Annuler
          </button>
        </td>
      </tr>
    )
  }

  return (
    <tr className="hover:bg-slate-50 transition">
      <td className="py-4 px-6 font-bold text-slate-900">{market.products.name}</td>
      <td className="py-4 px-6 text-slate-700">{market.country}</td>
      <td className="py-4 px-6 text-slate-700">{market.selling_price.toLocaleString('fr-FR')} FCFA</td>
      <td className="py-4 px-6 text-slate-700">{market.cost_price.toLocaleString('fr-FR')} FCFA</td>
      <td className="py-4 px-6 text-center">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${market.active ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-800'}`}>
          {market.active ? 'Actif' : 'Inactif'}
        </span>
      </td>
      <td className="py-4 px-6 text-right space-x-2">
        <button 
          onClick={() => setIsEditing(true)}
          className="text-sm text-blue-600 hover:text-blue-900 font-medium"
        >
          Modifier
        </button>
        <span className="text-slate-300">|</span>
        <form className="inline-block" action={async () => {
          await toggleProductMarketStatus(market.id, market.active);
        }}>
          <button type="submit" className="text-sm text-indigo-600 hover:text-indigo-900 font-medium">
            {market.active ? 'Désactiver' : 'Activer'}
          </button>
        </form>
        <span className="text-slate-300">|</span>
        <form className="inline-block" action={async () => {
          await deleteProductMarket(market.id);
        }}>
          <button type="submit" className="text-sm text-red-600 hover:text-red-900 font-medium">
            Supprimer
          </button>
        </form>
      </td>
    </tr>
  )
}
