'use client'

import { useState } from "react"
import { toggleProductMarketStatus, deleteProductMarket, updateProductMarket } from "./actions"
import { Pencil, Trash2, Eye, EyeOff } from "lucide-react"

export default function ProductMarketRow({ market }: { market: any }) {
  const [isEditing, setIsEditing] = useState(false)
  const [sellingPrice, setSellingPrice] = useState(market.selling_price)
  const [costPrice, setCostPrice] = useState(market.cost_price)
  const [isUpdating, setIsUpdating] = useState(false)
  
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const confirmDelete = async () => {
    setIsDeleting(true)
    try {
      await deleteProductMarket(market.id)
    } catch (err) {
      alert("Erreur lors de la suppression")
    }
    setIsDeleting(false)
    setShowDeleteModal(false)
  }

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
      <td className="py-4 px-6 text-slate-700">{market.selling_price.toLocaleString('fr-FR')} {market.currency || 'XOF'}</td>
      <td className="py-4 px-6 text-slate-700">{market.cost_price.toLocaleString('fr-FR')} {market.currency || 'XOF'}</td>
      <td className="py-4 px-6 text-center">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${market.active ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-800'}`}>
          {market.active ? 'Actif' : 'Inactif'}
        </span>
      </td>
      <td className="py-4 px-6 text-right space-x-1 relative">
        <button 
          onClick={() => setIsEditing(true)}
          className="text-slate-400 hover:text-blue-600 transition p-1.5 rounded hover:bg-blue-50 inline-flex items-center"
          title="Modifier les prix"
        >
          <Pencil className="w-4 h-4" />
        </button>
        <form className="inline-block" action={async () => {
          await toggleProductMarketStatus(market.id, market.active);
        }}>
          <button 
            type="submit" 
            className={`transition p-1.5 rounded inline-flex items-center ${market.active ? 'text-slate-400 hover:text-amber-600 hover:bg-amber-50' : 'text-slate-400 hover:text-green-600 hover:bg-green-50'}`}
            title={market.active ? 'Désactiver (masquer dans les formulaires)' : 'Activer ce marché'}
          >
            {market.active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </form>
        <button 
          type="button" 
          className="text-slate-400 hover:text-red-600 transition p-1.5 rounded hover:bg-red-50 inline-flex items-center"
          title="Supprimer ce produit & marché"
          onClick={() => setShowDeleteModal(true)}
        >
          <Trash2 className="w-4 h-4" />
        </button>

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-sm p-6 text-left transform transition-all">
              <h3 className="text-lg font-bold text-slate-900">Supprimer ce marché ?</h3>
              <p className="mt-2 text-sm text-slate-500">
                Êtes-vous sûr de vouloir supprimer {market.products.name} ({market.country}) ? Cette action est irréversible.
              </p>
              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition"
                  disabled={isDeleting}
                >
                  Annuler
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-lg hover:bg-red-700 transition flex items-center"
                  disabled={isDeleting}
                >
                  {isDeleting ? 'Suppression...' : 'Supprimer'}
                </button>
              </div>
            </div>
          </div>
        )}
      </td>
    </tr>
  )
}
